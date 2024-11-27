#!BuildTag: x11:notaskbar

FROM opensuse/leap:latest

RUN zypper in -y --no-recommends hostname which xinit xhost xorg-x11 xorg-x11-server xrandr xsession icewm-lite xf86-input-evdev xf86-input-libinput xkeyboard-config xinput ; zypper clean -a


RUN useradd -m user -u 1000
COPY preferences /etc/icewm/preferences
COPY xinitrc /etc/X11/xinit/xinitrc
COPY xorg.conf /etc/X11/xorg.conf.d/xorg.conf

ENV XDG_SESSION_TYPE=x11

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]