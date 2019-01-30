const { openFile } = require('../../utils/fileSystem');

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
                label: 'Save...',
                accelerator: 'CmdOrCtrl+S',
                click() {
                    // We can't call saveFile(content) directly because we need to get
                    // the content from the renderer process. So, send a message to the
                    // renderer, telling it we want to save the file.
                    BrowserWindow.webContents.send('save-file')
                }
            }
        ]
    };

    if (process.platform === 'darwin') {
        fileMenu.submenu.push(
            { type: 'separator' },
            { label: 'Exit', role: 'quit', accelerator: 'Ctrl+Q' }
        );
    }

    return fileMenu;
}