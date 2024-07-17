#!BuildTag: x11app-base:latest

FROM opensuse/leap:15.5

RUN zypper in -y xorg-x11-fonts libX11-xcb1 libgtk-3-0 libpulse0 npm-default nodejs-default; zypper clean -a

RUN useradd -m user -u 1000
ENV DISPLAY=":0"