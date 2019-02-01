
// Drone init import
const wifi = require('node-wifi');


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
        const droneWifiNetwork = wifiNetworks.find(network => {
            return network.ssid === 'TELLO-CF861A'
        })

        // Create a Drone accesspoint object
        const droneAP = {
            ssid: "TELLO-CF861A",
            password: ''
        };

        if (droneWifiNetwork) {
            // Connect to a drone wifi network
            wifi.connect(droneAP, (err) => {
                if (err) {
                    console.error(err);
                    console.log(`Couldn't connect to the drone wifi network`);
                }
                droneMenu.submenu[0].enabled = false
                console.log(`Connected to drone Wifi: ${droneAP.ssid}`);
            });
        }
        console.log(`Couldn't find the drone WiFi network`);
    }

}

async function disconnectFromDrone() {
    // Disconnect from current network
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



module.exports = droneMenu                                                                                                                                                                                           
