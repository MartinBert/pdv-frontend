<template>
  <v-container>
    <TabBar :tabs="tabs" :activeTab="setActiveTabComponent"/>
  </v-container>
</template>
<script>
import TabBar from '../../components/Graphics/TabBar';
export default {
  data: () => ({
    tabs: [
      {id: 1, route: '', title: 'Comprobantes Emitidos'},
      {id: 2, route: '', title: 'Presupuesto'},
      {id: 3, route: '', title: 'Cierre Z'}
    ],
    activeTab: 2,
    loaded: false,
    tenant: "",
    token: localStorage.getItem("token"),
    loguedUser: JSON.parse(localStorage.getItem("userData"))
  }),

  components:{
    TabBar
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.tabs[0].route = `/${this.tenant}/ventas/list`
    this.tabs[1].route = `/${this.tenant}/ventas/presupuesto`
    this.tabs[2].route = `/${this.tenant}/ventas/cierrez`
  },

  methods:{
    setActiveTabComponent(id){
      this.activeTab = id;
    }
  }
}
</script>

