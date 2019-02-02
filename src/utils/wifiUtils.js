const { dialog, app, ipcMain } = window.require('electron').remote;
const wifi = require('node-wifi');

const promisifiedDialog = () => {
  const options = {
    properties: ['openFile'],
    defaultPath: app.getPath('desktop'),
    filters: [{ name: 'object', extensions: ['json', 'dvz'] }],
  };
  return new Promise((resolve, reject) => {
    dialog.showOpenDialog(null, options, (fileName, err) => {
      if (!err && fileName !== undefined) {
        resolve(fileName[0]);
      } else {
        reject(err);
      }
    });
  });
};


//Connecting to drone from electron browser

export const connectToDroneWifi = async() => {
  wifi.init({
    iface: process.env.WIFI_IFACE, // network interface, choose a random wifi interface if set to null
  });

  let connectButtonCounter = 0;

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
  let wifiNetworks;
  try {
    wifiNetworks = await wifi.scan();
    console.log('wifiNetworks: ', wifiNetworks);

    // If we can get all wifi network

    if (wifiNetworks.length > 0) {
      // We look for a drone wifi network
      const droneWifiNetworks = wifiNetworks
        .filter(network => {
          return network.ssid.startsWith('TELLO-');
        })
        .map(droneNetwork => droneNetwork.ssid);

      console.log('droneWifiNetworks: ', droneWifiNetworks);
      if (droneWifiNetworks.length > 0) {
        // Select drone network
        let selectedDroneSSID;
        // Display drone networks to connect to
        const buttons = [...droneWifiNetworks, 'Cancel'];
        console.log(buttons);
        const res = dialog.showMessageBox(null, {
          type: 'info',
          buttons: buttons,
          message: 'Select the Drone network',
          detail: 'Select the Drone network you would like to connect to',
        });
        // Set the drone SSID if the user doesn't click the cancel button.
        if (res !== buttons.length - 1) {
          selectedDroneSSID = buttons[res];
          // Create a Drone accesspoint object
          const droneAP = {
            ssid: selectedDroneSSID,
            password: '',
          };

          if (connectButtonCounter < 1) {
            // Connect to a drone wifi network
            wifi.connect(droneAP, err => {
              if (err) {
                console.error(err);
                // console.log(`Couldn't connect to the Drone Wifi Network`);
              }
              connectButtonCounter++;
              dialog.showMessageBox(null, {
                type: 'info',
                buttons: ['Ok'],
                message: 'Sucessfully connected',
                detail: `Connected to the Drone Wifi: ${droneAP.ssid}`,
              });
            });
          } else {
            dialog.showMessageBox(null, {
              type: 'warning',
              buttons: ['Cancel'],
              message: 'Already connected',
              detail: `You have already connected to the Drone Wifi: ${
                droneAP.ssid
              }`,
            });
          }
        } else {
          return;
        }
      }
      // For Top
      // console.log(`Couldn't find the drone WiFi network`);
    }
  } catch (error) {
    console.error(error);
  }
}

// Disconnect from current network
export async function disconnectFromDrone() {
  try {
    const disconnectionResult = await wifi.disconnect();
    if (disconnectionResult) {
      // console.log(`Resetting ${disconnectionResult} is successful `);
    }
  } catch (error) {
    console.error(error);
  }
}