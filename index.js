const path = require('path')
const process = require('process')
const { checkServerData, listServers, selectServer, spinUp } = require('./functions')

const input = require('prompt-sync')({ sigint: true })

const BASE_PORT = 3000
let last_used_port = BASE_PORT

let servers = []
let servers_ran = 0

const setTerminalTitle = title => {
	process.stdout.write(String.fromCharCode(27) + ']0;' + title + String.fromCharCode(7))
}

const isPortFree = port =>
	new Promise(resolve => {
		const server = require('http')
			.createServer()
			.listen(port, () => {
				server.close()
				resolve(true)
			})
			.on('error', () => {
				resolve(false)
			})
	})

const title = 'Multiple Static Servers Handler'

// setTerminalTitle(title)
process.title = title

const loop = async () => {
	console.clear()

	console.log('\t\tMulti Static Sites Server\n')
	console.log('1. Spin up a server')
	console.log('2. Show up running servers')
	console.log('3. Kill a server')
	console.log('4. Restart a server')
	console.log('5. Quit the app and kill all the servers')

	console.log('\n')

	choice = input('>>> ')

	switch (Number(choice)) {
		case 1:
			;(await isPortFree(last_used_port)) ? last_used_port : await isPortFree(++last_used_port)
			let newServer = checkServerData('localhost', last_used_port)
			if (typeof newServer == 'object') servers = [...servers, newServer]
			return true
			break
		case 2:
			listServers(servers)
			console.log('\n\n')
			input('Press enter to continue...')
			return true
			break
		case 3:
			console.clear()
			const n = selectServer(servers, servers.length - 1, 'Index of the server you want to kill?')
			if (n != -1) servers[n].thread.kill()
			servers = servers.filter((element, index) => index != n)
			return true
			break
		case 4:
			if (servers.length == 0) {
				console.clear()
				console.log('No active servers')
				console.log('\n\n')
				input('Press enter to continue...')
			}
			listServers(servers)

			const i = selectServer(servers, servers.length - 1, 'Index of the server you want to restart?')
			const { name, path: serverPath, address, port } = servers[i]
			if (i != -1) servers[i].thread.kill()
			servers = servers.filter((element, index) => index != i)

			servers = [...servers, spinUp({ name, path: serverPath, address, port })]
			return true
			break
		case 5:
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

;(async () => {
	let running = true

	while (running) {
		running = await loop()
	}
})()
