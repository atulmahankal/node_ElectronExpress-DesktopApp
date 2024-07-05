const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
  // show alert message while express load with init handler fromm main.js
  ipcRenderer.invoke('init').then(res => {
    window.alert(res)
  })
})

window.appAPI = {
  getVersions: () => ipcRenderer.invoke('get-versions'),
  getPort: () => ipcRenderer.invoke('get-port'),
  processName: (name) => ipcRenderer.invoke('process-name', name),
};