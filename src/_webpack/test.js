import { StrictMode } from "react";
import ReactDOM from "react-dom";
import React from "react";

let wind = Object.defineProperties(
  {},
  Object.getOwnPropertyDescriptors(window)
);
let appRoot = "/src/";
let pth = require("path");
let req = require;

function theRequirer(theBase, string) {
  let theModule = module;
  let modulePath = pth.resolve(pth.dirname(theModule.id));
  const theRequire = function (path, base) {
    console.log("received", path);
    console.log("referrerer", theRequire.referrer);
    if (!base) base = theRequire.base;
    let newBass;
    console.log("the base", base);
    let approot = process.cwd(),
      resolved;
    if (approot === "/") approot = "/src/";
    let alternate = base ? base : modulePath;
    if (
      path.indexOf(process.cwd()) === 0 ||
      path.indexOf(appRoot) === 0 ||
      path.indexOf(alternate) === 0
    ) {
      if (
        path.indexOf(appRoot) !== 0 &&
        path.indexOf(alternate) !== 0 &&
        String(path)[1] !== "/" &&
        process.cwd() === "/"
      )
        path = path.replace("/", appRoot);
      newBass = pth.dirname(path);
      path = pth.basename(path);
      console.log({ newBass, path });
      Array(newBass, alternate).some((str) => {
        try {
          resolved = pth.resolve(str, path);
          req.resolve(resolved);
        } catch (err) {
          console.error(err);
        }
      });
      console.log("resolved!", resolved);
    }
    if (
      !resolved &&
      path.indexOf(".") !== 0 &&
      path.indexOf("/") !== 0 &&
      !pth.basename(path).includes(".")
    ) {
      console.log("about to try", path);
      try {
        console.log("trying", path);
        if (req.resolve(path)) {
          resolved = req.resolve(path);
          newBass = pth.dirname(resolved);
          path = pth.basename(resolved);
        }
      } catch {}
    }
    if (!resolved && path.indexOf("/") === 0 && !path.indexOf(appRoot) === 0)
      path = "." + path;
    if (!resolved) {
      let bass = newBass || base || modulePath;
      resolved = pth.resolve(bass, path);
    } else resolved = resolved || path;

    if (
      resolved.indexOf(process.cwd()) === 0 &&
      !resolved.indexOf(appRoot) === 0
    ) {
      resolved = resolved.replace(process.cwd(), appRoot);
    }
    if (resolved) console.log("resolved", resolved);









    console.log("keys", Object.keys(args));
    console.log("values", Object.values(args));
    let code = require("fs").readFileSync(resolved, { encoding: "utf-8" });


    let imgFormat = Array(".jpg",".jpeg",".gif",".png").find(formt => {
      return formt === pth.parse(path).ext
    })
    if (imgFormat) {
      if (imgFormat === '.jpg') imgFormat = '.jpeg'
      imgFormat = imgFormat.slice(1,imgFormat.length)
      return `data:image/${imgFormat};base64, `+new Buffer(require("fs").readFileSync(resolved)).toString('base64')
    }

    if (Array(".scss").includes(pth.parse(path).ext)) {
      var sass = require("node-sass");
      code = sass.renderSync({
        data: code
      });
    }
    if (Array(".css", ".scss", ".sass").includes(pth.parse(path).ext)) {
      var style = document.createElement("style");
      style.innerHTML = code;
      return;
    }
  


    if (
      Array(".js", ".mjs", ".jsx", ".ts", ".tsx").includes(pth.parse(path).ext)
    ) {


      let modl = { exports: {} };
      let args = { ...global, self: window, this: window };
      Object.assign(args, {
        module: modl,
        exports: modl.exports,
        window: wind,
        React,
        ReactDOM
      });
      newBass = pth.dirname(resolved);



      const babel = require("@babel/standalone");
      const transform = babel.transform;
      code = transform(code, {
        presets: ["react", "env"],
        plugins: ["transform-runtime", "transform-async-to-generator"]
      }).code;

      args = {
        module: modl,
        exports: modl.exports,
        global,
        window,
        document,
        require: theRequirer(newBass)
      };
      args.require.base = newBass;
      args.require.referrer = resolved;
  
      new Function(...Object.keys(args), code)(...Object.values(args));
  
      let App = modl.exports;
      if (Object.keys(modl.exports).length === 1 && modl.exports.default)
        App = modl.exports.default;
      return App;
    };
    if (theBase) theRequire.base = theBase;
    return theRequire;



    }

  };
  if (theBase) theRequire.base = theBase;
  return theRequire;
}
let reqr = theRequirer("/src");
reqr.referrer = "/src/index.js";
const App = reqr(require.resolve("./App"));

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);