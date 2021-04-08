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
  data: () => ({
    tenant:"",
    token : localStorage.getItem("token"),
    loaded : true,
    filterParams: {
      sucursalId: "",
      productoName: "",
      productoCodigo: "",
      productoCodigoBarras: "",
      productoMarcaName: "",
      productoPrimerAtributoName: "",
      productoSegundoAtributoName: "",
      productoTercerAtributoName: "",
      productoEstado: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    productos : [], 
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
      GenericService(this.tenant,"productos", this.token)
      .filter(this.filterParams)
      .then(data=>{
        this.productos = data.data.content
        this.productos.forEach(producto => {
          this.charData.labels.push(producto.nombre)
          this.charData.datasets[0].data.push(producto.precioTotal)
        });
        this.loaded = true 
      })
    }
  }
};
</script>
<style>
.small {
  max-width: 400px;
  max-height: 300px;
}
</style>