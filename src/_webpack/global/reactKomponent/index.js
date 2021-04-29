console.log('----------browserNode-----------',require('react-komponent/modules/browser'))

const addable = (_module,clone=true) => {
  _module = clone ? Object.defineProperties({},Object.getOwnPropertyDescriptors(_module)) : _module
  Object.setPrototypeOf(_module,{
  add(key,val) { 
    let addThis = (prop,value) => Object.defineProperty(_module,prop,{ get() { return value },enumerable:true,configurable:true }) 
    if (!val && typeof key === 'object') Object.keys(key).forEach(ky => addThis(ky,key[ky]))
    else addThis(key,val)
  }})
  return _module
}

var _browser = addable(require('../../browser-node'))

var _node = addable({},false)

var _universal = addable(addable(require('../../browser-node').dynamic))
var globals = addable(addable(require('../../browser-node').globals))

var theModules = {
  get browser() { return _browser },
  get universal() { return _universal },
  get node() { return _node }
}
addable(theModules,false)

var theExports = {
  get modules() { return theModules },
  get globals() { return globals }
}
addable(theExports,false)

module.exports = theExports