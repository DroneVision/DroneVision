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
            },
            {
                label: 'Dev tools',
                accelerator: 'CommandOrControl+Shift+I',
                click() {
                    BrowserWindow.webContents.openDevTools()
                }
            },
            {
                label: 'Refresh',
                accelerator: 'CmdOrCtrl+R',
                click() {
                    BrowserWindow.reload()
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