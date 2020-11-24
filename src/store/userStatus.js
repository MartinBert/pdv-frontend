export default {
    namespaced: true,
    
    state: {
      userPerfil: null,
    },

    getters: {},

    mutations: {

      resetStates(state) {
        state.userPerfil = null;
      },

      mutateUserPerfil(state, id){
        state.userPerfil = id;
      }

    },

    actions: {}
};