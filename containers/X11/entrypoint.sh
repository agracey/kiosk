#!/bin/bash

# Function to log messages
log() {
    echo "[$(date +'%Y-%m-%dT%H:%M:%S%z')] $@"
}

log "Starting X11 entrypoint script"

# Check if the DISPLAY environment variable is set
if [ -z "$DISPLAY" ]; then
    log "DISPLAY variable is not set, defaulting to :0"
    DISPLAY=:0
fi

# Extract display number from DISPLAY variable
DISPLAY_NUM=$(echo $DISPLAY | sed 's/^://')

# Clean up the specific X server lock files and sockets
log "Cleaning up existing X server lock files for display $DISPLAY"
rm -f /tmp/.X${DISPLAY_NUM}-lock /tmp/.X11-unix/X${DISPLAY_NUM}

if [ $# -gt 0 ]; then
    log "Executing custom command: $@"
    exec "$@"
else
    log "Starting X server on display $DISPLAY"
    exec startx -- "$DISPLAY"
fi
