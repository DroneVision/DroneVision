// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Menu } = require('electron');

const appMenu = require('./menus/menu');

// Drone init import
const droneInit = require('./drone/droneInit');
const { runSingleInstruction, runInstructionList, getDroneState } = droneInit();

//Video streaming
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

//BEGIN RECORD VIDEO

//LEave this for now, we may need it to stop video encoding manually
const stopRecording = movie => {
  return movie.ffmpegProc.stdin.write('q');
};

let currentVid;

ipcMain.on('start-recording', () => {
  let formattedDateString = new Date()
    .toString()
    .split(' ')
    .splice(1, 4)
    .join('-');

  let command = new ffmpeg('udp://0.0.0.0:11111')
    .size('640x?')
    .aspect('4:3')
    .output(`./DroneVision-${formattedDateString}.mp4`)
    .on('end', () => {
      console.log('duration is over');
    });

  runSingleInstruction('command');
  runSingleInstruction('streamon');
  currentVid = command;
  currentVid.run();
  console.log('video is recording now');
});

ipcMain.on('stop-recording', () => {
  stopRecording(currentVid);
  setTimeout(() => {
    runSingleInstruction('streamoff');
    currentVid.kill();
  }, 5000);
  console.log('video should stop recording now');
});

// END RECORD VIDEO

ipcMain.on('get-available-videos', evt => {
  fs.readdir(`${__dirname}/videos`, (err, files) => {
    if (err) {
      console.log('error', err);
    } else {
      const videos = files.filter(el => !el.startsWith('index'))
      evt.sender.send('has-available-videos', videos);
    }
  });
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 1400, height: 1400, minWidth: 1195 , minHeight: 900 });

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
app.on('ready', () => {
  createWindow();
  Menu.setApplicationMenu(appMenu(mainWindow));
  //Menu.setApplicationMenu(null);
});

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

ipcMain.on('enable-video-stream', (event, instruction) => {
  console.log('Enable Stream Request Sent from Browser:');
  console.log(instruction);
  runSingleInstruction('instruction');
});

ipcMain.on('disable-video-stream', () => {
  console.log('Disable Stream Request Sent from Browser:');
  runSingleInstruction('streamoff');
});

ipcMain.on('getDroneState', async (event, droneState) => {
  let updatedState = await getDroneState();
  event.sender.send('updatedDroneState', updatedState);
});
