const { dialog, app } = window.require('electron').remote
const fs = window.require('fs');
const path = require('path');


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