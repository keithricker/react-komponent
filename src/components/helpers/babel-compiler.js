module.exports = function (src,path) {
    src = require("path").resolve(process.cwd(), src);
    let processed;
  
    let asString = require('fs').readFileSync(src, { encoding: "utf8" });

    let babelpath = '../../../node_modules/@babel'
    // let btcjs = require.resolve(babelpath+'/transform-commonjs')

    /*
    var babel = require("@babel/core");
    const transform = babel.transform
    processed = transform(asString, {
      presets: [_react, env],
      plugins: [transformRuntime, asyncToGenerator]
    }); */
    // [btcjs, { "onlyExports": true }]

 
    const babel = require("@babel/standalone");
    const transform = babel.transform;
    processed = transform(asString, {
      presets: ["react", "env"],
      plugins: ["transform-runtime", "transform-async-to-generator"]
    });
  
    /*
    processed = require("@babel/core").transformFile("" + asString, {
      presets: ["@babel/preset-react","@babel/preset-env"],
      plugins: ["@babel/plugin-transform/react-jsx"],
    });
    */

    asString = processed.code;
    if (path === 'string') return asString

    /*    
    let requirer = require('./utilsCompiled').require
    const requireFromString = require('./utilsCompiled').requireFromString 
    */
    let requirer = require
    
    // if (path === 'object') return requireFromString(asString,'false')

    if (!path) {
      let parsed = requirer("path").parse(src);
      path = `${parsed.dir}/${parsed.name}-Module-babel-compiled.${parsed.ext}`;
    }
    
    let dest = requirer("path").resolve(process.cwd(), path);
    requirer("fs").writeFileSync(dest, asString);
    if (!arguments[1]) {
      let requiredModule = requirer("" + dest);
      // let requiredModule = require(''+dest)
      // fs.unlinkSync(dest);
      return requiredModule;
    }
    return dest;
  }