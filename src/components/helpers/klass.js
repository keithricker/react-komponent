 import priv from '../Komponent/privateVariables'
 import { descriptors } from './utils'

 const objToDescs = (trg) => {
   let descs = Object.getOwnPropertyDescriptors(trg)
   return Object.setPrototypeOf(descs,Object.getPrototypeOf(trg))
 }
 const descsToObj = (desc) => Object.setPrototypeOf(Object.defineProperties({},desc),Object.getPrototypeOf(desc))
 
 function klass(func) {
    let argus = [...arguments]
    let temp = argus.find(ar => typeof ar === 'object') || {}
    func = argus.find(ar => typeof ar === 'function') || temp.constructor
    let name = argus.find(ar => typeof ar === 'string') || temp.name || func.name; 
    let instance, newFunc
    temp.constructor = temp.constructor || func
    temp.defaults = {
      name,
      constructor:func,
      get extends() { 
        if (temp.prototype.constructor === Object || Object.getPrototypeOf(temp.prototype.constructor) === Function) return Object
          return Object.getPrototypeOf(temp.prototype.constructor)
      },
      set extends(val) { Object.defineProperty(temp,'extends',{value: val,configurable:true,writable:true}) },
      get prototype() { 
         if (this.static && func.prototype.constructor !== this.static)
            func.prototype.constructor = this.static
         return func.prototype 
      },
      set prototype(val) {
         Object.defineProperty(temp,'prototype',{value: val,configurable:true,writable:true})
         return true
      },
      template: temp
   }
   function props(...arg) {
     let props = {
       get _extends() {
         return (obj.constructor === Object.getPrototypeOf(obj.constructor)) ===
           Function
           ? Object
           : Object.getPrototypeOf(obj.constructor);
       },
       set _extends(val) { 
         if (obj instanceof val) {
            props._template.extends = val
            return true
         }
         if (val !== Object) {
           Object.setPrototypeOf(this.constructor, val);
           Object.setPrototypeOf(this.constructor.prototype, val.prototype);
         }
         this._target = new val(...arg);
         return throwIt(this,this._target, "extends");
       },
       get _name() { return props._static.name },
       set _name(val) { Object.defineProperty(props._static,'name',{value:val,enumerable:true,writable:false,configurable:true}); return true },
       get priv() {
         return priv.get(obj);
       },
       set priv(val) {
         let pr = priv.get(obj) || {};
         obj.mergeIt(pr, val);
         priv.set(obj, pr);
       },
       set _properties(val) {
         if (props.sets.properties) {
           Reflect.ownKeys(props._template.properties).forEach((key) => {
             delete obj[key];
           });
         }
         props._template.properties = val
         let descs = props._descriptors(val, { configurable: true },props._template.bind);
         return !!(Object.defineProperties(obj,descs))
       },
       get _properties() {
         return obj;
       },
       get _prototype() {
         return Object.getPrototypeOf(obj);
       },
       set _prototype(val) {
         if (props.sets.prototype)
           val = props._template.prototype
         props._template.prototype = val
         return !!(props._mergeIt(props._prototype,val))
       },
       get _static() {
         return obj.constructor;
       },
       set _static(val) {
         if (val !== obj.constructor) props._mergeIt(obj.constructor, val);
         props._template.static = val;
         return true;
       },
       sets: {},
       _super(...arg) {
         let ext = props._extends;
         if (arg.length === 0) {
           obj._target = this["{{target}}"] || this;
           return this;
         }
         if (priv.get(this).newTarget === false) return new ext(...arg);
         obj._target = new ext(...arg);
         let superFunc = function() { return obj._target; }
         let superTarget = new ext(...arg)
         let descs = props._descriptors(superTarget,{writable:false,configurable:false},superTarget)
         props._mergeIt(superFunc,descs)
         Object.setPrototypeOf(superFunc,Object.getPrototypeOf(superTarget))
         throwIt(obj,obj._target,"super")
       },
       _template: new Proxy(obj.constructor._template,{
         get(ob,prop) {
           if (['prototype','properties','static'].includes(prop))
             return descsToObj(ob[prop])
           return Reflect.set(...arguments)       
         },
         set(ob,prop,val) { 
           if (['prototype','properties','static'].includes(prop)) {
             if (prop === 'sets') return true
             props.sets[prop] = true
             return !!(ob[prop] = objToDescs(val))
           }
           return Reflect.set(...arguments)
         }
       }),
       _descriptors: descriptors.bind(obj),
       _mergeIt(thing1, thing2, def = {}) {
         if (arguments.length === 1) thing1 = obj;
         let descs = props._descriptors(thing2, def);
         return Object.defineProperties(thing1, descs);
       },
       _setIt(...args) { 
         if (args.length < 3) args.unshift(obj); return Reflect.set(...args) 
       },
       ['{{klass}}']: true
     }
     Object.defineProperties(props,props._descriptors(props,{enumerable:false}))
     return props
   }
   function proxIt(obj, ...arg) {
     if (!priv.has(obj)) priv.set(obj, {});
     let theProps = props(obj, ...arg);
    
     if (!obj['{{klass}}']) Object.setPrototypeOf(theProps,Object.getPrototypeOf(obj))
     Object.setPrototypeOf(obj,theProps)
     return obj
   }
   function revertIt(ob) {
     console.log('friffy')
     priv.get(ob).newTarget = false;
     ob = ob["{{target}}"] || ob;
     delete ob._extends;
     delete ob._target;
     delete ob._super
     delete ob._template;
     if (ob['{{klass}}'])
        Object.setPrototypeOf(ob,Object.getPrototypeOf(Object.getPrototypeOf(ob)))
     if (ob['{{klass}}'])
        Object.setPrototypeOf(ob,Object.getPrototypeOf(Object.getPrototypeOf(ob)))
     return ob;
   }
   function throwIt(obj,newTarget,type) {
     Object.setPrototypeOf(newTarget, obj.constructor.prototype);
     if (obj["{{swap}}"]) obj["{{swap}}"](newTarget);
     priv.set(newTarget, { newTarget: priv.get(obj).newTarget });
     throw { swap: newTarget, type: type }
   }
   function catchIt(instance, received) {
     if (received.swap) {
       if (received.type === "extends") {
         console.log('wild')
         Object.defineProperty(received.swap, "_extends", {
           get() {
             return instance._template.extends;
           },
           set() {
             return true;
           }
         });
       } return received.swap;
     }
   }
   if (argus.length === 1 && typeof argus[0] === "object") {
    
     newFunc = {
       [temp.name]: function (...arg) {
         let instance = this;
         // Object.defineProperties(this,Object.getOwnPropertyDescriptors(this.constructor._template.properties))
           
         
         if (!priv.get(this)) priv.set(this, {});
         if (new.target || this !== global) {
           priv.get(this).newTarget = true;
         }
         let thisProps = props(instance)
         Object.defineProperty(instance, "_super", {
           value: thisProps._super,
           enumerable: false,
           writable: true,
           configurable: true
         });
         thisProps._properties = this.constructor._template.properties
         
 
         try {
           func.call(instance, ...arg);
         } catch (caught) {
           if (!caught || caught.type !== "super") throw caught;
           instance = catchIt(instance, caught);
         }
         priv.get(instance).newTarget = false;
         revertIt(instance)
         let instProps = props(instance)
         instProps._properties = instProps._template.properties
         return instance
       }
     }[temp.name]
     
     newFunc._template = temp
     temp.defaults.static = newFunc
     temp.defaults.prototype = newFunc.prototype
     Object.setPrototypeOf(temp,temp.defaults)
     
     if (temp.extends) temp.prototype = Object.setPrototypeOf(temp.prototype,temp.extends.prototype)
     if (temp.prototype.constructor === Object) { 
       Object.defineProperties(newFunc.prototype,Object.getOwnPropertyDescriptors(temp.prototype)) 
       temp.prototype = newFunc.prototype
     }
     newFunc.prototype = temp.prototype
     Object.setPrototypeOf(newFunc,temp.extends)
     instance = proxIt(Object.setPrototypeOf(new temp.extends(),newFunc.prototype))
     temp.defaults.properties = instance
     Array(...new Set(['static','extends',...Reflect.ownKeys(temp.defaults).filter(key => key !== 'properties')]))
       .forEach(key => {
          console.log('key',key)
          instance['_'+key] = temp[key]
     })
     return newFunc
   }
 
   else newFunc = {
     [name]: function (...arg) {
       priv.set(this,{newTarget:true})
       let instance = proxIt(this, ...arg);
               
       try {
         func.call(instance, ...arg);
       } catch (caught) {
         instance = catchIt(instance, caught);
         instance = proxIt(instance, ...arg);
         if (caught.type === "extends") {
           try {
             func.call(instance, ...arg);
           } catch (caught2) {
             caught = caught2;
             if (caught) {
               instance = catchIt(instance, caught2);
             }
           }
         } else func.call(instance, ...arg);
         instance = revertIt(instance);
         this.constructor._initialized = true;
         return instance;
       }
       instance = revertIt(instance);
       instance.constructor._initialized = true;
       return instance;
     }
   }[name];
   newFunc._template = newFunc._template || temp
   temp = newFunc._template
   temp.constructor = newFunc
 
   temp.prototype = Object.setPrototypeOf(Object.getOwnPropertyDescriptors(temp.prototype),Object.getPrototypeOf(temp.prototype))
   if (temp._properties) temp.properties = Object.setPrototypeOf(Object.getOwnPropertyDescriptors(temp.properties),Object.getPrototypeOf(temp.properties))
   if (temp.static) temp.static = Object.setPrototypeOf(Object.getOwnPropertyDescriptors(temp.static),Object.getPrototypeOf(temp.static)) 
 
   priv.set(newFunc,{})
   return newFunc
}

let bindIt = (ob,prop,bnd) => {
  bnd = (arguments.length === 2) ? prop : bnd
  let fetched = (arguments.length === 2) ? ob : Reflect.get(...[ob,prop,...bnd].filter(Boolean))
  return typeof fetched === 'function' ? typeof bnd !== 'undefined' ? fetched.bind(bnd) : fetched : fetched 
}

