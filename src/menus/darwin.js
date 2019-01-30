const { app } = require('electron');

module.exports = showDroneVisionAbout => {
  return {
    label: app.getName(),
    submenu: [
      {
        label: 'About DroneVision',
        click() {
            showDroneVisionAbout();
        }
      },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  };
};