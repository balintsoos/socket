const net = require('net')
const log = require('../logger')
const { tracker } = require('./config')

const server = net.createServer(socket => {
  log.connected('CONNECTED', getSocketAddress(socket))

  socket.on('data', data => {
    log.data('DATA', `${getSocketAddress(socket)} ${data}`)

    return socket.end('Game of Thrones S07E01')
  })

  socket.on('close', data => {
    log.closed('CLOSED', getSocketAddress(socket))
  })
})

server.listen(() => {
  const { address: host, port, family } = server.address()

  log.info('Seeder listening', `${host}:${port} (${family})`)

  const client = new net.Socket()

  client.connect(tracker.port, tracker.host, () => {
    log.connected('CONNECTED', `Tracker on ${tracker.host}:${tracker.port}`)
  })

  client.on('data', json => {
    log.data('DATA', JSON.parse(json).message)
  })

  client.on('close', () => {
    log.closed('CLOSED', `Tracker on ${tracker.host}:${tracker.port}`)
  })

  client.write(JSON.stringify({ type: 'seeder', host, port }))
})

function getSocketAddress(socket) {
  return `${socket.remoteAddress}:${socket.remotePort}`
}
