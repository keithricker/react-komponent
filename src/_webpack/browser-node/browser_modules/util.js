
let util = require('../node_modules/util/util.js')
if (typeof util.TextEncoder === 'undefined')
  util.TextEncoder = require('./TextEncoder.js')
if (typeof util.TextDecoder === 'undefined')
  util.TextDecoder = require('./TextDecoder.js')

module.exports = util