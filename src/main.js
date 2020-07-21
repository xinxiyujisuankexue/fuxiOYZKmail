import Vue from 'vue'
import App from './App.vue'
import router from './route/index.js'

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
