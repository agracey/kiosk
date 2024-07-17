import { app, BrowserWindow, globalShortcut, webContents } from "electron";
console.log("Starting Demo Kiosk App");

let win: BrowserWindow;


function createWindow() {
  win = new BrowserWindow(
    {
      width: 800,
      height: 600,
      show: false,
      fullscreen: true,
      frame: false,
      autoHideMenuBar: true,
      alwaysOnTop: true, // enable always on top to prevent other windows from appearing above it
      kiosk: true // enable kiosk mode, makes it full screen and what not 
    });

    win.loadURL("https://google.com");


  win.webContents.on("did-fail-load", function() {
    setTimeout(()=>{
      win.loadURL("https://google.com");
    }, 1000)
  });

  win.on("closed", () => {
    app.quit()
  });
  
  win.on('minimize', event => {
    console.log("Minimize triggered, prevented..");
    event.preventDefault() // stop the browser window from being closed
  })
  
  win.on('close', event => {
    console.log("Close triggered, prevented");
    event.preventDefault() // stop the browser window from being closed
  })
}

app.on("ready", () => {
  createWindow();
});