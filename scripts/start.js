const path = require('path')
const express = require('express')
process.env.NODE_ENV = 'development'
console.log(process.cwd())
console.log(__dirname)
const config = require(process.cwd()+'/node_modules/react-scripts/config/webpack.config')('production')
const webpack = require(process.cwd()+'/node_modules/webpack');
const ReactServerHTMLPlugin = require(process.cwd()+'/node_modules/react-komponent/config/react-server-html')
const MiniCssExtractPlugin = require(process.cwd()+'/node_modules/mini-css-extract-plugin')

const app = express()
app.use(express.static('dist'))
app.set('env','development');
const port = 3000

const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/

config.plugins.push(new ReactServerHTMLPlugin(),new MiniCssExtractPlugin())
config.output.path = path.resolve('./dist')
config.mode = 'development'
config.optimization.minimize = false
config.module.rules.forEach((rule,ind) => {
   if (rule.oneOf) {
      config.module.rules[ind].oneOf.unshift({
         test: /\.css$/i,
         use: [MiniCssExtractPlugin.loader, 'css-loader'],
      })
   }
})

const build = webpack(config).run((err, stats) => {
   if (err) console.error(err)
})

app.get('/',(req,res) => {
   const indexFile = path.resolve('./build/index.html');
   res.sendFile(indexFile)
});
// app.use(handleRender)

//Serve static files
app.use(express.static("./build"));

app.listen(port, () => {
   console.log(`Server is listening on port ${port}`);
});