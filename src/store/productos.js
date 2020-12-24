export default {
  namespaced: true,
  state: {
    dialogProd: false,
    products: [],
    detailList: [],
  },
  getters: {},
  mutations: {
    resetStates(state) {
      state.dialogProd = false;
      state.products = [];
      state.detailList = []
    },
    dialogProductosMutation(state) {
      state.dialogProd = !state.dialogProd;
    },
    addProductsToList(state, object) {
      state.products.push(object);
    },
    removeProductsToList(state, id) {
      const productos = state.products.filter(el => el.id !== id);
      state.products = productos;
    },
    addDetailList(state, object){
      state.detailList = object;
    },
  },
  actions: {}
};