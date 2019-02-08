// const loadFlightInstructions = require('../utils/fileSystemUtils');
const { loadFile, saveFile } = require('../../electronUtils/fileSystem');
module.exports = BrowserWindow => {
  // Create a file menu on the menu bar called "File"

  const fileMenu = {
    label: 'File',
    submenu: [
      {
        label: 'Save Flight Path',
        accelerator: 'CmdOrCtrl+S',
        click() {
          saveFile(BrowserWindow, 'flight-instructions');
        },
      },
      {
        label: 'Import Flight Path',
        accelerator: 'CmdOrCtrl+O',
        click() {
          loadFile(BrowserWindow, 'flight-instructions');
        },
      },
      {
        label: 'Save Scene Objects',
        accelerator: 'CmdOrCtrl+Shift+S',
        click() {
          saveFile(BrowserWindow, 'scene-objects');
        },
      },
      {
        label: 'Import Scene Objects',
        accelerator: 'CmdOrCtrl+Shift+O',
        click() {
          loadFile(BrowserWindow, 'scene-objects');
        },
      },
      {
        label: 'Import Flight Path and Scene',
        accelerator: 'CmdOrCtrl+Shift+D+Z',
        click() {
          loadFile(BrowserWindow, 'both');
        },
      },
    ],
  };

  if (process.platform === 'darwin') {
    fileMenu.submenu.push(
      { type: 'separator' },
      { label: 'Exit', role: 'quit', accelerator: 'CmdOrCtrl+Q' }
    );
  }

  return fileMenu;
};
