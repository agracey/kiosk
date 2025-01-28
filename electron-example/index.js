const { app, BrowserWindow } = require("electron")
console.log("Starting Demo Kiosk App");

const sample_url = process.env.URL || "./index.html"


function createWindow() {
  win = new BrowserWindow(
    {
      width: 800,
      height: 600,
      show: true,
      fullscreen: true,
      frame: false,
      autoHideMenuBar: true,
      alwaysOnTop: true, // enable always on top to prevent other windows from appearing above it
      kiosk: true // enable kiosk mode, makes it full screen and what not 
    });
  
  const load = process.env.URL.startsWith("http") ? win.loadPage: win.loadFile

  load(sample_url)

  const ses = win.webContents.session

  ses.webRequest.onHeadersReceived({urls: ['https://cockpit.local:9090/*']}, (res, callback) => {
    const responseHeaders = res.responseHeaders
    // This is not a security issue because we can tightly control traffic into and out of the container. Also, this is only affecting `cockpit.local:9090`
    if (responseHeaders['X-Frame-Options']) {
      delete responseHeaders['X-Frame-Options']
    }
    // Allow for logging in. The security issues this opens are mitigated by the `credentialless` option on the iframe.
    if (responseHeaders['Set-Cookie']) {
      responseHeaders['Set-Cookie'] = Array.from(responseHeaders['Set-Cookie'])
                                           .map((cookie) => (
                                             cookie.replace('SameSite=Strict', 'SameSite=None')))
    }

    callback({responseHeaders})
  })

  win.webContents.on("did-fail-load", function() {
    console.log('Load failed')

    setTimeout(()=>{
      console.log(`Trying to load ${sample_url} again`)
      load(sample_url);
    }, 5000)
  })

  win.on("closed", () => {
    app.quit()
  })

  win.on('minimize', event => {
    console.log("Minimize triggered, prevented..");
    event.preventDefault() // stop the browser window from being closed
  })

  win.on('close', event => {
    console.log("Close triggered, prevented");
    event.preventDefault() // stop the browser window from being closed
  })
}

app.whenReady().then(() => {
  console.log(`Ready. Trying to load: ${sample_url}` )
  createWindow();
});
