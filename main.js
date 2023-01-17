'use strict';
const app = require('electron').app;
const Window = require('electron').BrowserWindow; // jshint ignore:line
const Tray = require('electron').Tray; // jshint ignore:line
const Menu = require('electron').Menu; // jshint ignore:line
const { ipcMain } = require('electron');
const appName = require('./package.json').name;
const fs = require('fs');

const server = require('./app');
const port = 3000;
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
		//  'node-integration': false // otherwise various client-side things may break
	});
	// const appIcon = new Tray(iconPath);
	// appIcon.setToolTip('My Cool App');
	mainWindow.loadURL(`http://localhost:${host.address().port}`);

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
				app.quit() // actually quit the app.
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
	app.quit();
});

// Receive sync message from renderer
// See file renderer.js
ipcMain.on('port', event => {
	event.returnValue = `${host.address().port}`
});
