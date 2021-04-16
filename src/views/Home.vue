<template>
  <v-container class="home-content">
    <v-row>
      <v-col md="6" sm="12">
        <DataPicker v-on:emitDate="checkIfDateIsEmitted"/>
      </v-col>
      <v-col md="3" sm="12">
        <LineChartComponent :charData="charData"/>
      </v-col>
      <v-col md="3" sm="12">
        <LineChartComponent :charData="charData2"/>
      </v-col>
       <v-col>
        <Spinner v-if="!loaded" />
       </v-col>
    </v-row>
  </v-container>
</template>
<script >
import Spinner from "../components/Graphics/Spinner";
import LineChartComponent from "../components/Graphics/LineChartComponent";
import DataPicker from "../components/Graphics/DataPicker";
import { formatDateWithoutSlash, formatDate, getCurrentDate, formatWithSlash } from "../helpers/dateHelper";
import GenericService from "../services/GenericService";
export default {
  data: () => ({
    tenant: "",
    token: localStorage.getItem("token"),
    loaded: true,
    filterParams: {
      blackReceiptFilter: 999999999,
      sucursalId: "",
      fechaEmision: "",
      comprobanteCerrado: "",
      numeroComprobante: "",
      totalVenta: "",
      page: 1,
      size: 100000,
      totalPages: 0,
    },
    detected:0,

    daySaleQuantities: [],
    ventas: [],
    charData: {
      labels: [],
      datasets: [
        {
          label: "Ventas Por Dia",
          backgroundColor: "rgb(63, 81, 181)",
          data: [],
        },
      ],
    },
      charData2: {
      labels: [],
      datasets: [
        {
          label: "Total",
          backgroundColor: "rgb(63, 81, 181)",
          data: [],
        },
      ],
    },
  
  }),

  components: {
    LineChartComponent,
    DataPicker,
    Spinner
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.GetFechas([formatWithSlash(getCurrentDate())]);
    this.getDaySaleQuantities([formatWithSlash(getCurrentDate())]);
  },

  methods: {
    getDaySaleAmonth() {
      this.loaded = false;
      GenericService('pdv', "ventas", this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.ventas = data.data.content;
          const filteredSales = this.getFilteredDates();
          this.charData.labels = [];
          this.charData.datasets[0].data = [];
          filteredSales.forEach((venta) => {
            this.charData.labels.push(venta.fechaEmision);
            this.charData.datasets[0].data.push(Number(venta.totalVenta));
          });
          this.charData.datasets[0].data.sort(this.sortResults);
          this.loaded = true;
        });
    },

    checkIfDateIsEmitted(fechas){
      this.getDaySaleQuantities(fechas)
      this.GetFechas(fechas)
    },

    GetFechas(fechas) {
      let fechasRecibidas = fechas; 
      this.loaded = false;
      GenericService('pdv', "ventas", this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.ventas = data.data.content;
          const filteredSales = this.getFilteredDates(fechasRecibidas);

          let fechas = [];
          for (let index = 0; index < filteredSales.length; index++) {
            const element = filteredSales[index];
            fechas.push(element.fechaEmision);
          }
          fechas = new Set(...[fechas]);
          let dateSales = {};
          fechas.forEach((element) => {
            dateSales[element] = [];
          });
          fechas.forEach((element) => {
            filteredSales.forEach((el) => {
              if (element == el.fechaEmision) {
                dateSales[el.fechaEmision].push(el);
              }
            });
          });
          const kays = Object.keys(dateSales);
          kays.forEach((element) => {
            const ventasDeLlavedeObj = dateSales[element];
            const total = ventasDeLlavedeObj.reduce((acc,el)=> acc + el.totalVenta, 0)
            dateSales[element] = total
          });

          this.charData2.labels = [];
          this.charData2.datasets[0].data = [];

          kays.forEach((element) => {
            dateSales[kays];
            this.charData2.labels.push(element);
            this.charData2.datasets[0].data.push(Number(dateSales[element]));
          });

          this.loaded = true;
        });
    },

    getDaySaleQuantities(fechas) {
      const fechasRecibidas = fechas;
      this.loaded = false;
      GenericService('pdv', "ventas", this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.ventas = data.data.content;
          const filteredSales = this.getFilteredDates(fechasRecibidas);
 
          let fechas = [];
          for (let index = 0; index < filteredSales.length; index++) {
            const element = filteredSales[index];
            fechas.push(element.fechaEmision);
          }
          fechas = new Set(...[fechas]);
          let dateSales = {};
          fechas.forEach((element) => {
            dateSales[element] = [];
          });
          fechas.forEach((element) => {
            filteredSales.forEach((el) => {
              if (element == el.fechaEmision) {
                dateSales[el.fechaEmision].push(el);
              }
            });
          });
          const kays = Object.keys(dateSales);
          kays.forEach((element) => {
            dateSales[element] = dateSales[element].length;
          });

          this.charData.labels = [];
          this.charData.datasets[0].data = [];

          kays.forEach((element) => {
            dateSales[kays];
            this.charData.labels.push(element);
            this.charData.datasets[0].data.push(Number(dateSales[element]));
          });

          this.$store.commit('eventual/addEventual', this.charData);

          this.detected++ 

          this.loaded = true;
        });
    },

    sortResults(a, b) {
      if (a > b) return 1;
      return -1;
    },

    getFilteredDates(fechasRecibidas) {
      let fechas = fechasRecibidas.map((el) => {
        return formatDate(formatDateWithoutSlash(el));
      });
      
      let selectVentas = [];
      this.ventas.forEach((venta) => {
        fechas.forEach((fecha) => {
          if (venta.fechaEmision == fecha) {
            selectVentas.push(venta);
          }
        });
      });
      return selectVentas;
    },
  },
};
</script>
<style>
 .v-text-field{
  width: 300px;
  margin-bottom: .5em
}
</style>