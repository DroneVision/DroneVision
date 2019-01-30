// import { app } from 'electron';
// const { openFile } = require('../../utils/fileSystem');

// // Drone init import
// const droneInit = require('../drone/droneInit');
// const { runSingleInstruction } = droneInit();


// export default function(BrowserWindow) {
    
// }

// const template = [
// 	{
// 		label: 'App',
// 		submenu: [
// 			{
// 				label: 'Exit',
// 				click() {
// 					app.exit();
// 				}
// 			}
// 		]
// 	},
// 	{
// 		label: 'File',
// 		submenu: [
// 			{
// 				label: 'Open...',
// 				accelerator: 'CmdOrCtrl+O',
// 				click() { openFile() }
// 			},
// 			{
// 				label: 'Save...',
// 				accelerator: 'CmdOrCtrl+S',
// 				click() {
// 					// We can't call saveFile(content) directly because we need to get
// 					// the content from the renderer process. So, send a message to the
// 					// renderer, telling it we want to save the file.
// 					currentWindow.webContents.send('save-file')
// 				}
// 			},
// 			{
// 				label: 'Exit',
// 				click() {
// 					app.exit();
// 				},
// 			}
// 		]
// 	},
// 	{
// 		label: 'Drone',
// 		submenu: [
// 			{
// 				label: 'Connect to Drone',
// 				click() {
// 					runSingleInstruction('command');
// 				},
// 			},
// 		],
// 	},
// ];

// module.exports = template;


const { app, Menu, dialog } = require('electron');
const darwinMenu  = require('./darwin');
const fileMenu  = require('./fileMenu');

module.exports = BrowserWindow => {
	const currentYear = new Date().getFullYear();
  
	const showDroneVisionAbout = () => {
	  dialog.showMessageBox({
		type: 'info',
		title: `About ${app.getName()}`,
		message: `${app.getName()} v${app.getVersion()}`,
		detail: `Drone Vision\nSee the Info menu for a link to the source code.\n\nCopyright © ${currentYear} Zach, Josh, Jusin, and Top`,
		buttons: []
	  });
	};
  
	const template = [
	  ...(process.platform === 'darwin' ? [darwinMenu(showDroneVisionAbout)] : []),
	  fileMenu(BrowserWindow)
	];
  
	return Menu.buildFromTemplate(template);
  };