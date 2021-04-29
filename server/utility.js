let defaultRes = {
  sendFile(arg) { return arg },
  send(arg) { return arg },
  setHeader() {}
}

const req = require
let publicPath = req('react-komponent/src/_webpack').paths.appPublic
let importExp = /(?: i|\*\/i|\ni|\ri|^i)mport\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/
let exportExp = /(?: e|\*\/e||\ne|\re|^e)xport\s+?[^=].*?$/
let exportsExp = /(?:=e|.e| e|\ne|\re|\/\*|^e)xports(?:\s|\.|\n|\=).*?/

let randomString = () => 'req-'+req('react-komponent/utils').randomString(5)
let isReqMap = (str) => str.length = 17 && str.indexOf('req-') === 0 && str.indexOf('-map') === 13
let babelConfig = {
  simple: { plugins: ['@babel/plugin-transform-modules-commonjs'] },
  advanced: { presets: ["@babel/preset-react","@babel/preset-env"], plugins:["@babel/plugin-transform-runtime", "@babel/plugin-transform-async-to-generator"]},
  string: {
    simple: `--ignore node_modules --presets [ @babel/plugin-transform-modules-commonjs ]`,
    advanced: `--ignore node_modules --presets [ @babel/preset-env @babel/preset-react ] --plugins [ @babel/plugin-transform-runtime @babel/plugin-transform-async-to-generator ]`
  },
  none: undefined
}
let appPath = () => {
  let ar
  try { ar = global.reactKomponent.paths.appPath } catch {}
  return ar || process.cwd() 
}

theReqMap = new Map()
let othermap = new Map()

let thiss = module.exports = {

  get require() {

    const resolve = function resolve(path,base,target='browser') {

      if (typeof path !== 'string') return req()
      let resolved, pth = req('path'), appRoot = appPath()
      if (path.indexOf(appRoot) === 0 && pth.basename(path).includes("."))
        return path

      if (!base) base = this.base

      if (!base || 
        (path.indexOf('.') !== 0 
        && (path.indexOf('/') !== 0 && path.indexOf(appRoot !== 0))
        && req('path').basename(path).indexOf('.') === -1)
        || path.indexOf(appRoot) === 0) {
        let err
        try { resolved = req.resolve(path) } catch(er) { 
          err = er 
          try { resolved = req.resolve(req('path').resolve(appRoot,path)) } catch {}
        }

        if (target === 'browser' && req('path').basename(resolved).indexOf('.') === -1 && ((resolved && resolved.indexOf('/') !== 0) || path.indexOf('/') !== 0)) {
          let brows = req('react-komponent/modules/browser').paths[path]; 
          if (brows) resolved = brows
        }
        
        if (resolved) return resolved
        else throw err || new Error('problems '+path+' base:'+base)
      }

      
      let alternate = base,theBase = base, originalBase = theBase, newBass
      if (pth.basename(theBase).includes('.')) theBase = pth.dirname(theBase)
      
      theBase = pth.resolve(theBase)
  
      if (theBase.indexOf("/") === 0 && theBase.indexOf(appRoot) !== 0)
        theBase = theBase.replace('/',appRoot)
      if (
        path.indexOf("/") === 0 &&
        String(path)[1] !== "/" &&
        path.indexOf(appRoot) !== 0 && 
        (!originalBase || path.indexOf(originalBase) !== 0)
      )
        try { 
          path = path.replace("/", appRoot);
          resolved = req.resolve(path);                    
        } 
        catch { path = '.'+path }
      if (
        !resolved && path.indexOf(appRoot) === 0 ||
        path.indexOf(alternate) === 0
      ) {
        newBass = pth.dirname(path);
        path = pth.basename(path);
        Array(newBass, alternate).some((str) => {
          try {
            resolved = pth.resolve(str, path);
            req.resolve(resolved);
          } catch (err) {
            console.error(err);
          }
        });
      }
      if (
        (!resolved &&
        path.indexOf(".") !== 0 &&
        path.indexOf("/") !== 0 &&
        !pth.basename(path).includes("."))
        || path.indexOf(process.cwd() === 0)
      ) {
        try {
          if (req.resolve(path)) {
            resolved = req.resolve(path);
            newBass = pth.dirname(resolved);
            path = pth.basename(resolved);
          }
        } catch {}
      } else if (!resolved && base && thePath.indexOf(base) === 0)
        try { resolved = req.resolve(path.resolve(path.resolve(base),thePath)) } catch {
          try { resolved = req.resolve(path.resolve(req.resolve(base),thePath)) } catch {}
        }
      if (!resolved && path.indexOf("/") === 0 && path.indexOf(appRoot) !== 0)
        path = "." + path;
      if (!resolved) {
        let bass = newBass || base;
        resolved = req.resolve(pth.resolve(bass, path));
      } else resolved = resolved || path;
  
      if (
        resolved.indexOf(process.cwd()) === 0 &&
        resolved.indexOf(appRoot) !== 0
      ) {
        resolved = resolved.replace(process.cwd(), appRoot);
      }

      return resolved
    }


    
    function theRequirer(path,base,target='browser') {
 
      const theRequire = function (path,theBase,target) {

        if (!theRequire.resolve) theRequire.resolve = resolve

        let pth = req('path')

        // let code = module.exports.browserify(path,'auto','string')
        if (!theBase) theBase = theRequire.base;

        let resolved = theRequire.resolve(path,theBase,target)

        // console.log('resolved:',resolved)
        let code, compile, newBase = theBase
        if (pth.basename(resolved).includes('.')) newBase = pth.dirname(resolved)
        else newBase = resolved


        console.log('---------------'+path+'--'+newBase+'----------------')


        if (typeof resolved !== 'string') throw new Error('require path must be a string')

        theRequire.cache = theRequire.cache || Object.create(null);
        theRequire.map = theRequire.map || Object.create(null)

        let mod = {exports: {}};

        let args = {
          module:mod,
          target,
          exports: mod.exports,
          global,
          require:req,
          console,
          appRoot: appPath(),
          process,
          reqq:req,
          resolved,
          document:global.window.document,
          rfp: () => require("require-from-path")(resolved),
          theBase: { newBase },
          theRequire
        };
        if (target === 'web') {
          args.document = global.window.document,
          Object.keys(global.window).forEach(key => {
            if (key !== 'window') try { args[key] = global.window[key] } catch {}
          })
        }
        args.theRequire.base = newBase; 

        let wrapper = (script,...arg) => Function(...Object.keys(args),script)(...arg || Object.values(args)); //(5)      
        const getExp = (exp) => Object.keys(exp).length === 1 && exp.default ? exp.default : exp 
        
        if (theRequire.map[resolved]) {
          code = theRequire.map[resolved]
          if (theRequire.cache[resolved]) return getExp(theRequire.cache[resolved].exports)
          wrapper(code,...Object.values(args))
          return getExp(mod.exports)
        }

        const returnOut = (script=code,exp=mod.exports) => {
          theRequire.map[resolved] = script
          mod.exports = exp
          theRequire.cache[resolved] = mod
          return getExp(mod.exports)              
        }

        const append = `require = function(str) { 
          let re; 
          if (str.indexOf('.') !== 0 || str.indexOf(appRoot) === 0) {
            try { re = reqq.resolve(str,null,target) } catch { re = rfp().resolve(str) }
          } else {
            try { re = rfp().resolve(str) } catch { re = reqq.resolve(str,null,target) }
          }
          return theRequire(re,null,target);
        };`

        if (!code && (!(resolved.indexOf('.') !== 0 
        && (resolved.indexOf('/') !== 0 && resolved.indexOf(appPath() !== 0))
        && req('path').basename(resolved).indexOf('.') === -1))) { 
          
          let imgFormat = Array(".jpg", ".jpeg", ".gif", ".png").find((formt) => {
            return formt === pth.parse(path).ext;
          });
    
          if (imgFormat) {
            if (imgFormat === ".jpg") imgFormat = ".jpeg";
            imgFormat = imgFormat.slice(1, imgFormat.length);
            mod.exports = `data:image/${imgFormat};base64, ` +
            new Buffer(require("fs").readFileSync(resolved)).toString("base64")

            code = `module.exports = ${mod.exports}`
            return returnOut(code,mod.exports)
          }

          fs = require('fs')
          code = fs.readFileSync(resolved, 'utf8'); //(2)

          let isJson = (pth.parse(resolved).ext === '.json')  
          if (isJson) {
            mod.exports = JSON.parse(code)
            let newcode = `module.exports = JSON.parse(decodeURIComponent(\`${encodeURIComponent(code)}\`));`
            return returnOut(newcode,mod.exports)
          }
          
          if (Array(".scss",".sass").includes(pth.parse(path).ext)) {
            var sass = require("node-sass");
            code = sass.renderSync({
              data: code
            });
          }
          
          if (Array(".css", ".scss", ".sass").includes(pth.parse(path).ext)) {   
            code = `module.exports = (function() {
              var style = document.createElement("style");
              style.innerHTML = \`${code}\`
              document.head.appendChild(style); 
              return style
            })()`
          }

          theCode = code
          
          if (
            Array(".js", ".mjs", ".jsx", ".ts", ".tsx").includes(pth.parse(resolved).ext)
          ) {


            // if (!resolved.includes('/node_modules/')) {
            if (target !== 'web' && (importExp.test(code) === false && exportExp.test(code) === false && exportsExp.test(code) === true))
              compile = undefined 
            else if (importExp.test(code) === false && exportExp.test(code) === false)
              compile = 'simple'
            else compile = 'advanced'

            let options = babelConfig[compile]
            let babeloptions = [code]; if (options) options = babeloptions.push(options)

            code = require("@babel/core").transformSync(...babeloptions).code
              
            // }
            theCode = ` 
            ${append}
            ${code}`

          } 

          theCode = theCode || code
          theRequire.cache[resolved] = mod; //(4)  
          theRequire.map[resolved] = code
          wrapper(theCode,...Object.values(args)); //(6)


        } else if (!code) {

          code = `module.exports = reqq('${resolved}')`
          theRequire.map[resolved] = code
          wrapper(code,...Object.values(args))
          return returnOut(code)

        }

        theRequire.map[resolved] = theRequire.map[resolved] || theCode || code
        return theRequire.cache[resolved] && theRequire.cache[resolved].exports; //(7)
        
      }
      if (!theRequire.resolve) theRequire.resolve = resolve

      if (new.target) {
        if (path) theRequire.base = path
        return theRequire
      }

      // if (base && !theRequire.base) theRequire.base = base;
      return theRequire(path,base,target)
    }
    theRequirer.resolve = resolve
    return theRequirer
  },

  requireFromString(str,target,vars) {

  },

  requireFromMap(str,map) {
    if (arguments.length === 1)
      str = Object.keys(map)
  },

  get browserify() {
    const path = req('path')
    const fs = req('fs')
    const browserify = function browserify(script,compile='auto',format='path') {
      let execSync = req('child_process').execSync

      let code = fs.readFileSync(script,{encoding:'utf8'})

      if (compile === 'auto') {
        if (importExp.test(code) === false && exportExp.test(code) === false && exportsExp.test(code) === true)
          compile = undefined 
        else if (importExp.test(code) === false && exportExp.test(code) === false)
          compile = 'simple'
        else compile = 'advanced'
      }

      let parsed = path.parse(script)
      parsed.base = parsed.name+'-browserified-'+randomString(8)+parsed.ext
      let filename = path.format(parsed)
      let babelify = !compile ? '' : ` -t [ babelify ${babelConfig.string[compile]} ]`
      let browserify = req.resolve(`react-komponent/node_modules/browserify/bin/cmd.js`)
      let newFilename = publicPath+`/${parsed.base}`

      const browserified = execSync(
        `cd ${path.dirname(script)} && ${browserify} ${path.basename(script)} -s exports -o ${newFilename}${babelify}`,
      )
      if (format === 'string' || format === 'text') {
        let compiled = fs.readFileSync(newFilename,{encoding:'utf8'})
        // fs.unlinkSync(newFilename)
        return compiled
      }
      // fs.renameSync(filename,newFilename)
      return newFilename
    }
    browserify.express = function(req,res) {
      res = res || defaultRes
      let {script,compile,format} = req.query
      res.setHeader('content-type', 'text/plain')
      return res.send(thiss.browserify(script,compile,format))
    }
    return browserify
  },
  get post() {
    let postMethods = {
    }
    return postMethods
  },
  get get() {
    let getMethods = {
      get browserify() { return thiss.browserify }
    }
    return getMethods
  },
  get misc() {}

}