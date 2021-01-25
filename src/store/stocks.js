export default {
    namespaced: true,
    state: {
      dialog: false,
      depositMigrationDialog: false,
      stockHistoryDialog: false,
      allDeposits: '',
      selectedDeposits: [],
      minimumQuantity: '',
    },
    getters: {},
    mutations: {
      resetStates(state) {
        state.dialog = false;
        state.depositMigrationDialog = false;
        state.deposits = '';
        state.stockHistoryDialog = false;
        state.selectedDeposits = [];
        state.minimumQuantity = '';
      },

      dialogMutation(state) {
        state.dialog = !state.dialog;
      },

      stockHistoryDialogMutation(state) {
        state.stockHistoryDialog = !state.stockHistoryDialog;
      },

      depositMigrationDialogMutation(state){
        state.depositMigrationDialog = !state.depositMigrationDialog;
      },

      allDepositsMutation(state, arrayObject){
        state.deposits = arrayObject;
      },

      selectedDepositsMutation(state, arrayObject){
        state.selectedDeposits = arrayObject;
      },

      minimumQuantityMutation(state, minimunStocksAssigned){
        state.minimumQuantity = minimunStocksAssigned;
      }
    },
    actions: {}
  };