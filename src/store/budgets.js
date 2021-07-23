export default {
    namespaced: true,
    state: {
      dialog: false,
      budget: null
    },
    mutations: {
      resetStates(state) {
        state.dialog = false;
        state.budget = {}
      },
      budgetDialogMutation(state) {
        state.dialog = !state.dialog;
      },
      addBudget(state, object) {
        console.log(object);
        state.budget = object;
      }
    },
  };