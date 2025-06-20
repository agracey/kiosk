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
  
  const load = (url) => {
    console.log('Trying to load: ', url)
    if(url.startsWith("http")) {
      console.log('as url')
      win.loadURL(url)
    } else {
      console.log('as file')
      win.loadFile(url)
    } 
  }

  //win.webContents.openDevTools();

  const ses = win.webContents.session

  ses.webRequest.onHeadersReceived({urls: ['https://cockpit.local:9090/*']}, (res, callback) => {
    const responseHeaders = res.responseHeaders
    // This is not a security issue because we can tightly control traffic into and out of the container. 
    //   Also, this is only affecting `cockpit.local:9090`
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

  load(sample_url)
}

app.whenReady().then(() => {
  console.log(`Ready` )
  createWindow()
});

app.commandLine.appendSwitch('enable-features', 'DocumentPolicyIncludeJSCallStacksInCrashReports');
app.commandLine.appendSwitch('ignore-certificate-errors');
app.commandLine.appendSwitch('remote-debugging-port', '8315');
app.commandLine.appendSwitch('remote-allow-origins', '*');
app.commandLine.appendSwitch('remote-debugging-address', '0.0.0.0');
app.commandLine.appendSwitch('disable-shm-usage');
app.commandLine.appendSwitch('disable-dev-shm-usage');
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('disable-autofill-keyboard-accessory-view');
app.commandLine.appendSwitch('disable-autofill');
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('no-zygote');
app.commandLine.appendSwitch('dbus-stub');
