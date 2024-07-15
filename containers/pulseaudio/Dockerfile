#!BuildTag: pa

FROM opensuse/leap:15.5

RUN zypper in -y pulseaudio pulseaudio-utils

COPY daemon.conf /etc/pulse/
COPY client.conf /etc/pulse/
COPY system.pa /etc/pulse/

CMD ["pulseaudio"]