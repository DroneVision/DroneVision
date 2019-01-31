// const loadFlightInstructions = require('../utils/fileSystemUtils');
const { openFile, saveFile } = require('../../electronUtils/fileSystem');
module.exports = BrowserWindow => {

    // Create a file menu on the menu bar called "File"

    const fileMenu = {
        label: 'File',
        submenu: [
            {
                label: 'Import Flight Path',
                accelerator: 'CmdOrCtrl+O',
                click() { openFile(BrowserWindow) }
            },
            {
                label: 'Save Flight Path',
                accelerator: 'CmdOrCtrl+S',
                click() {
                    saveFile(BrowserWindow)
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