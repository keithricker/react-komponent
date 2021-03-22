"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribeToStore = subscribeToStore;
exports.oddEven = void 0;

var oddEven = function oddEven(num) {
  return num % 2 == 0 ? 'even' : 'odd';
};

exports.oddEven = oddEven;

function subscribeToStore(store, func, selector, trace) {
  var subscriptions = this.constructor.subscriptions;
  if (subscriptions.has(func)) return;
  var thiss = this;
  var stuff = selector.call(thiss, store.getState());
  if (typeof stuff === 'function') console.log('this error trace', stuff);
  console.error('subscribing to store');
  var unsub = store.subscribe(function () {
    var newSelected = selector.call(thiss, store.getState()) || {}; // console.log('NEWSTORE FROM SUBSCRIBE',newStore)

    var oldSelected = subscriptions.get(func) || {}; // console.log("NEW STATE from Subscribe",newSelected); console.log("OLD STATE from Subscribe",oldState)

    if (newSelected !== oldSelected) {
      console.error("selections don't match");
      console.error('old:', oldSelected);
      console.error('new', newSelected); // Subscriber actions here == Update state!!

      subscriptions.set(func, newSelected);
    }
  });
  subscriptions.set(thiss, subscriptions.get(thiss) || []);
  subscriptions.get(thiss).push(unsub);
  return unsub;
}