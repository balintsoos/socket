const net = require('net')
const log = require('../logger')
const readline = require('readline')

const HOST = '127.0.0.1'
const PORT = 6969

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const client = new net.Socket()

client.connect(PORT, HOST, () => {
  log.connected('CONNECTED', `${HOST}:${PORT}`)

  calculation(client)
})

client.on('data', data => {
  log.data('DATA', data)

  calculation(client)
})

client.on('close', () => {
  log.closed('CLOSED')
})

function calculation(client) {
  rl.question('Calculation: ', (answer) => {
    client.write(answer)
  })
}
