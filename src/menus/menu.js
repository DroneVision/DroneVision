const { app, Menu, dialog } = require('electron');
const darwinMenu  = require('./darwin');
const fileMenu  = require('./fileMenu');
// const droneMenu  = require('./droneMenu');

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
	  fileMenu(BrowserWindow),
	//   droneMenu
	];
  
	return Menu.buildFromTemplate(template);
  };