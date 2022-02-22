const input = require('prompt-sync')({ sigint: true })
const path = require('path')
const { fork } = require('child_process')

const spinUp = port => {
	console.clear()
	console.log('\tConfiguring your server:\n')

	const name = input('Slug: ')
	const path = input('Path: ')

	let data = { name, path, port }
	const thread = fork('./thread.js')
	thread.send(data)

	// thread.on('message', msg => {
	// 	console.log('msg from children: ' + msg)
	// })

	console.log(`\nserver '${name}' is up on http://localhost:${port}`)
	console.log('\n\n')
	input('Press enter to continue...')

	return { ...data, thread, PID: thread.pid }
}

const listServers = servers => {
	console.clear()
	console.log('\tListing of running servers:\n')

	list = []

	if (servers.length == 0) console.log('No active servers')
	else {
		servers.forEach((s, i) => {
			list = [...list, { slug: s.name, PID: s.PID }]
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
