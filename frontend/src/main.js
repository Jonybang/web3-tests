import Vue from 'vue'
import App from './App.vue'
import router from './services/router'
import 'es6-promise/auto';
import './styles/main.scss';
import 'default-passive-events';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
