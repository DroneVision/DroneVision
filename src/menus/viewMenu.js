module.exports = BrowserWindow => {

    // Create a view menu on the menu bar called "View"
    // This view menu supports OSX and other OSs
    
    let viewMenu;
    if(process.platform === 'darwin') {
        const viewMenuOSX = {
            label: 'View',
            submenu: [
                {
                    label: 'Dev tools',
                    accelerator: 'CommandOrControl+Option+I',
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
                    role: 'zoomin'
                },
                {
                    label: 'Zoom Out',
                    accelerator: 'CmdOrCtrl+-',
                    role: 'zoomout'
                },
                
                { role: 'togglefullscreen' }
            ]
        };
    
        viewMenu = viewMenuOSX;
    } else {
        const viewMenuOtherOS = {
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
                    role: 'zoomin'
                },
                {
                    label: 'Zoom Out',
                    accelerator: 'CmdOrCtrl+-',
                    role: 'zoomout'
                },
                
                { role: 'togglefullscreen' }
            ]
        };
    
        viewMenu = viewMenuOtherOS;
    }
    return viewMenu;
}