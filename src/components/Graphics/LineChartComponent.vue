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
      size: 100000,
      totalPages: 0,
    },
    
    daySaleQuantities :[], 
    ventas : [], 
    charData: {
      labels:[],
      datasets: [
        {
          label :"Ventas" , 
          backgroundColor: "rgb(63, 81, 181)",
          data: [],
        },

      ],
    },
  }),

  watch:{
    newDatesEmitted(){
      this.getDaySaleQuantities();
    }
  },

  components: {
    BarChart,
    Spinner
  },

  mounted(){
    this.tenant = this.$route.params.tenant
    this.getDaySaleQuantities()
  }, 
  
  methods:{
    getDaySaleAmonth (){
      this.loaded = false
      GenericService(this.tenant,"ventas", this.token)
      .filter(this.filterParams)
      .then(data=>{
        this.ventas = data.data.content;
        const filteredSales = this.getFilteredDates();
        this.charData.labels = []
        this.charData.datasets[0].data = []
        filteredSales.forEach(venta => {
          this.charData.labels.push(venta.fechaEmision)
          this.charData.datasets[0].data.push(Number(venta.totalVenta))
        });
        this.charData.datasets[0].data.sort(this.sortResults)
        this.loaded = true 
      })
    },

    getDaySaleQuantities(){
      this.loaded = false
      GenericService(this.tenant,"ventas", this.token)
      .filter(this.filterParams)
      .then(data => {
        this.ventas = data.data.content;
        const filteredSales = this.getFilteredDates();
        console.log(filteredSales);
        let fechas = []
        for (let index = 0; index < filteredSales.length; index++) {
          const element = filteredSales[index];
          fechas.push(element.fechaEmision);
        }
        fechas = new Set(...[fechas])
        let dateSales = {}        
        fechas.forEach(element => {
              dateSales[element] = []       
        });
        fechas.forEach(element => {
          filteredSales.forEach(el => {
            if(element == el.fechaEmision){
                dateSales[el.fechaEmision].push(el);
            }
          });
        });
        const kays = Object.keys(dateSales)
        kays.forEach(element => {
             dateSales[element] = dateSales[element].length
        });

        this.charData.labels = []
        this.charData.datasets[0].data = []

         kays.forEach(element => {
           dateSales[kays]
           this.charData.labels.push(element)
            this.charData.datasets[0].data.push(Number(dateSales[element]))
        });

        console.log(dateSales);
        this.loaded = true;
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