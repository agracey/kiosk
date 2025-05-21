#!BuildTag: x11app-base:latest

FROM opensuse/leap:latest

RUN zypper in --no-recommends -y xorg-x11-fonts libX11-xcb1 libgtk-3-0 libpulse0 libasound2 mozilla-nss libxshmfence1 libdrm libgdm1; zypper clean -a

RUN useradd -m user -u 1000
ENV DISPLAY=":0"