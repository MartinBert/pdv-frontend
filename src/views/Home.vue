<template>
  <v-container class="home-content">
    <v-row>
      <v-col md="4" sm="12">
        <DataPicker v-on:emitDate="checkIfDateIsEmitted"/>
      </v-col>
      <v-col md="4" sm="12">
        <LineChartComponent v-if="loaded" :charData="charData" ref="contentHtml"/>
      </v-col>
      <v-col md="4" sm="12">
        <LineChartComponent v-if="loaded"  :charData="charData2" id="reporteHTML2"/>
      </v-col>
       <v-col>
        <Spinner v-if="!loaded" />
       </v-col>
       <v-btn color="success" @click="genericReports">Generar Reportes</v-btn>
    </v-row>
    <div>
     <vue-html2pdf
        :show-layout="false"
        :float-layout="true"
        :enable-download="true"
        :preview-modal="false"
        :paginate-elements-by-height="1400"
        filename="Reportes"
        :pdf-quality="1"
        :manual-pagination="false"
        pdf-format="a4"
        pdf-orientation="landscape"
        pdf-content-width="300px"
        ref="html2Pdf"
    >
        <section slot="pdf-content">
             <LineChartComponent v-if="loaded" :charData="charData" ref="contentHtml"/>
             <LineChartComponent v-if="loaded" :charData="charData2"/>
        </section>
    </vue-html2pdf>
   </div>
  </v-container>
</template>
<script >
import Spinner from "../components/Graphics/Spinner";
import LineChartComponent from "../components/Graphics/LineChartComponent";
import DataPicker from "../components/Graphics/DataPicker";
import { formatDateWithoutSlash, formatDate, getCurrentDate, formatWithSlash } from "../helpers/dateHelper";
import GenericService from "../services/GenericService";
import jsPdf from "jspdf";
import VueHtml2pdf from 'vue-html2pdf'
export default {
  data: () => ({
    jsPdf:"",
    opciones:['rojo','azul','amarillo'],
    tenant: "",
    token: localStorage.getItem("token"),
    loaded: true,
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
    Spinner,
    VueHtml2pdf
  },


  mounted() {
    this.getSucursalId()
    .then(()=>{
      this.getTenant()
      .then(()=>{
        this.GetFechas([formatWithSlash(getCurrentDate())]);
        this.getDaySaleQuantities([formatWithSlash(getCurrentDate())]);
      })
    })
    this.$toaster.success('Your toaster success message.')

  },

  methods: {

    async getSucursalId(){
      this.loaded = false;
      setTimeout(()=>{
        const sucursal = JSON.parse(localStorage.getItem('userData')).sucursal;
        if(sucursal){
          this.filterParams.sucursalId = sucursal.id;
        }
      }, 500)
    },

    getDaySaleAmonth() {
      GenericService(this.tenant, "ventas", this.token)
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

    genericReports(){
      const doc = new jsPdf('p', 'pt', 'A4');
      doc.text("Reportes", 200, 50)
      doc.save("a4.pdf")
      this.$refs.html2Pdf.generatePdf()
    },

    checkIfDateIsEmitted(fechas){
      this.getDaySaleQuantities(fechas)
      this.GetFechas(fechas)
    },

    async GetFechas(fechas) {
      let fechasRecibidas = fechas; 
      this.loaded = false;
      GenericService(this.tenant, "ventas", this.token)
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

   async getDaySaleQuantities(fechas) {
      const fechasRecibidas = fechas;
      this.loaded = false;
      GenericService(this.tenant, "ventas", this.token)
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

    async getTenant(){
      await setTimeout(()=>{
        this.tenant = this.$route.params.tenant;
      }, 500)
      if(!this.tenant) this.getTenant();
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