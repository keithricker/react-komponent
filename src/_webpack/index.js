module.exports = {
	config: function(env) {

		const path = require("path")
    const reactPath = require.resolve(path.resolve(process.cwd(), 'node_modules/react'))
    const nodeMods = path.resolve(__dirname,'./node_modules')
		var HtmlWebpackPlugin = require(nodeMods+"/html-webpack-plugin");
		var MiniCssExtractPlugin = require(nodeMods+"/mini-css-extract-plugin");
		var { HotModuleReplacementPlugin } = require(nodeMods+"/webpack");
		var { CleanWebpackPlugin } = require(nodeMods+"/clean-webpack-plugin");
    let IgnorePlugin = require(nodeMods+'/webpack').IgnorePlugin
    var ManifestPlugin = require(nodeMods+'/webpack-manifest-plugin').WebpackManifestPlugin;
    var ProvidePlugin = require('webpack').ProvidePlugin
    const getClientEnvironment = require(nodeMods+'/react-scripts/config/env');
    let paths = require(nodeMods+'/react-scripts/config/paths')
    const enviro = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));
    const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
    const getCSSModuleLocalIdent = require(nodeMods+'/react-dev-utils/getCSSModuleLocalIdent');
    // const excludes = [path.resolve(__dirname,'../../../server'),/node_modules/]
    const excludes = []

    getStyleLoaders = (cssOptions, preProcessor) => {
      const loaders = [
        env === 'development' && require.resolve(nodeMods+'/style-loader'),
        env === 'production' && {
          loader: MiniCssExtractPlugin.loader,
          // css is located in `static/css`, use '../../' to locate index.html folder
          // in production `paths.publicUrlOrPath` can be a relative path
          options: paths.publicUrlOrPath.startsWith('.')
            ? { publicPath: '../../' }
            : {},
        },
        {
          loader: require.resolve(nodeMods+'/css-loader'),
          options: { ...cssOptions,resolve: { fullySpecified:false }},
        },
        {
          // Options for PostCSS as we reference these options twice
          // Adds vendor prefixing based on your specified browser support in
          // package.json
          loader: require.resolve(nodeMods+'/postcss-loader'),
          options: {
            // Necessary for external CSS imports to work
            // https://github.com/facebook/create-react-app/issues/2677
            ident: 'postcss',
            plugins: () => [
              require(nodeMods+'/postcss-flexbugs-fixes'),
              require(nodeMods+'/postcss-preset-env')({
                autoprefixer: {
                  flexbox: 'no-2009',
                },
                stage: 3,
              }),
              // Adds PostCSS Normalize as the reset css with default options,
              // so that it honors browserslist config in package.json
              // which in turn let's users customize the target behavior as per their needs.
              require(nodeMods+'/postcss-normalize')(),
            ],
            resolve: { fullySpecified:false },
            sourceMap: env === 'production' ? shouldUseSourceMap : env === 'development',
          },
        },
      ].filter(Boolean);
      if (preProcessor) {
        loaders.push(
          {
            loader: require.resolve(nodeMods+'/resolve-url-loader'),
            options: {
              sourceMap: env === 'production' ? shouldUseSourceMap : env === 'development',
              root: paths.appSrc,
            },
          },
          {
            loader: require.resolve(preProcessor),
            options: {
              sourceMap: true,
              resolve: { fullySpecified:false }
            },
          }
        );
      }
      return loaders;
    };

    let conf = require(path.resolve(__dirname,'../oldWebpack/node_modules/react-scripts/config/webpack.config.js'))(env)

    delete conf.output.jsonpFunction
    delete conf.output.futureEmitAssets
    
    if (!conf.resolve) conf.resolve = {}
    if (!conf.resolve.fallback) conf.resolve.fallback = {}
    conf.resolve.alias = { 
      ...conf.resolve.alias || {}, 
      'react':reactPath, 
      'reactKomponent':path.resolve(__dirname,'./global/reactKomponent/index.js'), 
      'text-encoder': require('./browser-node').paths.TextEncoder,
      'text-decoder': require('./browser-node').paths.TextDecoder,
      'jsdom': require('./browser-node').paths.jsdom,
      'url': require('./browser-node').paths.url,
      'process/dynamic': require('./browser-node').paths.process
      // 'buffer': require.resolve('./browser-node/buffer.js')
    }

    Object.keys(conf.node).forEach(key => {
        if (conf.node[key] === 'empty') {
          conf.resolve.fallback[key] = false
        }
    }) 
    Array('path','http','https','zlib','stream','crypto','os','constants','vm','console','util','buffer','jsdom','url','process','tty').forEach(mod => {
       conf.resolve.fallback[mod] = conf.resolve.fallback[mod] || require(`./browser-node`).paths[mod] 
    })
    conf.resolve.fallback.inspector = false

    delete conf.resolve.plugins

    let hasParser
    conf.module.rules = conf.module.rules.filter(rule => {
      if (!hasParser && rule.parser) { hasParser = rule.parser; return false }
      return true
    })
    if (hasParser && hasParser.requireEnsure) {
      conf.module.parser = conf.module.parser || {}
      conf.module.parser.javascript = { requireEnsure: hasParser.requireEnsure }
    }

      let htmlOptions = {
        inject: true,
        template: paths.appHtml,
        filename: 'index.html',
        publicPath: paths.publicUrlOrPath
       // publicPath: process.env.PUBLIC_URL || process.env.ASSET_PATH || path.resolve(process.cwd(),'./public'),
      }
      if (env === 'production') htmlOptions.minify = {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: false,
        minifyCSS: false,
        minifyURLs: true,
      }

      let plugs = Array(
        //Allows remove/clean the build folder
        new CleanWebpackPlugin(),

        new HotModuleReplacementPlugin(),
        //Allows to create an index.html in our build folder
        new HtmlWebpackPlugin(htmlOptions),
        //This get all our css and put in a unique file

        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash:8].css',
        }),
        new IgnorePlugin({ resourceRegExp:/^\.\/locale$/, contextRegExp:/moment$/ }),

        new ManifestPlugin({
          fileName: 'asset-manifest.json',
          publicPath: paths.publicUrlOrPath,
          generate: (seed, files, entrypoints) => {
            const manifestFiles = files.reduce((manifest, file) => {
              manifest[file.name] = file.path;
              return manifest;
            }, seed);
            const entrypointFiles = entrypoints.main.filter(
              fileName => !fileName.endsWith('.map')
            );
            return {
              files: manifestFiles,
              entrypoints: entrypointFiles,
            };
          },
        }),

        new ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          React: 'react',
          reactKomponent:'reactKomponent',
          regeneratorRuntime: 'regenerator-runtime/runtime',
          process: 'process/dynamic',
          TextEncoder:'text-encoder',
          TextDecoder:'text-decoder',
          // Buffer: 'buffer'
        })

    ).filter(Boolean)
    let constructors = ['ManifestPlugin',...plugs.map(plug => plug.constructor && plug.constructor.name).filter(Boolean)]
    
    let babelFull = {
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      //include: paths.appSrc,
      exclude: { or: [/node_modules/,/browser-node/,/react-komponent/] }, //don't test node_modules folder
      use: {
        loader: require.resolve(nodeMods+"/babel-loader"),
        options: { 
          presets: [
            ["@babel/preset-env"], 
            "@babel/preset-react"
          ], 
          plugins: [
            '@babel/plugin-transform-modules-commonjs',
            [
              require.resolve(nodeMods+'/babel-plugin-named-asset-import'),
              {
                loaderMap: {
                  svg: {
                    ReactComponent:
                      '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                  },
                },
              },
            ],
            env === 'development' &&
              enviro.raw.FAST_REFRESH &&
              require.resolve(nodeMods+'/react-refresh/babel'),
          ].filter(Boolean),  
          
          cacheDirectory: true,
          // See #6846 for context on why cacheCompression is disabled
          cacheCompression: false,
          compact: env === 'production',
        
        }
      },
      resolve: {
        extensions: [".js", ".jsx"],
        fullySpecified:false
      },
      type: "javascript/auto"
    }

		let newConf =  {
			mode: env,
      module: {
        rules: [
          babelFull,
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            exclude: { or: [/@babel(?:\/|\\{1,2})runtime/] },
            loader: require.resolve(nodeMods+'/babel-loader'),
            options: {
              babelrc: false,
              configFile: false,
              compact: false,
              cacheDirectory: true,
              cacheCompression: false,
              // Babel sourcemaps are needed for debugging into node_modules
              // code.  Without the options below, debuggers like VSCode
              // show incorrect code and set breakpoints on the wrong lines.
              sourceMaps: shouldUseSourceMap,
              inputSourceMap: shouldUseSourceMap,
            },
            resolve: {
              extensions: [".js", ".jsx"],
              fullySpecified:false
            },
            type: "javascript/auto"
          },
          //Allows use of CSS
          {
            test: /\.css$/i,
            exclude: { or: [/\.module\.css$/] },
            include: paths.appSrc,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
              },
              require.resolve(nodeMods+'/css-loader')
            ],
            resolve: { fullySpecified:false }
          },
          {
            test: /\.module\.css$/,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: env === 'production'
                ? shouldUseSourceMap
                : env === 'development',
              modules: {
                getLocalIdent: getCSSModuleLocalIdent,
              },
            }),
            resolve: { fullySpecified:false }
          },
          // Opt-in support for SASS (using .scss or .sass extensions).
          // By default we support SASS Modules with the
          // extensions .module.scss or .module.sass
          {
            test: /\.(scss|sass)$/,
            exclude: /\.module\.(scss|sass)$/,
            use: getStyleLoaders(
              {
                importLoaders: 3,
                sourceMap: env === 'production'
                  ? shouldUseSourceMap
                  : env === 'development',
              },
              require.resolve(nodeMods+"/sass-loader"),

            ),
            // Don't consider CSS imports dead code even if the
            // containing package claims to have no side effects.
            // Remove this when webpack adds a warning or an error for this.
            // See https://github.com/webpack/webpack/issues/6571
            sideEffects: true,
            resolve: { fullySpecified:false }
          },
          // Adds support for CSS Modules, but using SASS
          // using the extension .module.scss or .module.sass
          {
            test: /\.module\.(scss|sass)$/,
            use: getStyleLoaders(
              {
                importLoaders: 3,
                sourceMap: env === 'production'
                  ? shouldUseSourceMap
                  : evn === 'development',
                modules: {
                  getLocalIdent: getCSSModuleLocalIdent,
                },
              },
              require.resolve(nodeMods+"/sass-loader"),
            ),
            resolve: { fullySpecified:false }
          }
        ],
      },
			plugins: plugs.concat(conf.plugins.filter(plug => !constructors.includes(plug.constructor.name))),
      node: { global: true, __filename: true, __dirname: true },
      resolve: conf.resolve,
      externals: { ...conf.externals,'webpack':'webpack' }
		}
    // let rs = require.resolve('react-komponent/src/_webpack/node_modules/file_loader')

    let confoneOf = conf.module.rules.find(rule => rule.oneOf)

    let appendRule = (rule) => {
      if (rule.oneOf) { 
        rule.oneOf = rule.oneOf.map(rl => appendRule(rl))
        return rule
      }
      if (excludes.length) {
        if (rule.exclude) {
          let exc = rule.exclude
          if (Array.isArray(rule.exclude.or))
            rule.exclude.or = rule.exclude.or.concat(excludes)
          else rule.exclude = { or: [exc,...excludes] }
        }
        else rule.exclude = { or: excludes }
      }
      rule.resolve = rule.resolve || {} 
      rule.resolve.fullySpecified = false 
      return rule
    }
    let filterRule = (rule) => {
       return !(rule.test && newConf.module.rules.some(rl => rl.test && String(rl.test) === String(rule.test)))
    }

    newConf.module.rules = newConf.module.rules.map(rule => appendRule(rule))
    conf.module.rules = conf.module.rules.filter(filterRule).map(rule => appendRule(rule))
    if (confoneOf) confoneOf.oneOf = confoneOf.oneOf.filter(filterRule)

    if (confoneOf) {
      confoneOf.oneOf = newConf.module.rules.concat(confoneOf.oneOf) 
      newConf.module.rules = conf.module.rules
    } else {
      newConf.module.rules = newConf.module.rules.concat(conf.module.rules)
    }
    Object.keys(conf).forEach(key => {
      if (typeof newConf[key] === 'undefined') newConf[key] = conf[key]
    })
    newConf.module.rules.push(appendRule({}))
    return newConf
	},
	webpack: require('webpack'),
  paths: require(require('path').resolve(__dirname,'./node_modules')+'/react-scripts/config/paths')
}

