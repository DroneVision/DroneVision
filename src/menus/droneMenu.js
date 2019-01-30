
// Drone init import
const droneInit = require('../drone/droneInit');
const { runSingleInstruction } = droneInit();

const droneMenu = {
    label: 'Drone',
    submenu: [
        {
            label: 'Connect to Drone',
            click() {
                runSingleInstruction('command');
            }
        },
    ],
};

module.exports = droneMenu