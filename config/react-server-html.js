var path = require('path');
var fs = require('fs')
var HtmlWebpackPlugin = require(process.cwd()+'/node_modules/html-webpack-plugin');
const miniCSS = require(process.cwd()+'/node_modules/mini-css-extract-plugin')
require('jsdom-global')()
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const express = require('express')
const app = express()
app.use(express.static('dist'))
app.use('/json', express.static('json'))

const root = path.resolve('./');


function ReactServerHTMLPlugin(options) {
	this.options = Object.assign({
        appRoot: "./dist",
        template: "./index.html",
        dataPath: "./json/data.json",
        url:"http://localhost",
        port: "3006"
	},options);
}

ReactServerHTMLPlugin.prototype.apply = function(compiler) {
   
    var self = this;

    var { appRoot, template, dataPath, url, port  } = self.options
    var fullURL = url+':'+port+'/'
    var fullPath = path.resolve(appRoot)
    self.options.url = fullURL
	compiler.plugin("emit", function(compilation, callback) {

        var templ = compilation.assets[path.basename(template)]
		if (templ) {

			var server = app.listen(port, async function () {
                var html = templ.source();

                const modifiedHTML = html.replace(/<script src="\//gi,'<script src="file://'+root+'/dist/')
                .replace(/link href="\//gi, 'link href="file://'+root+'/dist/')
                .replace(/(<link[^>]+rel=[^>]+href=\"\/)/gi,"$1file://"+root+"/public/")
                let assets = compilation.assets
                Object.keys(assets).forEach(key => {
                    let data = assets[key].source()
                    if (path.extname(key) === '.js') {
                        fs.writeFileSync(appRoot+'/'+key, data)
                        delete compilation.assets[key]
                    }
                    if (path.extname(key) === '.css') {
                        fs.writeFileSync(appRoot+'/'+key,data)
                        delete compilation.assets[key]
                    }
                })

                var virtualConsole = new jsdom.VirtualConsole();
                virtualConsole.on("error", (err) => { console.error("ERror",err) });
                virtualConsole.sendTo(console);

                console.log('html!', modifiedHTML)

                var options = {
                    url: fullURL,
                    runScripts: "dangerously",
                    resources: "usable"
                };
                var dom = new JSDOM(modifiedHTML,options)
                console.log('heyRoot',dom.window.document.querySelector("#root").innerHTML)

                dataPath = path.resolve(appRoot,dataPath);
                
                console.log('--------------------------------------------')
                console.log('cwd',process.cwd())
                console.log('things',Reflect.ownKeys(dom.window.document));

                console.log('heyDom',dom.window.document.querySelector("body").innerHTML)
                // throw new Error
                
                dom.window.document.addEventListener('DOMContentLoaded', (ev) => {

                    console.log('weeeee'); 

                    try {

                        let rawdata = fs.readFileSync(dataPath);
                        let json = { posts: JSON.parse(rawdata) };
                        html = html.replace('<div id="root"></div>','<div id="root">'+dom.window.document.getElementById("root").innerHTML+'</div>')
                        var script = `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(json).replace(/</g, '\\u003c')}</script>`
                        html = html.replace('</head>',`
                        ${script}</head>`)

                        compilation.assets[path.basename(template)] = {
                            source: function () {
                                return html;
                            },
                            size: function () {
                                return html.length;
                            }
                        };
                        callback()

                    } catch(error) {
                        console.error("Got an error: ", error)
                        throw new Error
                    }
                    server.close();

                }, false);

			})
		}
		else {
			callback();
		}

	});
}

module.exports = ReactServerHTMLPlugin;