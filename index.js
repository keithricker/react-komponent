module.exports = {
    get Komponent() { return require('./src/components/Komponent/higherOrderCompiled.js') },
    get RootComponent() { return require('./src/components/RootComponentCompiled.js').RootComponent },
    get RootClass() { return require('./src/components/RootComponentCompiled.js').RootClass },
    get SSR() { return require('./server/server.js') },
    get utils() { return require('./src/components/helpers/utilsCompiled.js') },
    get framework() {
      return {
        get _Module() { return require('./src/components/helpers/Module') },
        get Obj() { return require('./src/components/helpers/Obj') },
        get _Proxy() { return require('./src/components/helpers/_Proxy') },
        get utils() { return require('./src/components/helpers/utils') },
        get _Map() { return require('./src/components/helpers/_Map') },
        get DOM() { return require('./src/components/helpers/DOM') }
      }
    }
}
