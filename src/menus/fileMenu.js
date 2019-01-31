// const loadFlightInstructions = require('../utils/fileSystemUtils');
const { openFile} = require('../../electronUtils/fileSystem');
module.exports = BrowserWindow => {
    const fileMenu = {
        label: 'File',
        submenu: [
            {
                label: 'Open',
                accelerator: 'CmdOrCtrl+O',
                click() { openFile() }
            },
            {
                label: 'Save',
                accelerator: 'CmdOrCtrl+S',
                click() {
                    BrowserWindow.webContents.send('save-file')
                }
            }
        ]
    };

    if (process.platform === 'darwin') {
        fileMenu.submenu.push(
            { type: 'separator' },
            { label: 'Exit', role: 'quit', accelerator: 'CmdOrCtrl+Q' }
        );
    }

    return fileMenu;
}