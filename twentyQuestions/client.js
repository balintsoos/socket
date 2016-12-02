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

  guess(client)
})

client.on('data', json => {
  const data = JSON.parse(json)

  log.data('DATA', data.msg)

  if (data.type === 'end') {
    return rl.close()
  }

  guess(client)
})

client.on('close', () => {
  log.closed('CLOSED')
})

function guess(client) {
  rl.question('Guess: ', (answer) => {
    client.write(answer)
  })
}
