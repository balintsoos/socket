const net = require('net')
const log = require('../logger')
const { tracker } = require('./config')

const client = new net.Socket()

client.connect(tracker.port, tracker.host, () => {
  log.connected('CONNECTED', `Tracker on ${tracker.host}:${tracker.port}`)
})

client.on('data', json => {
  const data = JSON.parse(json)

  log.data('DATA', data.message)

  leeching(data.seeders.pop())
})

client.on('close', () => {
  log.closed('CLOSED', `Tracker on ${tracker.host}:${tracker.port}`)
})

client.write(JSON.stringify({ type: 'leecher' }))

function leeching(seeder) {
  const client = new net.Socket()

  client.connect(seeder.port, seeder.host, () => {
    log.connected('CONNECTED', `Seeder on ${seeder.host}:${seeder.port}`)
  })

  client.on('data', data => {
    log.data('DATA', data)
  })

  client.on('close', () => {
    log.closed('CLOSED', `Seeder on ${seeder.host}:${seeder.port}`)
  })

  client.write(JSON.stringify({ type: 'leecher' }))
}
