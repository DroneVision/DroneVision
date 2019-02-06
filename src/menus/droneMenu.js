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
        },
      },
      {
        label: 'Disconnect from Drone',
        enabled: true,
        click() {
          disconnectFromDrone();
        },
      },
    ],
  };

  wifi.init({
    iface: process.env.WIFI_IFACE, // network interface, choose a random wifi interface if set to null
  });

  let connectButtonCounter = 0;
  let currentSSID = '';

  async function connectToDroneWifi() {
    // Disconnect from current network
    try {
      if (currentSSID.length !== 0) {
        await wifi.deleteConnection({ ssid: currentSSID });
      }
      const disconnectionResult = await wifi.disconnect();

      await wifi.enableAirport();

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
          const res = dialog.showMessageBox(mainWindow, {
            type: 'info',
            buttons: buttons,
            message: 'Select the Drone network',
            detail: 'Select the Drone network you would like to connect to',
          });
          // Set the drone SSID if the user doesn't click the cancel button.
          if (res !== buttons.length - 1) {
            selectedDroneSSID = buttons[res];
            currentSSID = selectedDroneSSID;
            // Create a Drone accesspoint object
            const droneAP = {
              ssid: selectedDroneSSID,
              password: '',
            };

            if (connectButtonCounter < 3) {
              // Connect to a drone wifi network
              wifi.connect(droneAP, err => {
                if (err) {
                  console.error(err);
                  // console.log(`Couldn't connect to the Drone Wifi Network`);
                }
                connectButtonCounter++;
                droneMenu.submenu[0].enabled = false;
                dialog.showMessageBox(mainWindow, {
                  type: 'info',
                  buttons: ['OK'],
                  message: 'Sucessfully connected',
                  detail: `Connected to the Drone Wifi: ${droneAP.ssid}`,
                });
                const droneConnectionStatus = {
                  droneName: droneAP.ssid,
                  isConnected: true,
                };
                let currentSSID = droneAP.ssid;
                mainWindow.webContents.send(
                  'drone-connection',
                  droneConnectionStatus
                );
              });
            } else {
              dialog.showMessageBox(mainWindow, {
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
        } else {
          const droneConnectionStatus = {
            droneName: 'Drone Not Found',
            isConnected: true,
          };
          mainWindow.webContents.send(
            'drone-connection',
            droneConnectionStatus
          );
        }
        // For Top
        // console.log(`Couldn't find the drone WiFi network`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Disconnect from current network
  async function disconnectFromDrone() {
    try {
      // For Top
      // console.log('currentSSID: ', currentSSID);
      await wifi.disconnect();
      await wifi.enableAirport();
      // await wifi.deleteConnection({ ssid: currentSSID });
      const droneConnectionStatus = {
        droneName: 'Drone Not Connected',
        isConnected: false,
      };
      mainWindow.webContents.send('drone-connection', droneConnectionStatus);
      dialog.showMessageBox(mainWindow, {
        type: 'info',
        buttons: ['OK'],
        message: 'Sucessfully disconnected',
        detail: `Disconnected fron the drone`,
      });
    } catch (error) {
      console.error(error);
    }
  }
  return droneMenu;
};
