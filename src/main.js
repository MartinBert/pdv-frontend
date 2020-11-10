import Vue from 'vue'
import App from './App.vue'
import router from './router';
import vuetify from './plugins/vuetify';
import 'vuetify/dist/vuetify.min.css';
import colors from 'vuetify/lib/util/colors';
import Vuex from 'vuex';
import VueBarcodeScanner from 'vue-barcode-scanner';
import store from  './store/index';

Vue.config.productionTip = false

let options = {
  controlSequenceKeys: ['NumLock', 'Clear']
}

Vue.use(Vuex);
Vue.use(colors);
Vue.use(VueBarcodeScanner, options);
new Vue({
  store,
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app')
