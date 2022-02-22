const path = require('path')
const process = require('process')
const { spinUp, listServers, selectServerToKill } = require('./functions')

const input = require('prompt-sync')({ sigint: true })

const BASE_PORT = 3000

let servers = []
let servers_ran = 0

const setTerminalTitle = title => {
	process.stdout.write(String.fromCharCode(27) + ']0;' + title + String.fromCharCode(7))
}

const title = 'Multiple Static Servers Handler'

setTerminalTitle(title)
process.title = title

const loop = () => {
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
			servers = [...servers, spinUp(BASE_PORT + servers_ran++)]
			return true
			break
		case 2:
			listServers(servers)
			return true
			break
		case 3:
			const n = selectServerToKill(servers, servers.length - 1)
			if (n != -1) servers[n].thread.kill()
			servers = servers.filter((element, index) => index != n)
			return true
			break
		case 4:
			servers.forEach((s, i) => {
				// console.log(`Closing server "${s.name}"...`)
				servers[i].thread.kill()
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
