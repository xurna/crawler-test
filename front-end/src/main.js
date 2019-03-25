import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import index from './views/index'

require('css/normalize.css');
require('css/base.css');

Vue.config.productionTip = false

Vue.use(VueRouter);

const routes = [
  { path: '/', component: index },
]

const router = new VueRouter({
  routes 
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
