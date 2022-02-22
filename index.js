const path = require('path')
// const os = require('os')
const process = require('process')
const { Worker } = require('worker_threads')
const { spinUp, listServers, selectServerToKill } = require('./functions')

const input = require('prompt-sync')({ sigint: true })

const BASE_PORT = 3000

let servers = []
let servers_ran = 0

const setTerminalTitle = title => {
	process.stdout.write(String.fromCharCode(27) + ']0;' + title + String.fromCharCode(7))
}

const runService = workerData => {
	const worker = new Worker('./worker.js', { workerData })
	worker.on('message', e => {
		console.log(e)
	})
	// worker.on('error', reject)
	// worker.on('exit', (code) => {
	// 	if (code !== 0) reject(new Error(`Stopped the Worker Thread with the exit code: ${code}`))
	// })

	return worker
}

const loop = () => {
	process.title = 'Multiple Static Servers Handler'

	console.clear()

	console.log('\t\tMulti Static Sites Server\n')
	console.log('1. Spin up a server')
	console.log('2. Show up running servers')
	console.log('3. Kill a server')
	console.log('4. Quit the app and kill all the servers')

	console.log('\n')

	choice = input('>>> ')

	switch (Number(choice)) {
		case 1:
			servers = [...servers, spinUp(runService, BASE_PORT + servers_ran++)]
			return true
			break
		case 2:
			listServers(servers)
			return true
			break
		case 3:
			const n = selectServerToKill(servers, servers.length - 1)
			if (n != -1) servers[n].worker.terminate()
			servers = servers.filter((element, index) => index != n)
			return true
			break
		case 4:
			servers.forEach((s, i) => {
				// console.log(`Closing server "${s.name}"...`)
				servers[i].worker.terminate()
			})
			process.exit()
			break
		default:
			console.log('Not a number, prease enter a valid input')
			return true
			break
	}
}

let running = true

while (running) {
	running = loop()
}
