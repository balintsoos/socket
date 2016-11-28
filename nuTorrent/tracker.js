const net = require('net')
const log = require('../logger')
const config = require('./config')

const { host, port } = config.tracker

const seeders = []

const server = net.createServer(socket => {
  log.connected('CONNECTED', getSocketAddress(socket))

  socket.on('data', json => {
    log.data('DATA', `${getSocketAddress(socket)} ${json}`)

    const data = JSON.parse(json)

    if (data.type === 'seeder') {
      seeders.push({
        host: data.host,
        port: data.port
      })

      return socket.end(JSON.stringify({
        message: 'Welcome to nuTorrent, Thx for seeding'
      }))
    }

    if (data.type === 'leecher') {
      return socket.end(JSON.stringify({
        message: 'Welcome to nuTorrent, Thx for leeching', seeders
      }))
    }

    return socket.end(JSON.stringify({
      message: 'Welcome to nuTorrent'
    }))
  })

  socket.on('close', data => {
    log.closed('CLOSED', getSocketAddress(socket))
  })
})

server.listen({ host, port }, () => {
  const { address: host, port, family } = server.address()

  log.info('Tracker listening', `${host}:${port} (${family})`)
})

function getSocketAddress(socket) {
  return `${socket.remoteAddress}:${socket.remotePort}`
}
