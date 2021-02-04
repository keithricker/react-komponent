module.exports = {
    get Komponent() { return require('./src/components/Komponent/higherOrderCompiled.js') },
    get RootComponent() { return require('./src/components/RootComponentCompiled.js').RootComponent },
    get RootClass() { return require('./src/components/RootComponentCompiled.js').RootClass },
    get SSR() { return require('./server/server.js') },
    get utils() { return require('./src/components/helpers/utilsCompiled.js') }
}
