const net = require('net')

const HOST = '127.0.0.1'
const PORT = 6969

const client = new net.Socket()

client.connect(PORT, HOST, () => {
  console.log('CONNECTED TO: ' + HOST + ':' + PORT)
})

client.on('data', data => {
  console.log('DATA: ' + data)
})

client.on('close', () => {
  console.log('Connection closed')
})

client.write([5,2,1])
