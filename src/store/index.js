import Vue from 'vue'
import Vuex from 'vuex'
import productos from './productos'
import receipt from './receipt'
import eventual from './eventual'
import stocks from './stocks'
import details from './details'

Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
        productos,
        receipt,
        eventual,
        stocks,
        details
    }
})