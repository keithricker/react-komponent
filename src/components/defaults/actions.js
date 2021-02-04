export default function() {
    const thiss = this
    return { 
        setState: function(payload,comp=thiss.componentName) {
            const type = comp.toUpperCase()+'_STATE_CHANGE'
            return {
                type: type,
                payload
            }
        },
        fetchData: function(endpoint,name='fetchedData',callback,comp=thiss.componentName) {
            return async function(dispatch) {
                dispatch(thiss.actions.fetchDataStart(comp))
                let json
                if (window.__PRELOADED_STATE__[name]) {
                    json = window.__PRELOADED_STATE__[name]
                }  else { 
                    json = await fetch(endpoint)
                    json = await json.json()
                }
                setTimeout(
                    () => {
                        let res = dispatch(thiss.actions.fetchDataComplete(json,callback,name))
                        if (typeof callback === 'function') callback(res);
                    },5000
                )
            }
        },
        fetchDataStart: function(comp=thiss.componentName,callback=null) {  
           let name = comp
           return { type: comp.toUpperCase()+'_FETCH_DATA_START', callback, name }
        },
        fetchDataComplete: function(data, callback=null, name='fetchedData', comp=thiss.componentName) {
           console.error('in the fetch complete')
           return { type: comp.toUpperCase()+'_FETCH_DATA_COMPLETE', payload: { [name]: data, callback } }
        }
    }
}