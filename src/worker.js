const { workerData, parentPort } = require('worker_threads')
const express = require('express')

const { name, path, port } = workerData

// console.log(workerData)

app = express()
app.use(express.static(path))
app.listen(Number(port))

parentPort.postMessage(`server '${name}' is up on http://localhost:${port}`)
