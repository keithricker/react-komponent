    import { toHash } from './utils'
    export const oddEven = (num) => num % 2 == 0 ? 'even' : 'odd'

    export function subscribeToStore(store,func,selector,trace) {
       
        const subscriptions = this.constructor.subscriptions
        if (subscriptions.has(func))
           return

        const thiss = this

        let stuff = selector.call(thiss,store.getState())
        if (typeof stuff === 'function')
           console.log('this error trace',stuff)
        
        console.error('subscribing to store')
        const unsub = store.subscribe(function() {

            let newSelected = toHash(selector.call(thiss,store.getState()) || {})
            // console.log('NEWSTORE FROM SUBSCRIBE',newStore)

            let oldSelected = subscriptions.get(func) || toHash({})

            // console.log("NEW STATE from Subscribe",newSelected); console.log("OLD STATE from Subscribe",oldState)
            if (newSelected !== oldSelected) {
                console.error("selections don't match")
                console.error('old:',oldSelected)
                console.error('new',newSelected)
                // Subscriber actions here == Update state!!
                subscriptions.set(func,newSelected)
            }
        })
        subscriptions.set(thiss,subscriptions.get(thiss) || [])
        subscriptions.get(thiss).push(unsub)
        return unsub
    }