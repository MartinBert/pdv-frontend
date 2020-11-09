import Vue from 'vue'
import Vuex from 'vuex'
import ventas from './ventas'
import devoluciones from './devoluciones'

Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
        ventas,
        devoluciones
    }
})