const { app, Menu, dialog } = require('electron');
const darwinMenu  = require('./darwin');
const fileMenu = require('./fileMenu');
const droneMenu  = require('./droneMenu');
const viewMenu = require('./viewMenu');
const windowMenu = require('./windowMenu');

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

	// Render the menu bar and menu items
  
	const template = [
		// Check if we are using an OSX
	  ...(process.platform === 'darwin' ? [darwinMenu(showDroneVisionAbout)] : []),
		fileMenu(BrowserWindow),
		viewMenu(BrowserWindow),
		windowMenu,
		droneMenu
	];
  
	return Menu.buildFromTemplate(template);
  };
