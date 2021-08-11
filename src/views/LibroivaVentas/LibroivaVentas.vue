<template>
  <v-container
    style="min-width: 98%;
    margin-left:1px;"
  >
    <v-card min-width="100%">
      <v-row style="justify-content: center;">
          <v-col>
              <form
                @submit.prevent="
                  salesForDate(
                    loguedUser.sucursal,
                    object.fechaDesde,
                    object.fechaHasta
                  )
                "
              >
              <v-col cols="2">
                  <div class="d-block">
                  <v-text-field
                    id="input1"
                    name="input1"
                    type="date"
                    v-model="fechaDesde"
                    label="Fecha desde"
                    @input="createDate(fechaDesde, 'fechaDesde')"
                    required
                  >
                  </v-text-field>
                  <v-text-field
                    id="input2"
                    name="input2"
                    type="date"
                    label="Fecha hasta"
                    v-model="fechaHasta"
                    @input="createDate(fechaHasta, 'fechaHasta')"
                    required
                  >
                  </v-text-field>
                  <v-btn class="primary v-btn--block" type="submit"
                   style="margin-left:400px;
                   margin-top:-100px;
                   "
                  >Imprimir libro</v-btn
                >
                  </div>
              </v-col>
          <v-col cols="3">
                <v-checkbox
                v-model="filterParamsInvoice.nombreDocumento"
                v-on:click="filterNameInvoice()"
                style="margin-left:900px;
                margin-top:-100px;
                "
                label="Factura(A)"
              ></v-checkbox>
          </v-col>
              </form>
            </v-col>
      </v-row>
      <v-row style="justify-content: center;
       margin-top:-5px;
      ">
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.nombreDocumento"
            dense
            outlined
            rounded
            label="Nombre Comprobante"
            class="text-left"
            v-on:input="filterObjects()"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.numeroCbte"
            dense
            outlined
            rounded
            label="Numero Comprobante"
            class="text-left"
            append-icon="mdi-magnify"
            v-on:input="filterObjects()"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.razonSocial"
            dense
            outlined
            rounded
            label="Razon Social"
            class="text-left"
            v-on:input="filterObjects()"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h2 style="text-align:center;">Libro Iva Ventas</h2>
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        class="elevation-6"
        :items="ventas"
        hide-default-footer
      > 
        <template v-slot:[`item.cliente.condicionIva`]="{ item }">
          <Detail
            :objects="item.cliente.condicionIva"
            @click="seeDetails(item)"
          />
        </template>
      </v-data-table>
      <Pagination
        :page="filterParams.page"
        :totalPages="filterParams.totalPages"
        :totalVisible="7"
        v-on:changePage="filterObjects"
      />
    </v-card>
  </v-container>
</template>
<script>
import ReportsService from "../../services/ReportsService";
import Detail from "../../components/Buttons/Detail";
import Pagination from "../../components/Pagination";
import {
  generateIntegerDate,
  getYearsList,
  monthsList,
} from "../../helpers/dateHelper";
import { exportPDF } from "../../helpers/exportFileHelper";
import GenericService from "../../services/GenericService";
export default {
  data: (vm) => ({
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    dateFormatted: vm.formatDate(
      new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10)
    ),
    selectedInvoice:[],
    years: getYearsList(),
    sucursales: [],
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkedInvoice:[],
    ventas: [],
    comprobantesFiscales: [],
    comprobantesComerciales: [],
    FiscalCondicion: [],
    file: null,
    sucusal: [],
    empresa: [],
    ivas: [],
    object: {
        documento: {},
        cliente: {},
        fechaDesde: null,
        fechaHasta: null,
        mes: null,
        year: null,
        year2: null,
      },
      fechaDesde: null,
      fechaHasta: null,
      fechaDesde2: null,
      fechaHasta2: null,
      fechaDesde3: null,
      fechaHasta3: null,
    filterParamsInvoice:{
      nombreDocumento:"",
    },
    filterParams: {
      blackReceiptFilter: "",
      sucursalId: "",
      fechaEmision: "",
      comprobanteCerrado: "",
      numeroComprobante: "",
      validityStatus: false,
      totalVenta: "",
      documentosComerciales: "",
      cuit: "",
      razonSocial: "",
      fechaVto: "",
      ingresosBrutos: "",
      cae: "",
      subTotal:"",
      totalIva21:"",
      totalIva27:"",
      totalIva10:"",
      porcentaje: "",
      condicionIva: "",
      condicionVenta: "",
      barCode: "",
      nombreDocumento:"",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "ventas",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    menu1: false,
    menu2: false,
    headers: [
      { text: "Fecha", value: "fechaEmision" },
      { text: "Comprobante", value: "nombreDocumento" },
      { text: "Numero Comprobantes", value: "numeroCbte" },
      { text: "Razon Social", value: "cliente.razonSocial" },
      { text: "Condicion Iva", value: "cliente.condicionIva" },
      { text: "N° Cuit", value: "cliente.cuit" },
      { text: "Neto Grabado", value: "sucursal.ingBruto" },
      { text: "Iva 27%", value: "totalIva27" },
      { text: "Iva 21%", value: "totalIva21" },
      { text: "Iva 10,5%", value: "totalIva10" },
      { text: "Iva 0 %", value: "Iva0" },
      { text: "Total Facturado", value: "totalVenta" },
    ],
  }),

  components: {
    Pagination,
    Detail,
  },

  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
  },
  watch: {
    date() {
      this.dateFormatted = this.formatDate(this.date);
    },
  },
  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterObjects();
    this.months = monthsList;
  },

  methods: {
    filterObjects(page) {
      if (page) this.filterParams.page = page;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.ventas = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });

      console.log(this.ventas);
    },
    filterNameInvoice(page) {
      if (page) this.filterParams.page = page;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.ventas = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });

      console.log(this.ventas);
    },
     filterInvoice() {
    
    },
    createDate(date, param) {
      const integerDate = generateIntegerDate(date);
      if (param === "fechaDesde") {
        this.object.fechaDesde = integerDate;
      } else {
        this.object.fechaHasta = integerDate;
      }
    },
     salesForDate(sucursal, fechaDesde, fechaHasta) {
      //if (this.notPassSucursalValidations()) return this.error('sucursal');
      let id = sucursal.id;
      ReportsService(this.tenant, this.service, this.token)
        .salesForDate(id, fechaDesde, fechaHasta)
        .then((res) => {
          exportPDF(res);
        });
    },

    salesForMonth(sucursal, year, month) {
      //if (this.notPassSucursalValidations()) return this.error('sucursal');
      let id = sucursal.id;
      ReportsService(this.tenant, this.service, this.token)
        .salesForMonth(id, year, month)
        .then((res) => {
          exportPDF(res);
        });
    },
    seeDetails(objects) {
      this.$emit("seeDetails", objects);
    },

    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
  },
};
</script>
<style>
.elevation-6 {
  margin-top: 20px;
}
</style>
