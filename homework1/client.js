const net = require('net')
const readline = require('readline')
const log = require('../logger')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const HOST = '0.0.0.0'
const PORT = 42002

const client = new net.Socket()
let isQuestion = true

client.connect(PORT, HOST, () => {
  log.connected('CONNECTED', `${HOST}:${PORT}`)
})

client.on('data', data => {
  log.data('DATA', data)

  if (isQuestion) {
    rl.question('', (answer) => {
      client.write(answer)
      rl.close();
    });
  }

  isQuestion = false
})

client.on('close', () => {
  log.closed('CLOSED')
})
