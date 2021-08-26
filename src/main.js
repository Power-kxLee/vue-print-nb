/*
 * @Author: lee
 * @Date: 2021-05-10 11:45:50
 * @LastEditors: lee
 * @LastEditTime: 2021-05-12 14:18:39
 * @Description: file content
 */
import Vue from 'vue'
import App from './App.vue'
import Print from '../print'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false
Vue.use(Print)
Vue.use(ElementUI);
Vue.use(VueRouter)
new Vue({
  render: h => h(App),
}).$mount('#app')
