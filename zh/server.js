const net = require('net')
const log = require('../logger')

const host = '127.0.0.1'
const port = 6969

const presents = []

const server = net.createServer(socket => {
  log.connected('CONNECTED', getSocketAddress(socket))

  socket.on('data', json => {
    log.data('DATA', `${getSocketAddress(socket)} ${json}`)

    const data = JSON.parse(json)

    if (data.type === 'child') {
      if (presents.length >= 5) {
        return socket.end(JSON.stringify({
          type: 429,
          message: 'Too many request'
        }))
      }

      presents.push(data.present)

      return socket.end(JSON.stringify({
        type: 201,
        message: 'Present registered'
      }))
    }

    if (data.type === 'elf-count') {
      return socket.write(JSON.stringify({
        type: 'present-count',
        count: presents.length
      }))
    }

    if (data.type === 'elf-present') {
      if (presents.length >= 0) {
        const present = presents.shift();

        return socket.write(JSON.stringify({
          type: 'present',
          present
        }))
      }
    }

    if (data.type === 'elf-done') {
      return socket.end();
    }

    return socket.end(JSON.stringify({
      message: 'Welcome to Santa Server'
    }))
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
