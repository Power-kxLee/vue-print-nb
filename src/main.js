import Vue from 'vue'
import App from './App.vue'
import Print from './index.js'
Vue.config.productionTip = false

Vue.use(Print);
new Vue({
    render: h => h(App),
}).$mount('#app')
