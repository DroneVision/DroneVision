const { dialog, app, ipcMain } = require('electron');
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');

const readFileAsync = promisify(fs.readFile);

// The dialog blocks the main thread until user selects a valid file.

const promisifiedDialog = () => {
	const options = {
		properties: ['openFile'],
		defaultPath: app.getPath('desktop'),
		filters: [
			{ name: 'object', extensions: ['json', 'dvz'] }
		]
	}
	return new Promise((resolve, reject) => {
		dialog.showOpenDialog(null, options, (fileName, err) => {
			if (!err && fileName !== undefined) {
				resolve(fileName[0]);
			} else {
				reject(err);
			}

		})
	});
}

// Opening a File from menu bar

async function openFile(mainWindow) {
	const fileName = await promisifiedDialog();
	const data = await readFileAsync(fileName);
	const flightInstructions = JSON.parse(data).flightInstructions;
	mainWindow.webContents.send('file-opened', flightInstructions)
}

// Saving a File from menu bar


async function saveFile(mainWindow) {
	console.log('savefile menu invoked')
	// send a message to browser
	mainWindow.webContents.send('request-flightInstructions')


	// Listen for flight instructions
	ipcMain.on('send-flightInstructions', (event, flightInstructions) => {

		// Create json from flightInstructions
		const flightInstructionsJSON = {
			flightInstructions
		}
		const options = {
			defaultPath: path.join(app.getPath('desktop'), 'flightInstructions.json'),
			// Add a file extension
			filters: [
				{ name: 'object', extensions: ['json', 'dvz'] }
			]
		}

		dialog.showSaveDialog(null, options, fileName => {
			if (fileName === undefined) {
				return;
			}
			fs.writeFile(fileName, JSON.stringify(flightInstructionsJSON), err => {
				if (err) {
					// Display a dialog that an error ocurred creating the file
					dialog.showMessageBox(mainWindow, {
						type: 'error',
						buttons: ['Ok'],
						message: 'Error',
						detail: 'An error ocurred creating the file' + err.message
					})
				}
				// Display a dialog that the file has been succesfully saved
				dialog.showMessageBox(mainWindow, {
					type: 'info',
					buttons: ['Ok'],
					message: 'Success',
					detail: 'The file has been succesfully saved'
				})
			})
		});
	});
}




module.exports = {
	openFile,
	saveFile
}