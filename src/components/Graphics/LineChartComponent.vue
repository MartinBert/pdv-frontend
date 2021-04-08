<template>
  <div class="small">
    <BarChart :chartData="charData"  v-if="loaded"/>
    <Spinner v-if="!loaded"/>
  </div>
</template>
<script>
import BarChart from "../../plugins/chart";
import Spinner from "./Spinner";  
import GenericService from "../../services/GenericService";
export default {
  props:{
    newDatesEmitted: Number
  },
  data: () => ({
    tenant:"",
    token : localStorage.getItem("token"),
    loaded : true,
    filterParams: {
      blackReceiptFilter: "",
      sucursalId: "",
      fechaEmision: "",
      comprobanteCerrado: "",
      numeroComprobante: "",
      totalVenta: "",
      page: 1,
      size: 30,
      totalPages: 0,
    },
    ventas : [], 
    charData: {
      labels:[],
      datasets: [
        {
          label :"Productos" , 
          backgroundColor: "rgb(63, 81, 181)",
          data: [],
        },

      ],
    },
  }),

  watch:{
    newDatesEmitted(){
      this.testDate();
    }
  },

  components: {
    BarChart,
    Spinner
  },

  mounted(){
    this.tenant = this.$route.params.tenant
    this.getData()
  }, 
  
  methods:{
    getData (){
      this.loaded = false
      GenericService(this.tenant,"ventas", this.token)
      .filter(this.filterParams)
      .then(data=>{
        this.ventas = data.data.content
        this.ventas.forEach(venta => {
          this.charData.labels.push(venta.fechaEmision)
          this.charData.datasets[0].data.push(Number(venta.totalVenta))
        });
        this.loaded = true 
      })
    },
    testDate(){
      console.log(this.$store.state.eventual.eventual);
    }
  }
};
</script>
<style>
.small {
  margin: auto;
  width: 100%;
  height: 100%;
}
</style>