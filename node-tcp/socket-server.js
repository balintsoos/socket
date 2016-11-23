const net = require('net')

const host = '127.0.0.1'
const port = 6969

const server = net.createServer(socket => {
  console.log(`CONNECTED: ${getSocketAddress(socket)}`)

  socket.on('data', data => {
    console.log(`DATA ${getSocketAddress(socket)} ${data}`)

    const result = data.reduce((a, b) => a + b, 0)

    socket.end(result)
  })

  socket.on('close', data => {
    console.log(`CLOSED: ${getSocketAddress(socket)}`)
  })
}).on('error', err => {
  throw err
})


server.listen({ host, port }, () => {
  console.log(`Server listening on ${getServerAddress(server)}`)
})

function getSocketAddress(socket) {
  return `${socket.remoteAddress}:${socket.remotePort}`
}

function getServerAddress(server) {
  const address = server.address()
  return `${address.address}:${address.port} (${address.family})`
}
