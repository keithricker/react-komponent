#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
process.env.NODE_ENV = 'development'

const appRoot = path.resolve("../..")
const komponentRoot = path.resolve(process.cwd())

const config = path.resolve(__dirname,'../','node_modules/react-scripts/config/webpack.config')('development')
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")

// outputs to static/js/bundle.js
config.output.path = komponentRoot+'/dist'
config.entry = komponentRoot+'/src/components/componentFunction.js'
config.mode = 'development'
config.optimization.minimize = false,
delete config.optimization.splitChunks
config.plugins.unshift(
   new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
   })
)
config.plugins.forEach((plug,ind)=> {
   if (plug instanceof HtmlWebpackPlugin)
      config.plugins.splice(ind,1)
})
delete config.output.chunkFilename

webpack(config).run((err, stats) => {
   if (err) console.error(err)
})
