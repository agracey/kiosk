# Note: This currently only works on x86_64

# FROM registry.opensuse.org/home/atgracey/wallboardos/opensuse_tumbleweed/x11app-base:latest as build
FROM registry.opensuse.org/home/atgracey/wallboardos/15.6/x11app-base:latest as build

RUN zypper up; zypper in -y nodejs22 npm22  ; zypper clean -a

WORKDIR /app
COPY . .
RUN npm i 
RUN chown 1000 -R . 

USER user

#CMD ["/app/electron-example", "--no-sandbox", "--no-zygote"]
CMD ["/app/node_modules/electron/dist/electron", "."]
#CMD ["/app/node_modules/electron/dist/electron", ".", "--no-sandbox", "--remote-debugging-port=6000", "--inspect=0.0.0.0:6001", "--enable-logging", "--log-level=5", "--disable-shm-usage"]

