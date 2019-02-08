const { dialog, app, ipcMain } = require('electron');
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');

const readFileAsync = promisify(fs.readFile);

// The dialog blocks the main thread until user selects a valid file.

const promisifiedDialog = target => {
  let fileExt;
  if (target === 'both') {
    fileExt = ['dvz', 'dvzo'];
  } else if (target === 'flight-instructions') {
    fileExt = ['dvz'];
  } else {
    fileExt = ['dvzo'];
  }

  const options = {
    properties: ['openFile', 'multiSelections'],
    defaultPath: app.getPath('desktop'),
    filters: [{ name: 'object', extensions: fileExt }],
  };
  return new Promise((resolve, reject) => {
    dialog.showOpenDialog(null, options, (fileNames, err) => {
      if (!err && fileNames !== undefined) {
        resolve(fileNames);
      } else {
        reject(err);
      }
    });
  });
};

const readFile = async target => {
  const fileNames = await promisifiedDialog(target);
  const res = [];
  for (let fileName of fileNames) {
    const data = await readFileAsync(fileName);
    res.push(JSON.parse(data));
  }
  return res.reduce((accum, el) => ({ ...accum, ...el }), {});
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
      const targetObj = {};
      targetObj[target] = targetData;
      fs.writeFile(fileName, JSON.stringify(targetObj), err => {
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
