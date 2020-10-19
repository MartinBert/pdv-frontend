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
  state:{
    dialogProd: false,
    products: []
  },
  mutations: {
    dialogProductosMutation(state){
      state.dialogProd = !state.dialogProd;
    },
    addProductsToSale(state, object){
      state.products.push(object);
      console.log(state.products)
    },
    removeProductsToSale(state, id){
      const productos = state.products.filter(el => el.id !== id);
      state.products = productos;
      console.log(state.products)
    },
    resetStates(state){
      state.dialogProd = false;
      state.products = [];
    } 
  }
})

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app')
