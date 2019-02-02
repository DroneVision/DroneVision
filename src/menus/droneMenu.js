
// Drone init import
const wifi = require('node-wifi');
const { dialog } = require('electron');

module.exports = mainWindow => {
    // Create a drone menu on the menu bar called "Drone"
    let droneMenu = {
        label: 'Drone',
        submenu: [
            {
                label: 'Connect to Drone',
                enabled: true,
                click() {
                    connectToDroneWifi();
                }
            },
            {
                label: 'Disconnect from Drone',
                enabled: true,
                click() {
                    disconnectFromDrone();
                }
            },

        ],
    };

    wifi.init({
        iface: process.env.WIFI_IFACE // network interface, choose a random wifi interface if set to null
    });

    let connectButtonCounter = 0;

    async function connectToDroneWifi() {
        // Disconnect from current network
        try {
            const disconnectionResult = await wifi.disconnect();
            if (disconnectionResult) {
                console.log(`Resetting ${disconnectionResult} is successful `);
            }
        } catch (error) {
            console.error(error);
        }


        // Scan wifi networks
        let wifiNetworks
        try {
            wifiNetworks = await wifi.scan();
            console.log('wifiNetworks: ', wifiNetworks)

            // If we can get all wifi network

        } catch (error) {
            console.error(error);
        }

        if (wifiNetworks) {
            // We look for a drone wifi network
            const droneWifiNetworks = wifiNetworks.filter(network => {
                return network.ssid.startWith('TELLO');
            })




            if (droneWifiNetworks.length !== 0) {
                // Select drone network
                let selectedDroneSSID;
                // Display drone networks to connect to
                dialog.showMessageBox(mainWindow, {
                    type: 'info',
                    buttons: droneWifiNetworks,
                    message: 'Select the Drone network',
                    detail: 'Select the Drone network you would like to connect to'
                }, res => {
                    selectedDroneSSID = res;
                })



            // Create a Drone accesspoint object
            const droneAP = {
                ssid: selectedDroneSSID,
                password: ''
            };

                if(connectButtonCounter === 0) {
                    // Connect to a drone wifi network
                    wifi.connect(droneAP, (err) => {
                        if (err) {
                            console.error(err);
                            console.log(`Couldn't connect to the drone wifi network`);
                        }
                        connectButtonCounter++;
                        droneMenu.submenu[0].enabled = false
                        console.log(`Connected to drone Wifi: ${droneAP.ssid}`);
                    });
                } else {
                    console.log(`You have already connected to the drone.`)
                }
            }
            console.log(`Couldn't find the drone WiFi network`);
        }

    }

    // Disconnect from current network
    async function disconnectFromDrone() {
        try {
            const disconnectionResult = await wifi.disconnect();
            if (disconnectionResult) {
                droneMenu.submenu[1].enabled = true;
                console.log(`Resetting ${disconnectionResult} is successful `);
            }
        } catch (error) {
            console.error(error);
        }
    }

}




