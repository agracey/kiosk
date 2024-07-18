const { app, BrowserWindow } = require("electron")
console.log("Starting Demo Kiosk App");

const sample_url = process.env.URL || "https://google.com"


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

    win.loadURL(sample_url);


  win.webContents.on("did-fail-load", function() {
    console.log('Load failed')
    setTimeout(()=>{
      console.log(`Trying to load ${sample_url} again`)
      win.loadURL(sample_url);
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
  console.log('Ready. Trying to load: ' + sample_url)
  createWindow();
});