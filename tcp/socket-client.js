const net = require('net')
const log = require('../logger')

const HOST = '127.0.0.1'
const PORT = 6969

const client = new net.Socket()

client.connect(PORT, HOST, () => {
  log.connected('CONNECTED', `${HOST}:${PORT}`)
})

client.on('data', data => {
  log.data('DATA', data)
})

client.on('close', () => {
  log.closed('CLOSED')
})

client.write('Hello server')
