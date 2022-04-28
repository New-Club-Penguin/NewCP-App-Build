const { app, BrowserWindow, Menu, autoUpdater } = require('electron');
const path = require('path');
const isMac = process.platform === 'darwin'
require('update-electron-app')({repo: 'New-Club-Penguin/NewCP-App-Build'});
const discord_client = require('discord-rich-presence')('793878460157788220');
if (require('electron-squirrel-startup')) {app.quit();}

let pluginName;
switch (process.platform) {
  case 'win32':
    pluginName = 'lib/pepflashplayer.dll'
  break
  case 'darwin':
    pluginName = 'lib/PepperFlashPlayer.plugin'
  break
  case 'linux':
    pluginName = 'lib/libpepflashplayer.so'
    app.commandLine.appendSwitch('no-sandbox');
  break
}
pluginName = path.join(path.dirname(__dirname), pluginName);
console.log("Plugin's Name: ", pluginName);
app.commandLine.appendSwitch('ppapi-flash-path', pluginName);
app.commandLine.appendSwitch('ppapi-flash-version', '31.0.0.122');
app.commandLine.appendSwitch("disable-http-cache");

function createWindow () {
  const mainWindow = new BrowserWindow({
    minWidth: 640,
    minHeight: 640,
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        devTools: false
    }
  })

  const splashWindow = new BrowserWindow ({
    width: 600,
    height: 274,
    frame: false,
    transparent: true,
    resizable: false,
    maximizable: false,
    minimizable: false, 
    skipTaskbar: true,
    webPreferences: {
        devTools: false
    }
  })

  splashWindow.loadFile('src/splash.html');
  mainWindow.loadURL('https://newcp.net/en/')

  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      splashWindow.destroy();
      mainWindow.show();
    }, 3200);
  });

  discord_client.updatePresence({
    state: 'Waddling',
    details: 'New Club Penguin',
    startTimestamp: Date.now(),
    largeImageKey: 'ncpapp',
    instance: true
  });
}

app.setAsDefaultProtocolClient('newcp');
app.whenReady().then(() => {createWindow()})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit(); discord_client.disconnect();
  }
});

const template = [
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'quit' }
    ]
  }] : []),
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)