'use strict';
const app = require('electron').app;
const Window = require('electron').BrowserWindow; // jshint ignore:line
const Tray = require('electron').Tray; // jshint ignore:line
const Menu = require('electron').Menu; // jshint ignore:line
const { ipcMain } = require('electron');
const setupIpcHandlers = require('./ipcHandlers'); // Import the IPC handlers setup function

const appName = require('./package.json').name;

const server = require('./app');
const host = server.listen(0, () => console.log(`Express server listening on port ${host.address().port}`));

let mainWindow = null; 
let tray = null;
let quitNow = false;

app.on('ready', function () {
  const path = require('path');
  const iconPath = path.resolve(__dirname, './server.ico');
  
  mainWindow = new Window({
    width: 800,
    height: 600,
    autoHideMenuBar: false,
    useContentSize: true,
    resizable: true,
    show: false,
    icon: iconPath,
    webPreferences: {
      // https://stackoverflow.com/a/54560886/8054241
      contextIsolation: false,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    //  'node-integration': false // otherwise various client-side things may break
  });

  // const appIcon = new Tray(iconPath);
  // appIcon.setToolTip(appName);
  // mainWindow.loadFile('index.html');
  mainWindow.loadURL(`http://localhost:${host.address().port}`);
  mainWindow.webContents.openDevTools();

  // remove this for production
  var template = [
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.reload();
            }
          }
        },
        {
          label: 'Toggle Full Screen',
          accelerator: (function () {
            if (process.platform === 'darwin') {
              return 'Ctrl+Command+F';
            } else {
              return 'F11';
            }
          })(),
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
            }
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: (function () {
            if (process.platform === 'darwin') {
              return 'Alt+Command+I';
            } else {
              return 'Ctrl+Shift+I';
            }
          })(),
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.toggleDevTools();
            }
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  //Tray icon
  // const trayicon = path.join(__dirname, '/server.ico') // required.
  // tray = new Tray(trayicon.resize({ width: 16 }))
  tray = new Tray(iconPath)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        // createWindow()
        mainWindow.show()
      }
    },
    {
      label: 'Quit',
      click: () => {
        quitNow = true;
        // app.quit() // actually quit the app.
        quitApp()
      }
    },
  ])
  tray.setToolTip(appName);
  tray.setContextMenu(contextMenu);
  tray.on('right-click',function(){
    console.log('Single click event.');
  })
  tray.on('double-click',function(){
    mainWindow.show();
  })

  mainWindow.focus();
  mainWindow.on('close',function(event){
    if(!quitNow)
      event.preventDefault();
      mainWindow.hide();
  })

});

// shut down all parts to app after windows all closed.
app.on('window-all-closed', function () {
  // app.quit();
  quitApp()
});

function quitApp(){
  // server.close();
  console.log('app quit')
  app.quit();
}

ipcMain.handle('init', async () => {
  return 'Application successfully strated in system tray!'
})

ipcMain.handle('get-versions', () => {
  return {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  };
});

ipcMain.handle('get-port', () => {
  return host.address().port;
});

setupIpcHandlers(); // Set up IPC handlers