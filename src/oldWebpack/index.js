module.exports = {
	config: function(env) {
    const path = require('path')
    const excludes = [path.resolve(__dirname,'../../../server'),/node_modules/]
    let conf = require(path.resolve(__dirname,'../_webpack/node_modules/react-scripts/config/webpack.config.js'))(env)

    let appendRule = (rule) => {
      if (rule.oneOf) { 
        rule.oneOf = rule.oneOf.map(rl => appendRule(rl))
        return rule
      }
      if (rule.exclude) {
        let exc = rule.exclude
        if (!Array.isArray(rule.exclude)) {
          exc = String(exc)
          exc = exc.slice(1,exc.length-1)
          rule.exclude = new RegExp(`(?: ${exc}|node_modules)`)
        } else {
          exc = String(exc[0])
          exc = exc.slice(1,exc.length-1)
          rule.exclude[0] = new RegExp(`(?: ${exc}|node_modules)`)
        }
      } else rule.exclude = /node_modules/
      return rule
    }

    conf.module.rules = conf.module.rules.map(rule => appendRule(rule))
    conf.module.rules.push(appendRule({}))

    conf.externals = {
      webpack: 'webpack',
      // ['react-komponent']:'react-komponent'
    }

    /*
    let babelRule, hasParser
    conf.module.rules = conf.module.rules.filter(rule => {
      if (rule.parser) { hasParser = rule.parser; return false }
      return true
    })
    if (hasParser && hasParser.requireEnsure) {
      conf.module.parser = conf.module.parser || {}
      conf.module.parser.javascript = { requireEnsure: hasParser.requireEnsure }
    }
    let oneOf = conf.module.rules.find(rule => rule.oneOf)
    if (oneOf) {
      babelRule = oneOf.oneOf.filter(rule => {
        rule.resolve = rule.resolve || {} 
        rule.resolve.fullySpecified = false
        let tests = (!Array.isArray(rule.test)) ? [rule.test] : rule.test
        if (!tests.filter(Boolean).length) return false
        return tests.some(tst => tst.test('file.js') || tst.test('file.jsx'))
      }).forEach(rl => {
        /*
        if (!rl.exclude) rl.exclude = /node_modules/
        else {
          rl.exclude = /(?:webpack|oldWebpack)/
          /*
          let ex = rl.exclude
          if (Array.isArray(ex)) ex = ex[0]
          ex = ''+ex
          ex = ex.slice(1,ex.length-2)
          ex = new RegExp(`(?:${ex}|node_modules)`)
          if (Array.isArray(rl.exclude)) rl.exclude[0] = ex
          else rl.exclude = ex
          
        } 
       
      })
    }
    */
    return conf
	},
	webpack: require('webpack')
}
