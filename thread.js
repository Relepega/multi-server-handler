const express = require('express')
const process = require('process')

process.on('message', ({ name, path, port }) => {
	const app = express()
	app.use(express.static(path))
	app.listen(Number(port))

	// process.send('ok')
})
