export default {
  namespaced: true,
  state: {
    dialogProd: false,
    products: [],
    mediosPago: [],
    planesPago:[]
  },
  getters: {},
  mutations: {
    resetStates(state) {
      state.dialogProd = false;
      state.products = [];
      state.mediosPago = [],
      state.planesPago = []
    },
    dialogProductosMutation(state) {
      state.dialogProd = !state.dialogProd;
    },
    addProductsToSale(state, object) {
      state.products.push(object);
    },
    removeProductsToSale(state, id) {
      const productos = state.products.filter(el => el.id !== id);
      state.products = productos;
    },
    addPaymentsPlans(state, plans){
      state.planesPago = plans;
    },
    addPaymentsMethods(state, methods){
      state.mediosPago = methods;
    }
  },
  actions: {}
};