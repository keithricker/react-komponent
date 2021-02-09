function mirrorProxy(ref,handler={}) {
   Obj(Reflect).forEach(key => {
      handler[key] = function(...arg) { arg[0] = ref; return Reflect[key](...arg) }
   })
}
export function ObjectMap(obMap={}) {

   let theRef = {}; theHandler = {}
   let {proxy,swap} = swapProxy(theRef,theHandler)
   let type = (om) => om instanceof Map ? "map" : "object";

   obMap = obMap instanceof Map ? obMap : proto.set(new Map(Object.entries(obMap)),obMap)
   obMap = swap(obMap,Obj(Reflect).forEach(key => {

   }))

   let getEntries = (om) =>  {
       type(om) === 'map' ? Array.from(om.entries()) : Object.entries(om)
   }
   let toObject = (om) => {
      let tm = Object.fromEntries(om)
      proto.set(tm,obMap)

      let nh = { get() { return } }
   }
   let toMap = (om) => {
      let tm = new Map(vars(om).entries)
   }

   Obj(vars(obMap)).define('entries',() => { return getEntries(obMap) },'get')
   Obj(vars(obMap)).define('type',() => { return type(obMap) },'get')
   
   obMap.asObject = () => type(obMap) === "object" ? obMap : vars(obMap).entries
   obMap.asMap = () => type(obMap) === "object" ? toMap(obMap) : obMap

   let obProx = new Proxy()

   let omProto = {}; delete omProto.constructor
   proto.set(obMap,proto.set(omProto,type(obMap) === 'map' ? asObject : asMap))





 
   asObject.asMap = function () {
     return asMap;
   };
   asMap.asObject = function () {
     return asObject;
   };
 
   // create the object map that will be returned from the constructor
   let objMapHandler = {};
   let objectMap = new Proxy(asObject, new Handler(objMapHandler));
 
   asObject.objectMap = asMap.objectMap = objectMap;
   types(objectMap, type);
 
   // create two separate proxies, one for each type
   let asObjectHandler = { objmapType: "object", target: asObject };
   let asMapHandler = {
     objmapType: "map",
     target: asMap,
     ownKeys(map) {
       return Reflect.ownKeys(map.objectMap);
     }
   };
   let asMapProxy = new Proxy(asMap, new Handler(asMapHandler));
   let asObjectProxy = new Proxy(asObject, new Handler(asObjectHandler));
 
   asMapHandler.props = {
     // default(ob,prop) {},
     delete(map, prop) {
       return function (key) {
         Reflect.deleteProperty(map.asObject(), key);
         return map.delete(key);
       };
     },
     get(map, prop) {
       return function get(key) {
         return map.asObject()[key];
       };
     },
     set(map, prop) {
       return function set(key, val) {
         map.asObject()[key] = val;
         map.set(key, val);
       };
     },
     has(map, prop) {
       return function has(key) {
         return map.asObject().hasOwnProperty(key);
       };
     },
     forEach(map, prop) {
       return function forEach(cb) {
         Reflect.ownKeys(map.objectMap).forEach((key, ind, ths) => {
           return cb(map.asObject()[key], key, ind, ths);
         });
       };
     }
   };
 
   asObjectProxy = new Proxy(asObject, asObjectHandler);
   asMapProxy = new Proxy(asObject, asMapHandler);
 
   objMapHandler.default = function (ob, prop) {
     let type = types(objectMap);
     let returnVal;
     if (type === "object") {
       returnVal = asObjectProxy[prop];
       if (typeof returnVal === "undefined" && !(prop in ob))
         returnVal = asMapProxy[prop];
     } else if (type === "map") {
       returnVal = asMapProxy[prop];
       if (typeof returnVal === "undefined" && !(prop in ob.asMap()))
         returnVal = asObjectProxy[prop];
     }
     return returnVal;
   };
   objMapHandler.props = {
     asObject(ob, prop, rec = objectMap) {
       return function (...arg) {
         types(objectMap, "object");
         if (proto.get(objMapHandler) === asMapHandler)
           proto.set(objMapHandler, asObjectHandler);
         return rec;
         // return ob.asObject(...arg)
       };
     },
     asMap(ob, prop, rec = objectMap) {
       return function () {
         types(objectMap, "map");
         if (proto.get(objMapHandler) === asObjectHandler)
           proto.set(objMapHandler, asMapHandler);
         return rec;
       };
     }
   };
   objMapHandler.set = function (ob, prop, val) {
     ob.asMap().set(prop, tie(Reflect.get(ob, prop, ob), ob));
     return Reflect.set(ob, prop, val);
   };
   objMapHandler.deleteProperty = function (ob, prop) {
     Reflect.deleteProperty(ob, prop);
     return ob.asMap().delete(prop);
   };
   objMapHandler.defineProperty = function (ob, prop, def) {
     Reflect.defineProperty(ob, prop, def);
     return ob.asMap().set(prop, ob[prop]);
   };
   objMapHandler.ownKeys = function (map, key) {
     return function keys() {
       let kys = [];
       map.forEach((val, key) => kys.push(key));
       return kys;
     };
   };
 
   types(obMap, type);
   return objectMap;
 }