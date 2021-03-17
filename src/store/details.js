export default {
    namespaced: true, 
    state: {
      dialog: false,
      object: {},
      objects: [],
      title: "",
    },
    mutations: {
      resetStates(state) {
        state.dialog = false;
        state.object = {};
        state.objects = [];
        state.title = "",
        state.headers = [],
        state.values = []
      },
      addTitleToDetail(state, str){
        state.title = str;
      },
      addObjectToDetail(state, any){
        state.object = any;
      },
      addObjectsToDetail(state, any){
        state.objects = any;
      },
      mutateDialog(state){
        state.dialog = !state.dialog;
      }
    },
};