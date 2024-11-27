# Kiosk

This project is a collection of container builds and deployment yaml to run kiosk applications as containers with Kubernetes (or Podman). This is achieved by running X11 and PulseAudio inside of containers then sharing their sockets with a container that runs the workload.

The container builds are done using OpenSUSE's instance of the Open Build Service and can be found at https://build.opensuse.org/project/show/home:atgracey:wallboardos

# Benefits

Running your kiosk/HID applications this way allows for more explicit security boundaries along with allowing for a wider range of languages/frameworks when building your app.

# Architecture

The Kubernetes Pod contains the three containers (X11, PulseAudio, and the workload itself)

The workload and X11 containers use a unix socket that's created in an EmptyDir to allow communication between containers. They also use an EmptyDir to share an auth token.

The workload and PulseAudio containers communicate over the shared local network within the Pod.

Both the PulseAudio and X11 containers use udev to communicate with the hardware. (That's a slight oversimplification...)

![Architecture](/architecture.png)

## Startup Flow

When the server is starting up, here's the order of which components control what's being shown on the display.

- UEFI (Firmware)

The first thing you see is determined by the system's firmware. Different system manufactures provide more or less control over this portion of the process.

- Grub Bootloader

Grub then takes over from the firmware and shows the boot menu. This step can be branded or skipped depending on needs.

- Linux Framebuffer device

Once the system starts booting and execution is handed from the bootloader to the linux kernel, the system will start displaying logs or other basic graphics. The logs can be removed by adding `quiet` to the kernel arguments and we can write an image directly to the framebuffer.

- X11 

When X11 starts up, it will take over the display and show a desktop. When we don't run a taskbar or any applications, you will only see the background. By replacing the background, you can change what's displayed while the application is starting.

- Application

Lastly, the application itself will be composited on top of the background. For most kiosk applications, you will likely want to have this be fullscreen so the background becomes hidden.


## Failure modes

The steps above (after GRUB) stack above each other so if a layer fails, you should see the layer below it. For example, if the application fails you will see the X11 background while the app container is being restarted and, if X11 is restarted, you will see the framebuffer.


# Running the basic demo

To run the basic demo in Kubernetes:
- Install a Linux and boot to a command line instead of a desktop environment
- Install [K3s](k3s.io) or Kubernetes distribution of your choice (v1.29 or newer)
- Download or clone this repo
- Run `kubectl apply -f ./yaml/basic.yaml`

# Building a custom application

If you want to replace firefox with your own application, you need to build your application into an OCI container image. 

The application container needs the appropriate libraries to be able to communicate with X11. For Electron apps, here are the libraries required:

- `libX11-xcb1`
- `libgtk-3-0`
- `mozilla-nss`
- `xorg-x11-fonts`
- `libpulse0`
- `libavcodec58`
- `libasound2` 
- `npm-default`
- `nodejs-default`

For an example workload and Dockerfile, check out the [electron app in this repo](./electron-example/)

# Work that I would like to get to in the future

- Replace X11 with Wayland using the [Cage project](https://github.com/cage-kiosk/cage)
- Replace PulseAudio with Pipewire
- Reduce installed packages (and container size) as possible
- Build a [buildpack](https://buildpacks.io) for Electron
- Document usage with [Epinio](https://epinio.io) to improve DX
- Rename project to something more interesting?


# Misc how-to's (to reorganize)

## Removing console output during boot

Adding `quiet` to your kernel bootargs will remove the text that is seen on boot of linux systems.

Masking `console-getty.service` and `getty@tty1.service` will remove the login prompt. 

Doing both of these will show a blank screen with a flashing cursor in the top-left corner. To show something on screen between the GRUB splash screen, you could use `plymouth` or just `cat` a raw framebuffer file to `/dev/fb0`. (Check out https://github.com/zqb-all/convertfb for a tool on converting images to the right format)

## Turning off key combinations

To disallow closing the application or otherwise tampering with the kiosk, it can be useful to remap or turn of certain keys. This can be done using (xmodmap)[https://linux.die.net/man/1/xmodmap]

The helm chart allows for customizing this file with a values.yaml that looks like this: 

```
X11:
  keyboardModMap: |
    clear control
    clear mod1
    clear mod2 
    clear mod3
    clear mod4
    clear mod5
    keycode  66 =
    keycode 108 =
    keycode 133 =
    keycode 134 =
    keycode 150 =
    keycode 204 =
    keycode 205 =
    keycode 206 =
    keycode 207 =
```

## Remote Debugging the browser 

Chromium based browsers (including Firefox and Electron) allow for attaching a remote debugger/developer tools. 

TODO: Test and write up how to expose the port and connect to it. (and likely add flag in helm chart)
