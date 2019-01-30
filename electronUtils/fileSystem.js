const { dialog } = require('electron');
const fs = require('fs');

// Opening a File

function openFile() {
	const files = dialog.showOpenDialog({
		properties: ['openFile'],
		filters: [
			{ name: 'Markdown Files', extensions: ['md', 'markdown', 'txt', 'json', 'dvz'] }
		]
	})

	if (!files) return

	const file = files[0]
	const content = fs.readFileSync(file).toString()

	console.log(content)
}


module.exports = {
    openFile
}