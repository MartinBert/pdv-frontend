import Vue from 'vue'
import App from './App.vue'
import router from './router';
import vuetify from './plugins/vuetify';
import 'vuetify/dist/vuetify.min.css';
import colors from 'vuetify/lib/util/colors';
import Vuex from 'vuex';
import VueBarcodeScanner from 'vue-barcode-scanner';
import store from './store/index';
import { errorAlert, infoAlert, infoAlert2, questionAlert, successAlert, successAlert2 } from './helpers/alerts';
import VueNativeNotification from 'vue-native-notification'

Vue.prototype.$errorAlert = errorAlert;
Vue.prototype.$infoAlert = infoAlert;
Vue.prototype.$infoAlert2 = infoAlert2;
Vue.prototype.$questionAlert = questionAlert;
Vue.prototype.$successAlert = successAlert;
Vue.prototype.$successAlert2 = successAlert2;

Vue.config.productionTip = false


 
Vue.use(VueNativeNotification, {
  // Automatic permission request before
  // showing notification (default: true)
  requestOnNotify: true
})

Vue.use(Vuex);
Vue.use(colors);
Vue.use(VueBarcodeScanner);
new Vue({
  store,
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app')
