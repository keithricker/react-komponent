const fs = require('fs')
const path = require('path')
const { isURL,isJSON } = require('../src/components/helpers/utilsCompiled.js')
const https = require('https')
const appRoot = process.cwd()

function fetchRemote(remote,cb) {
  const download = function(url, cb) {
    https.get(url, function(response) {
      let data = '';
      response.on('data',(chunk) => data+=chunk)
      response.on('end', function() {
          cb(data)
      });
    }).on('error', function(err) { // Handle errors
      if (cb) 
          cb(new Error(err.message))
      else throw new Error(err.message)
    });
  }
  if (cb) {
    download(remote,(data) => {
      cb(data)
    })
  }
  else return new Promise(resolve => {
    download(remote,(data) => {
      resolve(data)
    })
  })
}

module.exports = fetchData

async function fetchData(customData,as="object") {
  let parsedData
  if (typeof customData === 'string' && isURL(customData)) {
    customData = await fetchRemote(customData)
    customData = await fetchData(customData,as)
  }
  if (typeof customData === 'function') {
    customData = await func()
    customData = await fetchData(customData,as)
  }
  if (typeof customData !== 'string') {
    if (as === 'object') 
        return customData
    try { 
        let cdString = JSON.stringify(customData)
        return cdString
    } catch {}

    return customData
  }
  if (isJSON(customData))
    return (as === 'object') ? JSON.parse(customData) : customData

  let format = customData.split('.').pop()
  // module as a js file must include a default export
  if (format === 'js') {
    if (isURL(arguments[0]))
        return customData
    let dataPath = path.resolve(appRoot,customData)
    let data = require(dataPath)
    let fetched = await fetchData(data,as)
    return fetched
  }
  // .json file
  if (format === 'json')
    try {
        let jsonPath = path.resolve(appRoot,customData)
        let data = fs.readFileSync(jsonPath)
        return as === 'object' ? JSON.parse(data) : JSON.stringify(data).replace(/</g, '\\u003c')
    } catch { throw new Error('error parsing json data from '+jsonPath) }
    // custom.data = JSON.stringify(data).replace(/</g, '\\u003c')
  else {
    try { 
        // see if string can be parsed as json
        let data = JSON.parse(customData)
        parsedData = (as === 'object') ? data : customData
        return parsedData
    } catch {
        console.error('preloaded data is not in a recognizable format.')
    }
  }

  return parsedData
}
