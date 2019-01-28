// Modules to control application life and create native browser window
// const { app, BrowserWindow, ipcMain } = require('electron');
const { app, BrowserWindow, ipcMain } = require('electron');

// Drone init import
const droneInit = require('./drone/droneInit');

require('electron-reload')(__dirname);
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 1400, height: 1400 });

  // and load the index.html of the app.
  mainWindow.loadURL('http://localhost:3000');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

//THIS IS FOR JOSH'S COMPUTER TO WORK!
app.commandLine.appendSwitch('ignore-gpu-blacklist');
// app.disableDomainBlockingFor3DAPIs();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Front-end - Back-end Communication
// ipcMain.on('connect-to-drone', (event, arg) => {
const { runSingleInstruction, runInstructionList, getDroneState } = droneInit();

ipcMain.on('takeoff', () => {
  console.log('Take-off Sent from Browser:');
  runSingleInstruction('command');
  runSingleInstruction('takeoff');
});

ipcMain.on('single-instruction', (evt, instruction) => {
  console.log('Single instruction Sent from Browser:');
  console.log(instruction);
  runSingleInstruction(instruction);
});

ipcMain.on('autopilot', (evt, instructions) => {
  console.log('Multiple instructions Sent from Browser:');
  console.log(instructions);
  runInstructionList(instructions);
});

ipcMain.on('getDroneState', async (event, droneState) => {
  // console.log('droneState: ', droneState);
  let updatedState = await getDroneState();
  event.sender.send('updatedDroneState', updatedState);
});
// });
