import Print from './lib/print.js';
Print.install = function(Vue) {
  Vue.directive('print', Print);
};

export default Print;