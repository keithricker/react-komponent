const Obj = (function () {

   const mixin = (...arg) => require('./utils').mixin(...arg)
   const PrivateVariables = (...arg) => new require('./utils').PrivateVariables(...arg)
   const vars = (...arg) => require('./utils').vars(...arg)
   const ReflectBind = (...arg) => require('./utils').ReflectBind(...arg)
  
    vars.default(Obj,{ mixins:new PrivateVariables() })
    let iz = is

    let newObj = function Obj(obj) {
      obj = Object(obj)
      let mixins = mixins.default(this)
      if (mixins(this)) return mixins(this);
      
      let mix = function() {

         let mix = {
            has(prop) {
               return this.hasOwnProperty(prop);
            },
            get keys() { return Reflect.ownKeys(this) },
            get type() {
               return Array.isArray(this) ? "array" : typeof this;
            },
            get Type() {
               let theType; let self = this
               const Type = function Type() {
                  return ({}).toString.call(self).split('[')[1].split(' ')[1].split(']')[0]
               }
               let glb = suppress(() => window,global)
               Type.class = () => glb[theType]
               return Type
            },
            get entries() { 
               let self = this
               const entries = function entries(enumerable=false,symb=false) {
                  if ('entries' in self) return self.entries
                  let method; let entries = [];
            
                  method = (symb && enumerable) && Reflect.ownKeys || (enumerable) && Object.getOwnPropertyNames || Object.keys
                  let entry = []
                  method(self).forEach(key => {
                     let descriptor = Object.getOwnPropertyDescriptor(self,key)
                     let type = descriptor.get || descriptor.value
                     if (typeof descriptor[type] === 'function') descriptor[type] = descriptor[type].bind(self)
                     entry[0] = key
                     Object.defineProperty(entry,1,descriptor)
                     entries.push(entry)
                  })
                  // let method = (symb) && Reflect.ownKeys || enumerable && Object.getOwnPropertyNames || 
               }
               entries.asArray = function() {
                  return Array.from(selfs.entries())
               }
            },
            size(enumerable=false,symb=false) {
               let self = this
               if (('size' in this) && !isNaN(this.size)) return this.size
               if (typeof this === 'string') return this.length
               if (suppress( () => { self = [...this]; return self } ),false) return this.length
               self = Object(self)
               self = suppress(() => { 
                  let res = Object.fromEntries(self)
                  return res || self
               },self)
               return (enumeralbe && symb) ? Reflect.ownKeys(self).length : enumerable ? Object.getOwnPropertyNames(self).length : Object.keys(self).length 
            },
  
            clear() {
               Reflect.ownKeys(this).forEach(key => {
                  try { delete this[key] } catch(err) { console.error(err) }
               })
            },
            forEach(cb) {
               Reflect.ownKeys(this).forEach((key,ind) => cb(key,this[key],ind,this))
            },
            filter(cb) {
               let filtered = {}
               Reflect.ownKeys(this).forEach(function(key,ind) {
                  let res = cb(key,this[key],ind,filtered)
                  if (res === true) filtered[key] = res
               }.bind(this))
               return filtered
            },
            map(mapped,cb) {
               cb = cb || mapped
               mapped = arguments[1] ? mapped : undefined;
               let self = this
               if (proto.get(this).hasOwnProperty('map')) return proto.get(this).map.bind(this)
               mapped = new Obj(this).Type.class()
               Reflect.ownKeys(this).forEach((key,ind) => {
                  let res = cb(key,self[key],ind,mapped)
                  let desc = is.descriptor(res) ? res :
                     { value:res,writable:true,configurable:true,enumerable:true }
                  Object.defineProperty(mapped,key,desc)
               })
               return mapped
            },
            define(key,val,type) {
               let isDef = false;
               if ([...arguments].length === 2 && is.thisect(val))
                  isDef = is.descriptor(val)
               return Object.defineProperty(
                  this,
                  key,
                  isDef ? val : { [type]: val, configurable: true }
               );
            },
            reverseLookup(val) {
               let key
               let lvl = getLevel(this,lv => {
                  if (val.name && lvl.hasOwnProperty(val.name) && iz.equivalent(val,lvl[val.name],false))
                     key = val.name
                  Reflect.ownKeys(lv).some(pr => { 
                     key = iz.equivalent(val,lv[pr]) && pr
                  })
                  if (key) return true
               })
               return key
            },
            mixin(...arg) { 
               return mixin(this,...arg) 
            },
            bind(target) {
               return new Proxy(this,{
                  get(ob,prop) { return ReflectBind(ob,prop,target) }
               })
            },
            mirror(trg,bnd) {
               
               let bind = (target=trg) => bnd || (target !== bnd) && trg
               trg = trg || new Obj(src).Type.class()
               return merge(trg,src,(key,desc) => {
                  delete desc.value
                  desc.get = function() {
                     return ReflectBind(key,src[key],bind)
                  }
                  return desc
               })
            },
            get is() {
               function is(obj) {
                  return Object.prototype.is.call(obj,this)
               }
               [iz['{{handler}}'],utilTypes()].forEach(ob => {
                  Obj(ob).forEach((key,val) => {
                     if (ob[key].arguments.length > 1) return
                     Object.defineProperty(is,key,{ get:() => ob[key](this) }) 
                  })
               })
               return is
            },
            equivalent(obj) {
               return iz.equivalent(obj,this)
            },
            get proto() {
               return Object.getPrototypeOf(this);
            },
            set proto(val) {
               return Object.setPrototypeOf(this, val);
            }
         }
         return mix

      }.bind(obj)()
      mixins.set(obj,mix)
      return mix
    }
    return newObj
})()

Object.defineProperty(module,'exports',{get:function() { return Obj }})