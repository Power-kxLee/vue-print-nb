'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _class = function () {
  function _class(option) {
    (0, _classCallCheck3.default)(this, _class);

    this.standards = {
      strict: 'strict',
      loose: 'loose',
      html5: 'html5'
    };
    this.counter = 0;
    this.settings = {
      standard: this.standards.html5,
      extraHead: '',
      extraCss: '',
      popTitle: '',
      endCallback: null,
      el: '' };
    (0, _assign2.default)(this.settings, option);
    this.init();
  }

  (0, _createClass3.default)(_class, [{
    key: 'init',
    value: function init() {
      this.counter++;
      this.settings.id = 'printArea_' + this.counter;
      var box = document.getElementById(this.settings.id);
      if (box) {
        box.parentNode.removeChild(box);
      }
      var PrintAreaWindow = this.getPrintWindow();
      this.write(PrintAreaWindow.doc);
      this.print(PrintAreaWindow);
      this.settings.endCallback();
    }
  }, {
    key: 'print',
    value: function print(PAWindow) {
      var paWindow = PAWindow.win;
      paWindow.onload = function () {
        paWindow.focus();
        paWindow.print();
      };
    }
  }, {
    key: 'write',
    value: function write(PADocument, $ele) {
      PADocument.open();
      PADocument.write(this.docType() + '<html>' + this.getHead() + this.getBody() + '</html>');
      PADocument.close();
    }
  }, {
    key: 'docType',
    value: function docType() {
      if (this.settings.standard === this.standards.html5) {
        return '<!DOCTYPE html>';
      }
      var transitional = this.settings.standard === this.standards.loose ? ' Transitional' : '';
      var dtd = this.settings.standard === this.standards.loose ? 'loose' : 'strict';

      return '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01' + transitional + '//EN" "http://www.w3.org/TR/html4/' + dtd + '.dtd">';
    }
  }, {
    key: 'getHead',
    value: function getHead() {
      var extraHead = '';
      var links = '';
      var style = '';
      if (this.settings.extraHead) {
        this.settings.extraHead.replace(/([^,]+)/g, function (m) {
          extraHead += m;
        });
      }
      document.querySelectorAll('link').forEach(function (item, i) {
        if (item.href.indexOf('.css') >= 0) {
          links += '<link type="text/css" rel="stylesheet" href="' + item.href + '" >';
        }
      });
      for (var i = 0; i < document.styleSheets.length; i++) {
        if (document.styleSheets[i].cssRules || document.styleSheets[i].rules) {
          var rules = document.styleSheets[i].cssRules || document.styleSheets[i].rules;
          for (var b = 0; b < rules.length; b++) {
            style += rules[b].cssText;
          }
        }
      }

      if (this.settings.extraCss) {
        this.settings.extraCss.replace(/([^,\s]+)/g, function (m) {
          links += '<link type="text/css" rel="stylesheet" href="' + m + '">';
        });
      }

      return '<head><title>' + this.settings.popTitle + '</title>' + extraHead + links + '<style type="text/css">' + style + '</style></head>';
    }
  }, {
    key: 'getBody',
    value: function getBody() {
      var ele = this.getFormData(document.querySelector(this.settings.el));
      var htm = ele.outerHTML;
      console.log('htm', htm);
      return '<body>' + htm + '</body>';
    }
  }, {
    key: 'getFormData',
    value: function getFormData(ele) {
      var copy = ele.cloneNode(true);
      var copiedInputs = copy.querySelectorAll('input,select,textarea');

      copiedInputs.forEach(function (item, i) {
        var typeInput = item.getAttribute('type');
        var copiedInput = copiedInputs[i];
        if (typeInput === undefined) {
          typeInput = item.tagName === 'SELECT' ? 'select' : item.tagName === 'TEXTAREA' ? 'textarea' : '';
        }
        if (typeInput === 'radio' || typeInput === 'checkbox') {

          copiedInput.setAttribute('checked', item.checked);
        } else if (typeInput === 'text' || typeInput === '') {
          copiedInput.value = item.value;
          copiedInput.setAttribute('value', item.value);
        } else if (typeInput === 'select') {
          copiedInput.querySelectorAll('option').forEach(function (op, b) {
            if (op.selected) {
              op.setAttribute('selected', true);
            };
          });
        } else if (typeInput === 'textarea') {
          copiedInput.value = item.value;
          copiedInput.setAttribute('value', item.value);
        }
      });
      return copy;
    }
  }, {
    key: 'getPrintWindow',
    value: function getPrintWindow() {
      var f = this.Iframe();
      return {
        win: f.contentWindow || f,
        doc: f.doc
      };
    }
  }, {
    key: 'Iframe',
    value: function Iframe() {
      var frameId = this.settings.id;
      var iframe = void 0;

      try {
        iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        iframe.style.border = '0px';
        iframe.style.position = 'absolute';
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.style.right = '0px';
        iframe.style.top = '0px';
        iframe.setAttribute('id', frameId);
        iframe.setAttribute('src', new Date().getTime());
        iframe.doc = null;
        iframe.doc = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow ? iframe.contentWindow.document : iframe.document;
      } catch (e) {
        throw new Error(e + '. iframes may not be supported in this browser.');
      }

      if (iframe.doc == null) {
        throw new Error('Cannot find document.');
      }

      return iframe;
    }
  }]);
  return _class;
}();

exports.default = _class;
;