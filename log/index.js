const c = require('chalk')

const log = (title, msg) => console.log(`${title} ${msg}`)

const connected = (title = '', msg = '') => log(c.bgGreen.black(` ${title} `), c.green(msg))

const closed = (title = '', msg = '') => log(c.bgRed.white(` ${title} `), c.red(msg))

const info = (title = '', msg = '') => log(c.bgBlue.white(` ${title} `), c.blue(msg))

const data = (title = '', msg = '') => log(c.bgCyan.black(` ${title} `), c.cyan(msg))

module.exports = {
  connected,
  closed,
  info,
  data
}
