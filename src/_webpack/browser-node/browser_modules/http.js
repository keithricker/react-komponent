let http = require('react-komponent/src/_webpack/node_modules/http-browserify')

let original = {
  get: http.get
}

http.get = function(...args) {
  if (typeof args[1] === 'function') {
    original.callback1 = args[1]
    args[1] = function(...arg) {
      let res = arg[0]
      res.setEncoding = function() {}
      return callback1(...arg)
    }
  }
  return original.get(...args)
}
original.request = http.request
http.request = function(opts,cb,...rest) {
  let newCb = function(res,...restt) {
    res.setEncoding = function() {}
    return cb(res,...restt)
  }
  return original.request(opts,newCb,...rest)
}
module.exports = http