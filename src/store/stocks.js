export default {
    namespaced: true,
    state: {
      dialog: false,
      depositMigrationDialog: false,
      allDeposits: '',
      selectedDeposits: [],
      minimumQuantity: ''
    },
    getters: {},
    mutations: {
      resetStates(state) {
        state.dialog = false;
        state.depositMigrationDialog = false;
        state.deposits = '';
        state.selectedDeposits = [];
        state.minimumQuantity = '';
      },

      dialogMutation(state) {
        state.dialog = !state.dialog;
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
      },
    },
    actions: {}
  };