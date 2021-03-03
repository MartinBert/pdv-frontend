export default {
    namespaced: true,
    state: {
      receiptDialog: false,
      receipt: {}
    },
    mutations: {
      resetStates(state) {
        state.receiptDialog = false;
        state.receipt = {}
      },
      receiptDialogMutation(state) {
        state.receiptDialog = !state.receiptDialog;
      },
      addReceipt(state, object){
        state.receipt = object;
      }
    },
  };