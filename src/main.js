import Vue from 'vue'
import App from './App.vue'
import Print from '../print'
// import Print from '../lib/print.umd.min.js'
Vue.config.productionTip = false
Vue.use(Print)
new Vue({
  render: h => h(App),
}).$mount('#app')
