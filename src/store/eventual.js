export default {
  namespaced: true,
  state: {
    eventualDialog: false,
    eventual: null
  },
  mutations: {
    resetStates(state) {
      state.eventualDialog = false;
      state.eventual = null;
    },
    addEventual(state, any) {
      state.eventual = any;
    },
    mutateEventualDialog(state) {
      state.eventualDialog = !state.eventualDialog;
    }
  },
};