module.exports = function dynamicScript(script, id, callback) {
  let args = [...arguments]
  return (async function() {

    const {isURL} = require('react-komponent/utils')
    let entry,dir, fs = require("fs"), path = require('path')
    let output = (typeof callback === 'string') ? args[2] : undefined
    callback = args.find(arg => typeof arg === 'function')

    let isModule, theModule, parsed = path.parse(script), isLocal
    const fixPath = (thePath) => {
      if (thePath.indexOf('/') === 0 && !thePath.includes(process.cwd()))
        thePath = '.'+thePath 
      return !thePath.includes(process.cwd()) ? path.resolve(process.cwd(),thePath) : thePath
    }
    if (output) output = fixPath(output)

    if (!isURL(script)) {
      script = fixPath(script)
      if (!output) output = path.resolve(process.cwd(),parsed.dir+'/'+id+'-dynamicImport'+parsed.ext)
      isLocal = fs.existsSync(script)
      isModule = isLocal && !!((function() { try { return !!(Object.keys(require(script)).length) } catch { return false } })())

    } else {
      let fetchit = require('react-komponent/modules/browser').fetch
      theModule = await fetchit(script).then(res => res.text())
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
    } else output = path.resolve(process.cwd(),output)


    if (isURL(script)) {
      // let fetchData = require('react-komponent/utils').fetchit
      // return fetchData(script,(res) => {
        fs.writeFileSync(output,theModule,'utf-8')
        script = output
        return dynamicScript(script,id,output,callback)
      // })
    }

    let overrides = {
      entry: entry || path.resolve(process.cwd(),script),
      target: 'web',
    }

    let move = false
    let out = path.parse(output)
    let filename = out.name+out.ext
    let compiledPath = output
    
    if (path.resolve(overrides.entry) === path.resolve(output)) {
      filename = out.name+'-compiled'+out.ext
      compiledPath = path.resolve(global.SSR.distPath,filename)
      move = true
    }
    out = path.parse(compiledPath)

    overrides.output = { 
      path: out.dir,
      filename,
      library:id,
      libraryTarget:'umd',
      umdNamedDefine: true
    }

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
      if (callback) return callback(output,...res)
      else return new Promise(reslv => reslv(output))
    })
  })()

}