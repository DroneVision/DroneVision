module.exports = BrowserWindow => {
    const viewMenu = {
        label: 'View',
        submenu: [
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
            },
            {
                label: 'Zoom In',
                accelerator: 'CmdOrCtrl+Plus',
                role: 'zoomIn'
            },
            {
                label: 'Zoom Out',
                accelerator: 'CmdOrCtrl+-',
                role: 'zoomOut'
            }
        ]
    };

    return viewMenu;
}