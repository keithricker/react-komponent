module.exports = function(content) {
  let babelCompile = require('../../../src/components/helpers/babel-compiler')
  return babelCompile(content,'string')
  /*
  processed = require("@babel/core").transformFile("" + asString, {
      presets: ["@babel/preset-react","@babel/preset-env"],
      plugins: ["@babel/plugin-transform/react-jsx"],
  });
  */
};