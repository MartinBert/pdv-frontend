<template>
  <div class="small">
    <BarChart :chartData="charData"  v-if="loaded"/>
    <Spinner v-if="!loaded"/>
  </div>
</template>
<script>
import {formatDateWithoutSlash, formatDate} from "../../helpers/dateHelper"
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
      this.getData();
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
        this.ventas = data.data.content;
        const filteredSales = this.getFilteredDates();
        console.log(filteredSales);
        filteredSales.forEach(venta => {
          this.charData.labels.push(venta.fechaEmision)
          this.charData.datasets[0].data.push(Number(venta.totalVenta))
        });
        this.charData.datasets[0].data.sort(this.sortResults)
        this.loaded = true 
      })
    },
    sortResults (a,b){
      if(a > b) return 1;
      return - 1;
    },

    getFilteredDates(){
      let fechas = this.$store.state.eventual.eventual.map(el => {
        return formatDate(formatDateWithoutSlash(el))
      }) 
      let selectVentas = [];
      this.ventas.forEach(venta => {
        fechas.forEach(fecha => {
          if(venta.fechaEmision == fecha){
            selectVentas.push(venta)
          }
        })
      });
      return selectVentas;
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