export default {
  namespaced: true,
  state: {
    dialogProd: false,
    products: [],
    detailSalesList: []
  },
  getters: {},
  mutations: {
    resetStates(state) {
      state.dialogProd = false;
      state.products = [];
      state.detailSalesList = []
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
    addDetailSalesList(state, object){
      state.detailSalesList = object;
    },
  },
  actions: {}
};