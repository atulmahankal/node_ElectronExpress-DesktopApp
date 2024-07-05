const { ipcMain } = require('electron');

const processName = (name) => {
  const length = name.length;
  return length;
};

const setupIpcHandlers = () => {
  ipcMain.handle('process-name', (event, name) => {
    return processName(name);
  });
};

module.exports = setupIpcHandlers;