import Vue from 'vue'
import App from './App.vue'
import router from './router';
import vuetify from './plugins/vuetify';
import 'vuetify/dist/vuetify.min.css';
import colors from 'vuetify/lib/util/colors';
import Vuex from 'vuex';
import VueBarcodeScanner from 'vue-barcode-scanner';

Vue.config.productionTip = false

let options = {
  controlSequenceKeys: ['NumLock', 'Clear']
}

Vue.use(Vuex)
Vue.use(VueBarcodeScanner, options)
Vue.use(colors)
const store = new Vuex.Store({
  state: {
    warehouseIdObjects: "",
  },
  mutations: {
  }
})

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app')
