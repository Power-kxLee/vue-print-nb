'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _print = require('./lib/print.js');

var _print2 = _interopRequireDefault(_print);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_print2.default.install = function (Vue) {
  Vue.directive('print', _print2.default);
};

exports.default = _print2.default;
