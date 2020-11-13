export default {
    namespaced: true,
    state: {
      eventual: null
    },
    getters: {},
    mutations: {
      resetStates(state) {
        state.eventual = null;
      },
      addEventual(state, any){
        state.eventual = any;
      }
    },
    actions: {}
  };