const net = require('net')
const log = require('../logger')

const HOST = '127.0.0.1'
const PORT = 6969

const client = new net.Socket()

client.connect(PORT, HOST, () => {
  log.connected('CONNECTED', `${HOST}:${PORT}`)
})

client.on('data', json => {
  const data = JSON.parse(json)

  if (data.type === 'present-count') {
    log.data('DATA', data.count)

    if (data.count > 0) {
      return client.write(JSON.stringify({
        type: 'elf-present'
      }))
    }

    return client.destroy()
  }

  if (data.type === 'present') {
    log.data('DATA', data.present)

    setTimeout(() => {
      client.write(JSON.stringify({
        type: 'elf-done'
      }))
    }, 2000);
  }
})

client.on('close', () => {
  log.closed('CLOSED')
})

client.write(JSON.stringify({
  type: 'elf-count'
}))
