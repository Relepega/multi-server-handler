const input = require('prompt-sync')({ sigint: true })
const path = require('path')
const { fork } = require('child_process')

const spinUp = (address, port) => {
	console.clear()
	console.log('\tConfiguring your server:\n')

	const name = input('Slug: ')
	const path = input('Path: ')

	let data = { name, path, address, port }

	const thread = fork('./thread.js')
	thread.send(data)

	// thread.on('message', msg => {
	// 	console.log('msg from children: ' + msg)
	// })

	console.log(`\nserver '${name}' is up on http://${address}:${port}`)
	console.log('\n\n')
	input('Press enter to continue...')

	return { ...data, thread, PID: thread.pid, createdOn: Date.now() }
}

const listServers = servers => {
	const timeConverter = UNIX_timestamp => {
		let totalSeconds = UNIX_timestamp / 1000
		let days = Math.floor(totalSeconds / 86400)
		let hours = Math.floor(totalSeconds / 3600)
		totalSeconds %= 3600
		let minutes = Math.floor(totalSeconds / 60)
		let seconds = Math.floor(totalSeconds % 60)

		return `${days}d, ${hours}h, ${minutes}m, ${seconds}s`
	}

	console.clear()
	console.log('\t\t\tListing of running servers:\n')

	list = []

	if (servers.length == 0) console.log('No active servers')
	else {
		servers.forEach((s, i) => {
			list = [...list, { slug: s.name, PID: s.PID, path: s.path, address: `http://${s.address}:${s.port}`, uptime: timeConverter(Date.now() - s.createdOn) }]
		})
		console.table(list)
	}

	console.log('\n\n')
	input('Press enter to continue...')
}

const selectServerToKill = (servers, maxValue) => {
	console.clear()

	if (maxValue == -1) {
		console.log('Start a server first')
		console.log('\n\n')
		input('Press enter to continue...')
		return -1
	}

	const allowedValues = [0, maxValue, 'c']

	const i = input(`Index of the server you want to kill? [0-${maxValue}-c(ancel)] `)
	if (i == allowedValues[2]) return -1
	else if (i < 0 || i > maxValue) {
		console.log('Not a valid index...')
		console.log('\n\n')
		input('Press enter to continue...')
		return -1
	} else return i
}

module.exports = { spinUp, listServers, selectServerToKill }
