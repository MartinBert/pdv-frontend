<template>
  <v-container>
    <TabBar :tabs="tabs" :activeTab="activeTab"/>
  </v-container>
</template>
<script>
import TabBar from '../../components/Graphics/TabBar';
export default {
  data: () => ({
    tabs: [
      {id: 1, title: 'Comprobantes Emitidos', route:'/ventas/list'},
      {id: 2, title: 'Presupuesto', route:'/ventas/presupuesto'},
      {id: 3, title: 'Cierre Z', route:'/ventas/cierrez' }
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
  },

  methods:{
    setActiveTabComponent(id){
      this.activeTab = id;
    }
  }
}
</script>

