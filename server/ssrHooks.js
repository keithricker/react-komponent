const merge = (trg,src) => Object.defineProperties(trg,Object.getOwnPropertyDescriptors(src))
const makeFunction = (func,props,pro) => { 
  if (pro) func.prototype = pro 
  return props ? merge(func,props) : func 
}

module.exports = (function() { 
  let hooks = {}; let callbacks = {}
  Array('load','_constructor','componentDidMount','render','window').forEach(key => {
    callbacks[key] = { temp:[],perm:[] }
    hooks[key] = 
    makeFunction(function(hook,perm=false) {
      callbacks[key][perm ? 'perm' : 'temp'].push(hook)
    },
    { get callbacks() { return { temp:[...callbacks[key].temp], perm:[...callbacks[key].perm] }}})
  })
  return hooks
 })()