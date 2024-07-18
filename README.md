# Kiosk

This project is a collection of container builds and deployment yaml to run kiosk applications as containers with Kubernetes (or Podman). This is achieved by running X11 and PulseAudio inside of containers then sharing their sockets with a container that runs the workload.

The container builds are done using OpenSUSE's instance of the Open Build Service and can be found at https://build.opensuse.org/project/show/home:atgracey:wallboardos

# Benefits

Running your kiosk/HID applications this way allows for more explicit security boundaries along with allowing for a wider range of languages/frameworks when building your app.

TODO: Add complete list of benefits

# Architecture

TODO: Add drawing

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
- `xorg-x11-fonts`
- `libpulse0`
- `libavcodec58`

For an example workload and Dockerfile, check out the [electron app in this repo](./electron-example/)

# Work that I would like to get to in the future

- Replace X11 with Wayland using the [Cage project](https://github.com/cage-kiosk/cage)
- Replace PulseAudio with Pipewire
- Minimize installed packages (and container size)
- Build [buildpack](https://buildpacks.io) for Electron
- Document usage with [Epinio](https://epinio.io) to improve DX
- Rename project to something more interesting?
