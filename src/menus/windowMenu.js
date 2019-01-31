// Create a window menu on the menu bar called "Window"

const windowMenu = {
    label: 'Window',
    role: 'window',
    submenu: [
        { role: 'close' },
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' }
    ]

};

module.exports = windowMenu;