const { ipcRenderer } = require('electron')

document.getElementById('port').onclick = () => {
  // Send a IPC sync message to electron
  // See main.js on line 42
  document.getElementById('port').innerText = ipcRenderer.sendSync('port', 'port')
}


ipcRenderer.on('token', (event, token) => {
  document.getElementById('token').textContent = token
})

ipcRenderer.on('push', (event, payload) => {
  console.log(payload)

  const myNotification = new Notification('Electrolytic', {
    body: payload
  })
})