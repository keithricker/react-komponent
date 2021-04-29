const aliasifyConfig = {
  aliases: {},
  verbose: false
};
let browserNodes = require('react-komponent/src/_webpack/browser-node').paths
Reflect.ownKeys(browserNodes).forEach(key => aliasifyConfig.aliases[key] = browserNodes[key])
module.exports = aliases