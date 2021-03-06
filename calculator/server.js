const net = require('net')
const log = require('../logger')

const host = '127.0.0.1'
const port = 6969

const server = net.createServer(socket => {
  log.connected('CONNECTED', getSocketAddress(socket))

  socket.on('data', data => {
    log.data('DATA', `${getSocketAddress(socket)} ${data}`)

    socket.write(`${new Function('return ' + data)()}`)
  })

  socket.on('close', data => {
    log.closed('CLOSED', getSocketAddress(socket))
  })
})

server.listen({ host, port }, () => {
  log.info('Server listening', getServerAddress(server))
})

function getSocketAddress(socket) {
  return `${socket.remoteAddress}:${socket.remotePort}`
}

function getServerAddress(server) {
  const address = server.address()
  return `${address.address}:${address.port} (${address.family})`
}
