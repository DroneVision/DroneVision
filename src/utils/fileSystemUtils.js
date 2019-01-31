const { dialog, app } = window.require('electron').remote
const fs = window.require('fs');
const path = require('path');
const {promisify} = require('util');


const readFileAsync = promisify(fs.readFile);

export const saveFlightInstructions = flightInstructions => {

    const options = {
        defaultPath: path.join(app.getPath('desktop'), 'flightInstructions.json'),
        filters: [
            { name: 'object', extensions: ['json', 'dvz'] }
        ]
    }

    // Create json from flightInstructions
    const flightInstructionsJSON = {
        flightInstructions
    }
    dialog.showSaveDialog(null, options, fileName => {
        if (fileName === undefined) {
            return;
        }
        fs.writeFile(fileName, JSON.stringify(flightInstructionsJSON), err => {
            if (err) {
                alert("An error ocurred creating the file " + err.message)
            }
            alert("The file has been succesfully saved");
        })
    })

}
const promisifiedDialog = () => {
    const options = {
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

export const loadFlightInstructions = async () => {
    const fileName = await promisifiedDialog()
    const data = await readFileAsync(fileName)
    const flightInstructions = JSON.parse(data).flightInstructions
    return flightInstructions
    
}