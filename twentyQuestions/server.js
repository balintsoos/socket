const net = require('net')
const log = require('../logger')

const host = '127.0.0.1'
const port = 6969

const sockets = []

let random

const server = net.createServer(socket => {
  log.connected('CONNECTED', getSocketAddress(socket))

  socket.on('data', data => {
    log.data('DATA', `${getSocketAddress(socket)} ${data}`)

    const number = parseInt(data, 10)

    if (number > random) {
      return socket.write(JSON.stringify({
        type: 'smaller',
        msg: 'smaller'
      }))
    }

    if (number < random) {
      return socket.write(JSON.stringify({
        type: 'bigger',
        msg: 'bigger'
      }))
    }

    if (number === random) {
      socket.write(JSON.stringify({
        type: 'end',
        msg: 'You guessed it!'
      }))

      sockets.map(socket => socket.end(JSON.stringify({
        type: 'end',
        msg: 'Game Over'
      })))

      return server.close()
    }

    socket.write(JSON.stringify({
      type: 'invalid',
      msg: "I don't understand"
    }))
  })

  socket.on('close', data => {
    log.closed('CLOSED', getSocketAddress(socket))
  })

  sockets.push(socket)
})

server.listen({ host, port }, () => {
  log.info('Server listening', getServerAddress(server))

  random = getRandomIntInclusive(1, 10)

  console.log(random)
})

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSocketAddress(socket) {
  return `${socket.remoteAddress}:${socket.remotePort}`
}

function getServerAddress(server) {
  const address = server.address()
  return `${address.address}:${address.port} (${address.family})`
}
