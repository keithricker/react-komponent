"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _default() {
  var thiss = this;
  return {
    setState: function setState(payload) {
      var comp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : thiss.componentName;
      var type = comp.toUpperCase() + '_STATE_CHANGE';
      return {
        type: type,
        payload: payload
      };
    },
    fetchData: function fetchData(endpoint) {
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'fetchedData';
      var callback = arguments.length > 2 ? arguments[2] : undefined;
      var comp = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : thiss.componentName;
      return /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch) {
          var json;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  dispatch(thiss.actions.fetchDataStart(comp));

                  if (!window.__PRELOADED_STATE__[name]) {
                    _context.next = 5;
                    break;
                  }

                  json = window.__PRELOADED_STATE__[name];
                  _context.next = 11;
                  break;

                case 5:
                  _context.next = 7;
                  return fetch(endpoint);

                case 7:
                  json = _context.sent;
                  _context.next = 10;
                  return json.json();

                case 10:
                  json = _context.sent;

                case 11:
                  setTimeout(function () {
                    var res = dispatch(thiss.actions.fetchDataComplete(json, callback, name));
                    if (typeof callback === 'function') callback(res);
                  }, 5000);

                case 12:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }();
    },
    fetchDataStart: function fetchDataStart() {
      var comp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : thiss.componentName;
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var name = comp;
      return {
        type: comp.toUpperCase() + '_FETCH_DATA_START',
        callback: callback,
        name: name
      };
    },
    fetchDataComplete: function fetchDataComplete(data) {
      var _payload;

      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'fetchedData';
      var comp = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : thiss.componentName;
      console.error('in the fetch complete');
      return {
        type: comp.toUpperCase() + '_FETCH_DATA_COMPLETE',
        payload: (_payload = {}, _defineProperty(_payload, name, data), _defineProperty(_payload, "callback", callback), _payload)
      };
    }
  };
}