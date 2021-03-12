<template>
  <div class="small">
    <BarChart :chartData="datacollection"/>
  </div>
</template>

<script>
  import BarChart from '../plugins/chart';
import GenericService from '../services/GenericService';

  export default {
    components: {
      BarChart
    },
    data:() => ({
      datacollection: null,
      ventas: [],
      tenant: "",
      service: "ventas",
      fechaFinalIndex: "",
      token: localStorage.getItem("token"),
      filterParams: {
      blackReceiptFilter: "",
      sucursalId: "",
      fechaEmision: "",
      comprobanteCerrado: "",
      numeroComprobante: "",
      totalVenta: "",
      page: 1,
      size: 100000
    }
    }),

    mounted () {
      this.tenant = this.$route.params.tenant;
      this.getData()
      .then(()=>{
        this.fillData();
      })
    },

    methods: {
      async getData(){
        await GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then(data => {
          this.ventas = data.data.content;
          this.fechaFinalIndex = this.ventas.length;
        })
      },
      fillData () {
        this.datacollection = {
          labels: [this.ventas[0].fechaEmision, this.ventas[this.fechaFinalIndex - 1].fechaEmision],
          datasets: [
            {
              label: 'Ventas',
              backgroundColor: '#364ab8',
              data: [20, 40]
            }
          ]
        }
      },
    }
  }
</script>

<style>
  .small {
    max-width: 600px;
    margin:  150px auto;
  }
</style>