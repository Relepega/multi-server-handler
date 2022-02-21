const scanf = require('prompt-sync')({ sigint: true })

const spinUp = (cb, port) => {
	console.clear()
	console.log('\tConfiguring your server:\n')

	const name = scanf('Slug: ')
	const path = scanf('Path: ')

	let data = { name, path, port }
	const worker = cb(data)

	console.log(`\nserver '${name}' is up on http://localhost:${port}`)
	scanf('\n\nPress enter to continue...')

	return { ...data, worker }
}

const listServers = (servers) => {
	console.clear()
	console.log('\tListing of running servers:\n')

	list = []

	if (servers.length == 0) console.log('No active servers')
	else {
		servers.forEach((s, i) => {
			list = [...list, { slug: s.name }]
		})
		console.table(list)
	}

	scanf('\n\nPress enter to continue...')
}

const selectServerToKill = (servers, maxValue) => {
	console.clear()

	if (maxValue == -1) {
		console.log('Start a server first')
		scanf('\n\nPress enter to continue...')
		return -1
	}

	const allowedValues = [0, maxValue, 'c']

	const i = scanf(`Index of the server you want to kill? [0-${maxValue}-c(ancel)] `)
	if (i == allowedValues[2]) return -1
	else if (i < 0 || i > maxValue) {
		console.log('Not a valid index...')
		scanf('\n\nPress enter to continue...')
		return -1
	} else return i
}

module.exports = { spinUp, listServers, selectServerToKill }
