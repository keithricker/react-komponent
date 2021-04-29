
const _Proxy = require('../_ProxyCompiled')
const privateVars = require('../../Komponent/privateVariablesCompiled')


const esprima = require('esprima')
const escodegen = require('escodegen')

function findDeclarations(code) {
  var ast = esprima.parse(code);
  var funcDecls = [];
  var globalVarDecls = [];
  var funcStack = [];
  var funcs = { object:[], vars:[] }
  function visitEachAstNode(root, enter, leave) {
      let prev = root; let key

      function visit(node) {
          prev = node === root ? undefined : prev
          if (prev)
            Object.defineProperty(node,'prev',{value:prev,enumerable:false,writable:true,configurable:true})
          if (key) Object.defineProperty(node,'key',{value:key,enumerable:false,writable:true,configurable:true})

          function isSubNode(key){
              var child = node[key];
              if (child===null) return false;
              var ty = typeof child;
              if (ty!=='object') return false;
              if (child.constructor===Array) return ( key!=='range' );
              if (key==='loc') return false;
              if ('type' in child){
                  if (child.type in esprima.Syntax) return true;
                  debugger; throw new Error('unexpected');
              } else { return false; }
          }

          enter(node);

          let keys = Object.keys(node);
          let subNodeKeys = keys.filter(isSubNode);
          subNodeKeys.forEach(ky => {

            if (node[ky].type === 'ObjectExpression') {
  
                Object.defineProperty(node[ky],'prev',{value:node,enumerable:false,writable:true,configurable:true})
                Object.defineProperty(node[ky],'key',{value:key,enumerable:false,writable:true,configurable:true})

                node[ky].properties.forEach((prop,ind) => {
                  Object.defineProperty(prop.value,'prev',{value:prop,enumerable:false,configurable:true})
                  Object.defineProperty(prop.value,'key',{value:'value',enumerable:false,configurable:true})
                                    
                  let curr = myEnter(prop.value)
                  prev = node[ky].properties; 
                  key = ind
                  if (!curr) visit(prop.value)
                })   
                return
            }
            prev = node
            key = ky
            visit(node[ky]);
          })
          leave(node);
          prev = node
      }
      visit(root);
  }
  function myEnter(node) {
    if (node.type==='FunctionDeclaration' || node.type === 'FunctionExpression') {

      if (node.id === null || node.id.name === undefined) {
        
        if (node.prev.property) { node.id = { name: node.prev.property.name } }
        else if (node.prev.type === 'Property') { node.id = {  name: node.prev.key.name } }

        else if (node.prev.type === 'Literal') { node.id = {  name: node.prev.name || node.prev.value } }
        else if (node.prev.type === 'Identifier') { node.id = {  name: node.prev.value || node.prev.name } }
        else if (node.prev.left) { node.id = { name: node.prev.left.property ? node.prev.left.property.name : undefined} }
        else node.id = { name:'anonymous' }
      }
      if (Array('anonymous',undefined,null,'get','set','default').includes(node.id.name)) return
      var current = {
        name: node.id.name,
        params : node.params.map(function(p){return p.name;}),
        variables : []
      }
      Object.defineProperty(current,'isDeclaration',{value:true,enumerable:false,writable:true,configurable:true})
      funcDecls.push(current);
      funcStack.push(current);

      if ((node.prev && node.prev.type === 'Property') || (node.prev && node.prev.type === 'Identifier' && node.prev.prev && Array.isArray(node.prev.prev) && node.prev.prev[0] && node.prev.prev[0].type === 'Property')) {
        funcs.object.push(current)
      }
      else funcs.vars.push(current)
      return current
    }
    if (node.type==='VariableDeclaration') {
      var foundVarNames = node.declarations.map(function(d){ return d.id.name; });
      if (funcStack.length===0){
        globalVarDecls = globalVarDecls.concat(foundVarNames);
      } else {
        var onTopOfStack = funcStack[funcStack.length-1];
        onTopOfStack.variables = onTopOfStack.variables.concat(foundVarNames);
      }
    }
  }
  function myLeave(node){
    if (node.type==='FunctionDeclaration') {
        funcStack.pop();
    }
  }
  visitEachAstNode(ast, myEnter, myLeave);
  return {
    vars  : globalVarDecls,
    funcs : funcDecls,
    get names() { return this.funcs.map(name => name.name) },
    funcdecs: funcs,
  };
}

const util = { clone:'',cloneFunc:'',merge:'',_typeof:'',getLevel:'',ReflectBind:'' } 
Reflect.ownKeys(util).forEach(key => util[key] = (...arg) => require('../utilsCompiled')[key](...arg))
util._typeof.class = (...arg) => require('../utilsCompiled')._typeof.class(...arg)
util.ReflectBind.descriptor = (...arg) => require('../utilsCompiled').ReflectBind.descriptor(...arg)
const { clone,cloneFunc,merge,_typeof,getLevel,ReflectBind } = util

let _global; try { _global = window } catch { _global = global }
const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1)

const equivalent = (thing1,thing2) => (JSON.stringify(thing1) === JSON.stringify(thing2)) && Reflect.ownKeys(thing1).every(key => thing1[key] === thing2[key])

const ownProp = exports.ownProp = (obj,key) => Reflect.ownKeys(obj).includes(key)

const defineProp = exports.defineProp = function(trg,key,desc,...bind) {
  if (arguments.length > 3)
    desc = bind.length === 1 ? boundDescriptor(desc,bind) : ReflectBind.descriptor(...[desc,...bind])
  desc = new Descriptor(desc)
  return Object.defineProperty(trg,key,desc);
};
 
const defineProps = exports.defineProps = function(trg, src, ex = [], ...bind) {
  let descs = {}
   Reflect.ownKeys(src)
     .forEach((key) => {
       if (ex.includes(key)) return false
       let trgDesc = Object.getOwnPropertyDescriptor(trg,key)
       if (trgDesc) {
         if ((trgDesc.configurable === false) && (trgDesc.writable === false)) return
         if (trgDesc.configurable === false) {
           let val = src[key].value
           if ("get" in src[key]) {
             let binds = Array(trg,src[key].object).filter(Boolean)
             binds.forEach(bnd => { try { val = val || src[key].get.call(bnd)} catch {} })
             if (!val) try { val = src[key].get() } catch {}
           }
           try { trg[key] = val } catch {}
           return
         }
       }
       return (descs[key] = (bind.length) ? boundDescriptor(src[key],...bind) : src[key])
     });
   return Object.defineProperties(trg, descs)
}

const mixin = exports.mixin = (target, mix, trg) => {
   return Object.setPrototypeOf(
     target,
     Object.setPrototypeOf(mix, Object.getPrototypeOf(target))
   );
  }
const entries = exports.entries = function(obj) {
  return Reflect.ownKeys(obj).map(key => {
    let ent = [key,'']; Object.defineProperty(ent,1,Object.getOwnPropertyDescriptor(obj,key))
    return ent
  })
}
const Descriptor = exports.Descriptor = class Descriptor {
  constructor(desc) {
    let thisPrivs = privateVars(this)
    if (arguments[1]) {
      thisPrivs.object = arguments[0]
      thisPrivs.key = arguments[1]
    }
    desc = arguments.length === 1 ? desc : Object.getOwnPropertyDescriptor(...arguments)
    return Object.defineProperties(this,Object.getOwnPropertyDescriptors(desc))
  }
  get key() {
    return privateVars(this).key
  }
  get object() {
    return privateVars(this).object
  }
}
const Descriptors = exports.Descriptors = class Descriptors extends Object {
  constructor(obj={}) {
    super(...arguments)
    let descs = this
    Reflect.ownKeys(obj).forEach(key => {
      if (key !== Symbol.iterator) return !!(descs[key] = new Descriptor(obj,key))
      let original = obj[key]
      Object.defineProperty(descs,key,{ 
          value: function(...arg) {
            if (!this instanceof Descriptors) return original.call(this,...arg)
            return Reflect.get(Descriptors.prototype,Symbol.iterator,this).call(this,...arg)
        },enumerable:true,configurable:true,writable:true
      })
    })
    return descs
  }
  spread() {
    let ents = Object.values(this)

    let spreadProto = {
      unspread() {
        let unsp = this.reduce((prev,desc) => {
          prev[desc.key] = desc; return prev
        },new Descriptors())
        return unsp
      },
    }
    Reflect.ownKeys(Array.prototype).forEach(key => {
      spreadProto[key] = function(...arg) {
        let result = Array.prototype[key].call(this,...arg)
        if (Array.isArray(result)) return Object.setPrototypeOf(result,spreadProto)
        return result
      }
    })
    Reflect.ownKeys(Descriptors.prototype).forEach(key => {
      spreadProto[key] = function(...arg) {
        return this.unspread()[key](...arg)
      } 
    })
    return mixin(ents,spreadProto)
  }
  merge(trg,...arg) { 
    return defineProps(trg,this,...arg) 
  }
  toObject() {
    let newObj
    let objConstructor = this.constructor.value || this.constructor.get ? this.constructor.get() : Object
    getLevel(objConstructor.prototypek,lvl => { 
      let newObj; try { return !!(newObj = new (lvl.constructor)()) } catch { return false } 
    })
    Object.setPrototypeOf(newObj,objConstructor.prototype)
    return defineProps(newObj,this)
  }
  get [Symbol.iterator]() {
    let thiss = Object.values(this)
    return function() {
      let iterator = {
          current: 0,
          last: thiss.length-1,
    
          // 3. next() is called on each iteration by the for..of loop
          next() {
            // 4. it should return the value as an object {done:.., value :...}
            if (iterator.current <= iterator.last) {
              return { done: false, value: thiss[iterator.current++] };
            } else {
              return { done: true };
            }
          }
      }
      return iterator
    }
  }
}

const setProto = (obj,pro) => ((obj === pro) || !pro) ? obj : !obj ? undefined : Object.setPrototypeOf(obj,pro)
const getProto = (ob) => !ob ? undefined : Object.getPrototypeOf(ob)
  
const ownDescriptor = exports.ownDescriptor = function(obj,prop) {
  return new Descriptor(obj,prop) || undefined;
}
  
const getDescriptor = exports.getDescriptor = function(obj,prop) {
  let level = getLevel(obj, (lvl) => lvl && ownProp(lvl,prop));
  return level ? new Descriptor(level,prop) : undefined;
}
  
const getDescriptors = exports.getDescriptors = function(ob,defaults,...bind) {
   // spreading the bind argument allows for passing multiple arguments to bind method
   let descs = new Descriptors({})
   Reflect.ownKeys(ob).forEach(key => {
     let desc = new Descriptor(ob,key)
     desc = boundDescriptor(desc,...bind)
    
     if (defaults) {
      if (typeof defaults === "function") desc = defaults(desc) || desc;
      else Object.assign(desc, defaults);
    }

    descs[key] = desc
   })
   return descs
}

function boundProperty(key,original,...bind) {
  let newProp = cloneFunc(original, original.bind(...bind))
  Array('call','apply').forEach(prop => {
    Object.defineProperty(newProp,prop,{
      value: Function.prototype[prop].bind(original),
      configurable:true, enumerable:false, writable:true
    })
  })
  Object.defineProperty(newProp,'bind',{
    value: function() { return boundProperty(key,original,...arg) },
    configurable:true, enumerable:false, writable:true
  })
  return Object.setPrototypeOf(newProp, original);
}

const boundDescriptor = exports.boundDescriptor = function(descriptor,...bind) { return ReflectBind.descriptor({descriptor,bind}) }

const boundDescriptors = exports.boundDescriptors = function(ob,...bind) {
  let descs = new Descriptors({})
  Reflect.ownKeys(ob).forEach(key => {
    descs[key] = new Descriptor(ReflectBind.descriptor(ob,key,bind))
  })
  return descs
}
  
const backup = exports.backup = function(ob) {
  if (!ob) return
  let bup = setProto(getDescriptors(ob),getProto(ob))
  bup['{{restore target}}'] = setProto(new (_typeof.class(ob))(),getProto(ob))
  return bup
}
const restore = exports.restore = function(ob,backup) {
  if (!backup) {
    [backup,ob] = [ob,backup]
    ob = backup['{{restore target}}'] || new (Object.defineProperty({},'constructor',backup.constructor).constructor)()
  }
  Reflect.ownKeys(ob).forEach(key => {
    let gd = Object.getOwnPropertyDescriptor(ob)
    if (gd.writable === false && gd.configurable === false) {
      delete backup[key]; return
    }
    if (gd.writable === false) Object.defineProperty(ob,key,{value:'',writable:true}) 
    delete ob[key]
  })
  delete backup['{{restore target}}']
  Object.defineProperties(ob,backup)
  if (!arguments[1]) return ob
  return setProto(ob,getProto(backup))
}
let bindProxies = new Map()
 const bindProxy = exports.bindProxy = function(thiss,properties,bind,softTarget) {
  let bps = bindProxies
  thiss = thiss['{{target}}'] || this
  let theArgs = [...arguments]
  theArgs[0] = thiss
  if (bps.has(thiss) && bps.get(thiss).args.every((ar,ind) => ar === theArgs[ind])) return bps.get(thiss).bindProx

  let bindProx
  bindProx = new _Proxy({
    target:bind,
    get virtualTarget() { return softTarget || bind },
    get proxy() { return bindProx },
    handler: {
      get(ob,prop,prx) {
        // boundDescriptors(bind,bind).merge(ob)
        let trg = (prop in ob) ? ob : (softTarget && (prop in softTarget)) ? softTarget : properties
        let binder = (!ownProp(trg,prop)) ? trg : undefined
        let res = Reflect.get(trg,prop,binder || prx)
        return (typeof res === 'function' && prop !== 'constructor' && binder) ? res.bind(binder) : res 
      },
      set(ob,prop,val,prx) { 
        if (softTarget) return !!(softTarget[prop] = typeof val === 'function' && prop !== 'constructor' ? val.bind(prx) : val)
        return !!(ob[prop] = val)
      },
      defineProperty(ob,prop,desc) {
        if (softTarget) return defineProp(softTarget,prop,boundDescriptor({...desc,configurable:true},this.proxy))
        return defineProp(ob,prop,desc)
      }     
    }
  })
  bps.set(thiss,{bindProx,args:theArgs})
  return bindProx
}
  
const replaceThis = exports.replaceThis = function(obj,callback) {
  let keys = [];
  let computedFieldNames = {}
  if (arguments.length === 1) {
    callback = obj
    obj = null
  }

  let parsedObj = esprima.parse(callback.toString())
  if (!parsedObj) return obj

  parseThis(parsedObj)
  
  if (obj) {
    keys = [...new Set(keys)]
    Reflect.ownKeys(obj).forEach(key => {
      if (keys.includes(key)) obj[key] = obj
    })
  }
  
  function parseThis(parsed) {
    if (parsed.type === "ObjectExpression") {
      let properties = parsed.properties
      if (properties && properties.length) {
        properties.forEach(prop => {
          if (prop.value.type === 'ThisExpression')
            keys.push(prop.key.name)
        })
      }
      return parsed
    }
    else if (parsed.type === 'SequenceExpression') {
      parsed.expressions.slice(1).forEach(exp => {
        let arg = exp.arguments;
        if (!exp.arguments) return
        if (arg[1].type !== 'Identifier') return
        let varname= arg[1].name
        let val = arg[2].value
        computedFieldNames[varname] = val
      })
      return
    }
    Object.keys(parsed).forEach(key => {
      if (key === 'body') {
        if (Array.isArray(parsed.body))
          parsed.body.forEach(element => { Object.setPrototypeOf(element,{prev:parsed.body}); parseThis(element) })
        else { Object.setPrototypeOf(parsed.body,{prev:parsed}); parseThis(parsed.body) }
      }
      else if (parsed[key] && parsed[key].type) {
        Object.setPrototypeOf(parsed[key],{prev:parsed})
        parseThis(parsed[key])
      }
    })
  }
  return obj || {keys,computedFieldNames}
}

const mergeProps = exports.mergeProps = function(obj,props,exc=[],overrides={}) {
  if (arguments.length === 3) {
    overrides = (typeof exc === 'object' && !Array.isArray(exc)) ? arguments[2] : {}
    exc = Array.isArray(exc) ? exc : []
  }
  return (obj !== props) && getDescriptors(props).spread().filter(desc => !exc.includes(desc.key)).map(desc => (/^{{(.*?)}}$/.exec(desc.key)) && (desc.configurable = true) ? Object.assign(desc,overrides) : Object.assign(desc,overrides)).merge(obj)
}

const Constructor = exports.Constructor = class Constructor {
  constructor(subject,callback) {
    let staticProps, inits = new WeakSet()

    if (arguments.length === 1) 
      [callback,subject] = [...arguments]
    if (arguments.length === 2 && typeof arguments[0] === 'function' && typeof arguments[1] === 'object')
      [callback,staticProps,subject] = [...arguments]
    
    let classArgs = {subject,callback}

    let theName = staticProps && staticProps.name ? staticProps.name : callback.name
    const theConstructor = {
      [theName]: function(...arg) {

        let object = this;

        if (this === _global || this === undefined) {
          let ext = privateVars(theConstructor)._super
          if (!ext) ext = Object.getPrototypeOf(theConstructor.prototype).constructor
          object = new ext()
        }
        
        function mergeDescs(desc1,desc2) {
          if (desc2.value) { delete desc1.get; delete desc1.set }
          if (desc2.get || desc2.set) { delete desc1.value }
          let newDesc = Object.assign(desc1,desc2)
          if (newDesc.set || newDesc.get) delete newDesc.writable
          return newDesc
        }

        let {keys,computedFieldNames} = replaceThis(callback)

        let replace = (obj,replace=obj) => Reflect.ownKeys(obj).forEach(key => {
          if (keys.includes(key)) obj[key] = replace
        })

        var _extends = _global['{{_extends}}'] = '{{_extends}}'
        var _super = _global['{{_super}}'] = '{{_super}}'
        var _static = _global['{{_static}}'] = '{{_static}}'

        var descriptors = _global.descriptors = '{{descriptors}}'
        var constructor = '{{constructor}}'
        var prototype = _global.prototype = '{{prototype}}'
        var properties = _global.properties = '{{properties}}'
        var __proto__ = '{{__proto__}}'
        var name = _global.name = '{{name}}'
        var priv = global.priv = '_priv'
        var iffe = global.iife = '{{iife}}'

        if (!subject) subject = {
          get [_static]() {
              return this[constructor]
          },
          set [_static](val) {

              mergeProps(this[constructor],val,['name'])
              if (ownProp(val,'name')) {
                Object.defineProperty(this,name,{ 
                  get() { return this.constructor.name },
                  set(val) { return true }
                })
                Object.defineProperty(callback,'name',{value:val,configurable:true})
                Object.defineProperty(this[constructor],'name',{value:val,configurable:true})
              }
              return !!(Object.defineProperty(this,_static,{ 
                get() { return this[constructor] }, 
                set(val) { return true }
              }))

          },
          get [constructor]() { 
            let constr = this.constructor
            if (constr === callback) {
              Object.setPrototypeOf(this,mergeProps(theConstructor.prototype,callback.prototype))
              return theConstructor
            }
            if (constr !== theConstructor) {
              if (constr.prototype.isPrototypeOf(theConstructor.prototype))
                return (Object.setPrototypeOf(this,theConstructor.prototype)).constructor 
            
              const name = theConstructor.name
              let desc = Object.getOwnPropertyDescriptor(this,_static)
              if (desc && desc.value) {
                let nameDesc = Object.getOwnPropertyDescriptor(desc.value,'name')
                if (nameDesc && nameDesc.value) name = nameDesc.value
              }
              constr = {[name] : function(...ar) {
                return theConstructor.call(new constr(...ar),...ar)
              }}[name]
              Object.setPrototypeOf(constr,this.constructor)
              Object.setPrototypeOf(constr.prototype,this.constructor.prototype)
              Object.setPrototypeOf(this,constr.prototype)
              if (staticProps) mergeProps(constr,staticProps)

            }
            return constr
          },
          set [constructor](val) { 
            let cons = Object.getOwnPropertyDescriptor(this,constructor)
            cons = cons.value || cons.get.call(this)
            let thisProto = cons.prototype
            Object.setPrototypeOf(this,merge(val.prototype,thisProto))
            return !!(Object.defineProperty(this,constructor,{ get() { return this.constructor }, set(val) { return true }}))
          },
          get [_extends]() {
            return Object.getPrototypeOf(this[constructor]) === 'Function' ? Object : Object.getPrototypeOf(this.constructor)
          },
          set [_extends](val) {
            Object.setPrototypeOf(this[constructor],val)
            Object.setPrototypeOf(this.constructor.prototype,val.prototype)
            object = Object.setPrototypeOf(new (val)(),Object.getPrototypeOf(this))
            Object.defineProperties(object,getDescriptors(subject).spread().filter(desc => desc.key !== _extends).unspread())
            object[_extends] = val
            callback.call(object,...arg)
            return !!(Object.defineProperty(this,_extends,{ get() { return val }, set(val) { return true }}))
          },
          get [priv] () {
            let thisPriv
            if (!privateVars(Constructor).instances.has(this)) privateVars(Constructor).instances.set(this,{})
            if (!privateVars.has(this)) {
              thisPriv = privateVars(this)
              let rando = thisPriv.randomString
              if (!privateVars(Constructor).instances.has(this))
                privateVars(Constructor).instances.set(this,{})
              privateVars(Constructor).instances.get(this).priv = { randomString:rando, vars:privateVars(this) }
              Object.getOwnPropertyDescriptor(this,priv).set.call(this)
            }
            else thisPriv = privateVars.get(this)
            return thisPriv
          },
          set [priv](val) {
            let thisPriv = this[priv]
            let ConstThis = privateVars(Constructor).instances.get(this)
            let randoString = ConstThis.priv.randomString
            let props = this[priv]['{{target}}'][randoString]
            if (props && val) mergeProps(props,val)
            Object.defineProperty(this,'_priv',{ value:thisPriv,enumerable:false,writable:false,configurable:false })
            return true          
          },
          get [prototype]() { 
            return this[constructor].prototype
          },
          set [prototype](val) { 
            mergeProps(this[constructor].prototype,val); 
            return !!(Object.defineProperty(this,prototype,{ get() { return this[constructor].prototype }, set(val) { return true }}))
          },
          get [__proto__]() { return Object.getPrototypeOf(this) },
          set [__proto__](val) { 
            Object.setPrototypeOf(this,val)
            return !!(delete this[__proto__])
          },
          set [_super](val) { return !!(Object.defineProperty(this,_super,{value:val,configurable:true})) },
          get [_super]() { return function(...args) { 
            object = Object.setPrototypeOf(new this[_extends](...args),Object.getPrototypeOf(this))
            Object.defineProperties(object,getDescriptors(subject).spread().filter(desc => desc.key !== _super && desc.key !== _extends).unspread())
            object[_extends] = this[_extends]
            object[_super] = function(...arg) { return object }
            privateVars(theConstructor)._super = object
            callback.call(object,...arg)             
            return object
          }},          
          get [properties]() { return this },
          set [properties](val) { return !!(mergeProps(this,val)) },
          get [descriptors]() { return getDescriptors(this) },
          set [descriptors](val) {
            let self = this
            Reflect.ownKeys(val).forEach(key => {
              let obDesc = Object.getOwnPropertyDescriptor(self,key) 
              let subDesc = Object.getOwnPropertyDescriptor(subject,key)
              if (obDesc && subDesc && equivalent(obDesc,subDesc)) {
                let breakout = true
                if (obDesc.set) {
                  obDesc.set = function(value) {
                    subDesc.set.call(self,value)
                    let newDesc = Object.getOwnPropertyDescriptor(self,key)
                    if (!newDesc || equivalent(newDesc,subDesc)) {
                      return true
                    }
                    Object.defineProperty(self,key,mergeDescs(newDesc,val[key]))
                    return true
                  }
                  return true
                }
                Object.defineProperty(self,key,mergeDescs(subDesc,val[key]))
                return true
              }
              let desc = obDesc || subDesc
              if (!desc) return
              Object.defineProperty(self,key,mergeDescs(desc,val[key]))
            })
          }
        }
        
        console.log('object',object)
        console.log('subject',subject)

        mergeProps(object,subject,{configurable:true})

        let firstPassResult = callback.call(object,...arg)

        let fpType = _typeof.class(firstPassResult)
        let obType = _typeof.class(object)
        if (fpType !== Object && fpType !== obType) {
          mergeProps(firstPassResult,object,Reflect.ownKeys(firstPassResult))
          mergeProps(firstPassResult,subject,{configurable:true})
          replace(firstPassResult)
          object = callback.call(firstPassResult)
        }
        else {
          replace(firstPassResult)

          Reflect.ownKeys(firstPassResult).forEach(key => {
            if (key in object) {
              let desc = Object.getOwnPropertyDescriptor(object,key)
              if (desc.set) {
                object[key] = firstPassResult[key];
                if (ownProp(object,key) && object !== firstPassResult)
                  delete firstPassResult[key]
              }
            }
          })
          Reflect.ownKeys(object).filter(key => !(key in firstPassResult)).forEach(key => {
            let desc = Object.getOwnPropertyDescriptor(object,key)
            if (desc.get) try { desc.get.call(object) } catch {}
          })
          mergeProps(object,firstPassResult,{configurable:true})
        }

        let secondPassResult = callback.call(object,...arg)
        replace(secondPassResult,object)
        Reflect.ownKeys(secondPassResult).forEach(key => {
          if (key in object) {
            let desc = Object.getOwnPropertyDescriptor(object,key)
            if (desc.set) {
              object[key] = secondPassResult[key]
              if (ownProp(object,key) && object !== secondPassResult)
                delete secondPassResult[key]
            }
          }
        })
        Reflect.ownKeys(object).filter(key => !(key in firstPassResult)).forEach(key => {
          let desc = Object.getOwnPropertyDescriptor(object,key)
          if (desc.get) try { desc.get.call(object) } catch {}
        }) 
        subject = restore(backup(subject))

        if (!inits.has(object.constructor)) {
          Array(_extends, constructor,prototype,__proto__,_static).forEach(item => {
            let desc = getDescriptor(subject,item)
            if (!desc) return
            if (desc.get || desc.set) {
              desc.set = function(val) { return true }
            }
          })
        }
        let decls
        let props = (secondPassResult !== object) ? secondPassResult : undefined
        inits.add(object.constructor)
        mergeProps(object,boundObject(secondPassResult,object))
        
        let descs = {}
        Reflect.ownKeys(object).forEach(key => {
          let desc = Object.getOwnPropertyDescriptor(object,key)
          if (typeof desc.value === 'function') {
            decls = decls || findDeclarations(callback.toString())

            let names = decls.names
            let dvProto = Object.getPrototypeOf(desc.value)
    
            if (typeof dvProto === 'function' && Reflect.ownKeys(dvProto).filter(ky => !Array('length','bind','apply','call').includes(ky)).every(ky => dvProto[ky] === desc.value[ky]))
              if (names.includes(key) || names.includes(dvProto.name) || names.includes(window[key])) {
                mergeProps(desc.value,dvProto,['bind','call','apply','length'])
                descs[key] = desc
              }
          }
        })
        if (Reflect.ownKeys(descs).length) defineProps(object,descs)

        Reflect.ownKeys(object).forEach(key => (key.split("__")[0] === "" || /^{{(.*?)}}$/.exec(key)) && delete object[key])
        
        return object
      }
    }[theName]
    Object.setPrototypeOf(theConstructor,callback)
    if (staticProps) mergeProps(theConstructor,staticProps)

    try { 
      if ( _typeof.class(new callback()) === callback ) {
        Object.setPrototypeOf(theConstructor.prototype,callback.prototype) 
        return theConstructor
      }
    } catch {}
    theConstructor.prototype = mergeProps(callback.prototype,theConstructor.prototype)
    return theConstructor
  }
}
privateVars(Constructor).instances = new WeakMap

  
function boundObjectMerge(trg,src,...bind) {
  return merge(trg,src,(key,desc) => {

    let type = Array("get", "value").find(type => typeof desc[type] === 'function' && key !== 'constructor')
    if (!type) return desc
    let original = desc[type];
    let newFunc = function(...args) {
      let binder = [...bind]
      if (binder.length && !binder[0])
        binder[0] = this 
      else binder[0] = ((key in _typeof.class(binder[0]).prototype) && !ownProp(binder[0],key)) ? binder[0] : (key in _typeof.class(this).prototype) && !ownProp(this,key) ? undefined : bindProxy(this,src,binder[0], trg === src ? null : this)
      return original.bind(...binder)(...args)
    }
    let newProp = type === 'value' ? cloneFunc(original,newFunc) : Object.setPrototypeOf(mergeProps(newFunc,original,['length']),original)

    Array('bind','apply','call').forEach(meth => {
      Object.defineProperty(newProp,meth,{value:function(...arg) { 
        if (arg[0]) {
          let args = [...arg]
          let newBind = args[0]
          if (args.length && !newBind)
            newBind = this
          else newBind = ((key in _typeof.class(newBind).prototype) && !ownProp(newBind,key)) ? newBind : (key in _typeof.class(this).prototype) && !ownProp(this,key) ? undefined : bindProxy(this,src,newBind,trg === src ? null : this)
          arg[0] = newBind
        }
        return Function.prototype[meth].bind(original)(...arg)   
      },configurable:true,enumerable:false,writable:true})
    })
    desc[type] = Object.setPrototypeOf(newProp, original);
    return desc
  })
}
exports.boundObjectMerge = boundObjectMerge
  
function boundObject(object,bind,callback) {
  
  let selfbind = (self) => {
    let firstCall = callback.call(self)
    self = merge(self,firstCall)

    replaceThis(self,callback)

    let secondCall = callback.call(self)
    self = merge(self,secondCall)
    replaceThis(self,callback)
    return self
  }

  if (arguments.length === 1 ) {
    if (typeof arguments[0] === 'function') {
      callback = object; 
      object = callback.call({})
      return selfbind(object)
    } else {
      bind = object; callback = null 
      return clone(object,true,(key,desc) => {
        return ReflectBind.descriptor(bind,key,bind)
      })
    }
  }
  if (arguments.length === 2) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1] 
      bind = object
      object = selfbind(callback.call({}))
      return boundObjectMerge(object,object,bind)
    }
    let softTarget = {}
    return boundObjectMerge(softTarget,object,bind)
  }
  let trg = clone(bind,true)
  let props = selfbind(object)
  let subject = boundObjectMerge(trg,props,bind)
  return replaceThis(merge(subject,callback.call(subject)),callback)
}
exports.boundObject

function boundProperties(object,...bind) {
  return boundObject({},object,function() {
    let descs = getDescriptors(object,(desc) => {
      Array('set','get','value').forEach(type => {
        if (typeof desc[type] === 'function') {
            let property = desc[type]
            desc[type] = function(...arg) {
              arg = Object.assign(arg,bind.slice(1))
              try { return property.call(bind[0],...arg) } catch(err) { console.log(bind[0]); if (desc.key in bind[0]) return bind[desc.key](...arg);  }
            }
            return desc
        }
      })
    })
    return Object.defineProperties(this,descs)    
  })
} 
module.exports = require('../utilsCompiled').getClone(module.exports)