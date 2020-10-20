import Vue from 'vue'
import Vuex from 'vuex'
import ventas from './ventas'

Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
        ventas
    }
})