# Note: This currently only works on x86_64

FROM registry.opensuse.org/home/atgracey/wallboardos/15.5/x11app-base:latest as build

WORKDIR /app
COPY . .
RUN npm i 
RUN npm run build

FROM registry.opensuse.org/home/atgracey/wallboardos/15.5/x11app-base:latest

WORKDIR /app
COPY --from=build /app/deployment/linux-unpacked/ /app/


CMD ["/app/electron-example"]