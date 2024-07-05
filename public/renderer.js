document.addEventListener('DOMContentLoaded', async () => {
  const versions = await window.appAPI.getVersions();
  const information = document.getElementById('info');
  information.innerHTML = `This app is using <b>Chrome</b> (v${versions.chrome}), <b>Node.js</b> (v${versions.node}), and <b>Electron</b> (v${versions.electron})`;
});
document.getElementById('port').onclick = async () => {
  document.getElementById('port').innerText = await window.appAPI.getPort();
}

document.getElementById('send-name').onclick = async () => {
  const name =  document.getElementById('name').value;
  const length =  await window.appAPI.processName(name);
  document.getElementById('result').textContent = `Number of characters: ${length}`;
};