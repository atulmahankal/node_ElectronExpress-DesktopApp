const { ipcRenderer } = require('electron')

document.getElementById('port').onclick = () => {
  // Send a IPC sync message to electron
  // See main.js on line 42
  document.getElementById('port').innerText = ipcRenderer.sendSync('port', 'port')
}