const { compile } = require('nexe')
const { platform } = require('process')

// const download = require('download')

// // File URL
// const url = `https://acquirebase.com/img/logo.png`

// // Download the file
// ;(async () => {
// 	await download(url, './')
// })()

const name = platform == 'win32' ? './dist/multi-server-handler_uncompressed' : './dist/multi-server-handler'

compile({
	input: './src/index.js',
	build: true,
	patches: [
		async (compiler, next) => {
			await compiler.setFileContentsAsync('lib/new-native-module.js', 'module.exports = 42')
			return next()
		},
	],
	verbose: true,
	temp: './temp/',
	output: name,
})
