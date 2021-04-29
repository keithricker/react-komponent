module.exports = function webpackCompile(entry,output,id,callback) {
    let args = [...arguments]
    return (async function() {

      const {isURL} = require('react-komponent/utils')
      let dir, fs = require("fs"), path = require('path'), overrides = {}
      callback = args.find((arg,ind) => { 
        if (typeof arg === 'function') return args.slice(ind,1)
      })
      const makeAbs = (thePath) => {
        let isAbs = thePath.indexOf(process.cwd()) === 0
        if (thePath.indexOf('/') === 0 && !isAbs)
          thePath = '.'+thePath 
        return !isAbs ? path.resolve(process.cwd(),thePath) : thePath
      }

      if (args.length === 1 && typeof args[0] === 'object') {
        overrides = args[0];
        entry = overrides.entry;
        output = overrides.output ? path.resolve(overrides.output.path,overrides.output.filename) : undefined
        if (overrides.output.library) id = overrides.output.library
      }
  
      let theModule, parsed = path.parse(entry), isLocal
      if (output) output = makeAbs(output)
  
      if (!isURL(entry)) {
        entry = makeAbs(entry)
        if (!output) output = path.resolve(process.cwd(),parsed.dir+'/'+id+'-dynamicImport'+parsed.ext)
        isLocal = fs.existsSync(entry)
        isModule = isLocal && !!((function() { try { return !!(Object.keys(require(entry)).length) } catch { return false } })())
  
      } else {
        let fetchit = require('react-komponent/modules/browser').fetch
        theModule = await fetchit(entry).then(res => res.text())
      }
  
      if (!output) {
        if (process.env.PUBLIC_URL) dir = process.env.PUBLIC_URL
        else {
          Array('public','dist','build').forEach(dirName => {
            let stat = fs.statSync(path.resolve(process.cwd(),dirName))
            if (stat && stat.isDirectory()) {
              dir = dir || dirName
            }
          })
        }
        if (dir) output = path.resolve(dir,id+'-dynamicImport.js')
      } else output = makeAbs(output)
  
      overrides = Object.assign(overrides,{
        entry: makeAbs(entry),
        resolve: Object.assign({
          modules: [path.resolve(__dirname,'../','src'),path.resolve(process.cwd(),'src'),path.resolve(process.cwd(),'node_modules'),path.resolve(__dirname,'../','node_modules'),...(overrides && overrides.resolve && overrides.resolve.modules) ? overrides.resolve.modules : []],
        },overrides && overrides.output && overrides.output.resolve || {}),
        output: Object.assign(overrides.output || {},{
          path: path.parse(output).dir,
          filename: path.parse(output).base,
        })
      })

      if (id) overrides.output.library = id
  
      if (isURL(entry)) {
        // let fetchData = require('react-komponent/utils').fetchit
        // return fetchData(entry,(res) => {
        fs.writeFileSync(output,theModule,'utf-8')
        overrides.entry = output
        return webpackCompile(overrides,callback)
        // })
      }
  
      let out = path.parse(output)
      let filename = out.name+out.ext
      let compiledPath = output
      
      if (overrides.entry === output) {
        filename = out.name+'-compiled'+out.ext
        compiledPath = path.resolve(global.SSR.distPath,filename)
      }
      out = path.parse(compiledPath)

      overrides.output = Object.assign(overrides.output,{ 
        path: out.dir,
        filename
      })
      if (id) overrides.output = Object.assign({ 
        libraryTarget: 'umd',
        umdNamedDefine: true,
        globalObject: 'this'
      },overrides.output || {})

  
      if (fs.existsSync(compiledPath)) fs.unlinkSync(compiledPath)
  
      let configCallback = function(con) {
        if (!con.plugins) return con
        con.plugins = con.plugins.filter(plug => !(plug.constructor && plug.constructor.name.toLowerCase() === 'cleanwebpackplugin'))
        return con
      }
      // Returns the output path and a variable representing the library (if one exists)
      require('./compiler.js').webpack({configCallback,overrides}, (...res) => {
        if (compiledPath !== output)
          fs.renameSync(compiledPath,output)


      
        let outDir = path.dirname(output)      
        let servable = Array(outDir && outDir+'/','public/','dist/','build/').filter(Boolean).find(dir => output.includes(dir))
        let pathname = output.slice(output.lastIndexOf(servable)+servable.length,output.length)
        let Earl = require('react-komponent/utils').Earl
        let resl = Earl.format({...Earl(Earl().toString()), pathname }).toString()
         
        let ret = { path:output,url:resl }
        ret.json = JSON.stringify(ret)


        if (callback) return callback(ret,...res)

        else return new Promise(reslv => reslv(ret))
      })
    })()
  
  }