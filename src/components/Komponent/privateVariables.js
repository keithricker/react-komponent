Object.defineProperty(exports, "__esModule", {
   value: true
});
const { WeakerMap,Standin,randomString} = require('../helpers/utils')

const privateMap = new WeakerMap()
const privateObj = {
    randomString: randomString()
}
let defaultVars = () => Object.setPrototypeOf({},{
   getSet(key,value) {  
       if (!this.hasOwnProperty(key)) this[key] = value
       return this[key]
   }
})

exports.default = new Standin(privateMap,{
    get: function(ob,prop) { 
       return ob[prop] || privateObj[prop];  
    },
    set: function(ob,prop,val) {
       if ((prop in privateMap)) throw new Error('Property name '+prop+' is reserved. Try a different name for your variable.')
       privateObj[prop] = val; return true 
    },
    apply: function(a,b,props) {
       let obj = props[0]; let val = props[1]; let def = defaultVars();
       if (!privateMap.has(obj)) privateMap.set(obj,def) 
       if (props.hasOwnProperty(1)) privateMap.set(obj,val)
       return privateMap.get(obj)
    }
})