const { dialog, app } = require('electron');
const fs = require('fs');
const {promisify} = require('util');

const readFileAsync = promisify(fs.readFile);

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
            if(!err && fileName !== undefined){
                resolve(fileName[0]); 
            } else {
                reject(err); 
            }
   
        })
    });
}

// Opening a File

async function openFile () {
    const fileName = await promisifiedDialog()
    const data = await readFileAsync(fileName)
	const flightInstructions = JSON.parse(data).flightInstructions
	console.log(flightInstructions);
    return flightInstructions
}


module.exports = {
    openFile
}