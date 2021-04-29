"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

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
        var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(dispatch) {
          var json;
          return _regenerator["default"].wrap(function _callee$(_context) {
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
        payload: (_payload = {}, (0, _defineProperty2["default"])(_payload, name, data), (0, _defineProperty2["default"])(_payload, "callback", callback), _payload)
      };
    }
  };
}