const express = require('express')
const { readFileSync } = require('fs')
const { exit } = require('process')

const paths = readFileSync('./servers.txt', { encoding: 'utf8', flag: 'r' }).split('\r\n')
// console.log(paths)

let servers = []
const base_port = 3000

if (paths.length == 1 && !paths[0]) exit()

paths.forEach((p, i) => {
	app = express()
	app.use(express.static(p))
	servers[i] = app.listen(base_port + i)
})
