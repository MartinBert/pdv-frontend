export default {
    namespaced: true,
    state: {
      dialogDevoluciones: false,
      products: [],
    },
    getters: {},
    mutations: {
      resetStates(state) {
        state.dialogDevoluciones = false;
        state.products = [];
      },
      dialogDevolucionesMutation(state) {
        state.dialogDevoluciones = !state.dialogDevoluciones;
      },
    },
    actions: {}
  };