/*
const path = require('path')
const express = require('express');
const fs = require("fs");
const nodeEnv = process.env.NODE_ENV
Object.defineProperty(process.env,'NODE_ENV',{value:'development',writable:true})
const modulePath = process.cwd()+'/node_modules/react-komponent'
const config = require(process.cwd()+'/node_modules/react-scripts/config/webpack.config')('production')
const webpack = require(process.cwd()+'/node_modules/webpack');
const ReactServerHTMLPlugin = require(modulePath+'/config/react-server-html')
const MiniCssExtractPlugin = require(process.cwd()+'/node_modules/mini-css-extract-plugin')

const app = express()
app.use(express.static('dist'))
const appEnv = app.get('env')
app.set('env','development');
const port = process.env.Port || process.env.PORT || 3000
*/

/*
execSync(`cd ${modulePath} && npm run-script server-setup`, (error, stdout, stderr) => {
   if (error) {
       console.log(`error: ${error.message}`);
       return;
   }
   if (stderr) {
       console.log(`stderr: ${stderr}`);
       return;
   }
   console.log(`stdout: ${stdout}`);
});
*/


// const Mod = require('../src/components/helpers/Module')
// const modulePath = process.cwd()+'/node_modules/react-komponent'
// const commandLine = require(`${modulePath}/src/components/helpers/utilsCompiled.js`).commandLine



// const fs = require('fs');
//const path = require('path');
// In newer Node.js versions where process is already global this isn't necessary.
var process = require("process");



// "babel-compile": "babel src/components/fetchingOverlay.js -d dist --copy-files && mv dist/fetchingOverlay.js src/components/fetchingOverlayCompiled.js && babel src/components/Komponent/higherOrder.js -d dist --copy-files && mv dist/higherOrder.js src/components/Komponent/higherOrderCompiled.js && babel src/components/RootComponent.js -d dist --copy-files && mv dist/RootComponent.js src/components/RootComponentCompiled.js && babel src/components/helpers/utils.js -d dist --copy-files && mv dist/utils.js src/components/helpersCompiled.js",

// commandLine(`cd ${modulePath} && npm run-script babel-compile`);

// commandLine(`npm run-script build`);

let server = require(process.cwd()+'/server/server.js')

/*
server = server()
server.start()
*/
/*
execSync(`npm run-script build`, (error, stdout, stderr) => {
   if (error) {
       console.log(`error: ${error.message}`);
       return;
   }
   if (stderr) {
       console.log(`stderr: ${stderr}`);
       return;
   }
   console.log(`stdout: ${stdout}`);
});
*/

/*
execSync(`cd ${modulePath} && npm run-script babel-compile`, (error, stdout, stderr) => {
   if (error) {
       console.log(`error: ${error.message}`);
       return;
   }
   if (stderr) {
       console.log(`stderr: ${stderr}`);
       return;
   }
   console.log(`stdout: ${stdout}`);
});

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

Object.defineProperty(process.env,'NODE_ENV',{value: nodeEnv || 'development',writable:true})
app.set('env',appEnv || 'development');

app.get('/',(req,res) => {
   const indexFile = path.resolve('./build/index.html');
   res.sendFile(indexFile)
});

//Serve static files
app.use(express.static("./build"));

app.listen(port, () => {
   console.log(`Server is listening on port ${port}`);
});
*/