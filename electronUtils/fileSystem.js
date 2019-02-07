const { dialog, app, ipcMain } = require('electron');
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');

const readFileAsync = promisify(fs.readFile);

// The dialog blocks the main thread until user selects a valid file.

const promisifiedDialog = target => {
  const fileExt = target === 'flight-instructions' ? 'dvz' : 'dvzo';
  const options = {
    properties: ['openFile'],
    defaultPath: app.getPath('desktop'),
    filters: [{ name: 'object', extensions: [fileExt] }],
  };
  return new Promise((resolve, reject) => {
    dialog.showOpenDialog(null, options, (fileName, err) => {
      if (!err && fileName !== undefined) {
        resolve(fileName[0]);
      } else {
        reject(err);
      }
    });
  });
};

const readFile = async target => {
  const fileName = await promisifiedDialog(target);
  const data = await readFileAsync(fileName);
  return JSON.parse(data);
};
// Opening a File from menu bar
const loadFile = async (mainWindow, target) => {
  const targetData = await readFile(target);
  mainWindow.webContents.send(`load-${target}`, targetData);
};

// Saving a File from menu bar
const saveFile = async (mainWindow, target) => {
  //target is 'flight-instructions' or 'scene-objects'

  // send a message to browser
  mainWindow.webContents.send(`save-${target}`);

  // Listen for flight instructions
  ipcMain.on(`send-${target}`, (event, targetData) => {
    const fileName =
      target === 'flight-instructions'
        ? 'flightInstructions.dvz'
        : 'sceneObjects.dvzo';

    const fileExt = target === 'flight-instructions' ? 'dvz' : 'dvzo';

    const options = {
      defaultPath: path.join(app.getPath('desktop'), fileName),
      // Add a file extension
      filters: [{ name: 'object', extensions: [fileExt] }],
    };

    dialog.showSaveDialog(null, options, fileName => {
      if (fileName === undefined) {
        return;
      }
      fs.writeFile(fileName, JSON.stringify(targetData), err => {
        if (err) {
          // Display a dialog that an error ocurred creating the file
          dialog.showMessageBox(mainWindow, {
            type: 'error',
            buttons: ['Ok'],
            message: 'Error',
            detail: 'An error ocurred creating the file' + err.message,
          });
        }
        // Display a dialog that the file has been succesfully saved
        dialog.showMessageBox(mainWindow, {
          type: 'info',
          buttons: ['Ok'],
          message: 'Success',
          detail: 'The file has been succesfully saved',
        });
      });
    });
  });
};

module.exports = {
  loadFile,
  saveFile,
};
