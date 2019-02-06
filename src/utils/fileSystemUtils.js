const { dialog, app } = window.require('electron').remote;
const fs = window.require('fs');
const path = require('path');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);

// Opening a File from electron browser

export const saveFile = (target, targetData) => {
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
        alert('An error ocurred creating the file ' + err.message);
      }
      alert('The file has been succesfully saved');
    });
  });
};

// The dialog blocks the main thread until the user select the file

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

// Saving a File from electron browser

export const loadFile = async target => {
  const fileName = await promisifiedDialog(target);
  const data = await readFileAsync(fileName);
  return JSON.parse(data);
};
