<template>
  <v-container
    style="min-width: 98%;
    margin-left:1px;"
  >
    <v-card min-width="100%">
      <v-row style="justify-content: center;">
        <v-col>
          <form>
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
                <v-btn
                  class="primary v-btn--block"
                  @click="
                    salesForDate1(
                      object.fechaDesde,
                      object.fechaHasta
                    )
                  "
                >
                  Buscar Comprobantes
                </v-btn>
                <v-btn
                  class="primary v-btn--block"
                  type="button"
                  style="margin-left:400px;
                   margin-top:-100px;
                   "
                  @click="exportGeneralExcel()"
                  >Imprimir libro</v-btn
                >
              </div>
            </v-col>
            <v-col cols="3">
              <v-checkbox
                v-on:change="filterObjects()"
                style="margin-left:900px;
                margin-top:-100px;
                "
                label="Facturas(A)"
                v-model="filterParams.facturaA"
              >
              </v-checkbox>
            </v-col>
            <v-col cols="3">
              <v-checkbox
                v-on:change="filterObjects()"
                style="margin-left:900px;
                margin-top:-100px;
                "
                label="Facturas(B)"
                v-model="filterParams.facturaB"
              >
              </v-checkbox>
            </v-col>
            <v-col cols="3">
              <v-checkbox
                v-on:change="filterObjects()"
                style="margin-left:900px;
                margin-top:-100px;
                "
                label="Facturas(C)"
                v-model="filterParams.facturaC"
              >
              </v-checkbox>
            </v-col>
          </form>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h2 style="text-align:center;">Libro Iva Ventas</h2>
        </v-col>
      </v-row>
      <v-row
        style="justify-content: center;
       margin-top:-5px;
      "
      >
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.fechaEmision"
            dense
            outlined
            rounded
            label="Busqueda por Fecha Emision"
            class="text-left"
            v-on:input="filterObjects()"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.numeroComprobante"
            dense
            outlined
            rounded
            type="number"
            label="Busqueda por numero de comprobante"
            class="text-left"
            append-icon="mdi-magnify"
            v-on:input="filterObjects()"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.blackReceiptFilter"
            dense
            outlined
            rounded
            label="Busqueda especial"
            class="text-left"
            v-on:input="filterObjects()"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        class="elevation-6"
        :items="invoices"
        hide-default-footer
      >
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
import ComprobantesService from "../../services/ComprobantesService";
import Pagination from "../../components/Pagination";
import {
  generateIntegerDate,
  monthsList,
} from "../../helpers/dateHelper";
import { exportExcelLibro } from "../../helpers/exportFileHelper";
import GenericService from "../../services/GenericService";
export default {
  data: () => ({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    ventas: [],
    file: null,
    obj: {},
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
    filterParams: {
      blackReceiptFilter: "",
      sucursalId: "",
      barCode:"",
      numeroCbte:"",
      fechaEmision: "",
      comprobanteCerrado: "",
      numeroComprobante: "",
      totalVenta: "",
      facturaA: false,
      facturaB: false,
      facturaC: false,
      page: 1,
      size: 10,
      totalPages:0,
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
      { text: "Condicion Iva", value: "cliente.condicionIva.nombre" },
      { text: "N° Cuit", value: "cliente.cuit" },
      { text: "Neto Grabado", value: "sucursal.ingBruto" },
      { text: "Iva 27%", value: "totalIva27" },
      { text: "Iva 21%", value: "totalIva21" },
      { text: "Iva 10,5%", value: "totalIva10" },
      { text: "Total Facturado", value: "totalVenta" },
    ],
  }),

  components: {
    Pagination,
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
          if (this.filterParams.totalPages < this.filterParams.page) {
            this.filterParams.page = 1;
          }
          this.loaded = true;
        });
    },

    createDate(date, param) {
      const integerDate = generateIntegerDate(date);
      if (param === "fechaDesde") {
        this.object.fechaDesde = integerDate;
      } else {
        this.object.fechaHasta = integerDate;
      }
    },

    salesForDate1(fechaDesde, fechaHasta) {
      if (this.notPassSucursalValidations()) return this.error("sucursal");
      if (this.notPassDateValidations()) return this.error("fechas");
      let sucursalId = this.loguedUser.sucursal.id;
      const filterParams = {
        sucursalId,
        fechaDesde,
        fechaHasta
      }
      console.log(filterParams);
      ComprobantesService(this.tenant, "comprobantesFiscales", this.token)
      .getInvoicesForDateRange(filterParams)
      .then(data => {
        const invoices = data.data;
        this.exportGeneralExcel(invoices)
      })
    },

    async exportGeneralExcel(invoices) {
      this.loaded = false;
      const headers = [
        "FECHA",
        "COMPROBANTE",
        "NUMERO COMPROBANTE",
        "RAZON SOCIAL",
        "CONDICION IVA",
        "CUIT",
        "NETO GRABADO",
        "IVA 27%",
        "IVA 21%",
        "IVA 10%",
        "TOTAL FACTURADO",
      ];
      if(invoices){
        let formatedInvoicesParam = [];
        invoices.forEach(el => {
          el = this.formatForExcel(el);
          formatedInvoicesParam.push(el);
        })
        console.log(formatedInvoicesParam);
        exportExcelLibro(headers, formatedInvoicesParam);
      }else{
        const data = await this.setDataToExcel();
        exportExcelLibro(headers, data);
      }
      this.loaded = true;
    },

    async setDataToExcel() {
      let dataForExcel = [];
      let filters = {
        fechaEmision: "",
        nombreDocumento: "",
        numeroCbte: "",
        razonSocial: "",
        condicionIva: "",
        cuit: "",
        ingBrutos: "",
        totalIva27: "",
        totalIva21: "",
        totalIva10: "",
        totalIva0: "",
        totalVenta: "",
        page: 1,
        size: 100000,
        totalPages: 0,
      };
      await GenericService(this.tenant, this.service, this.token)
        .filter(filters)
        .then((data) => {
          let ventas = data.data.content;
          ventas.forEach((el) => {
            el = this.formatForExcel(el);
            dataForExcel.push(el);
          });
        });
      return dataForExcel;
    },

    formatForExcel(invoices) {
      return invoices;
    },

    notPassSucursalValidations() {
      if (this.loguedUser.sucursal) return false;
      return true;
    },

    notPassDateValidations(){
      if(this.fechaDesde && this.fechaHasta) return false;
      return true;
    },

    error(type) {
      let error = "";
      switch (type) {
        case "products":
          error = "Debe seleccionar al menos un producto para este reporte";
          break;
        case "fechas":
          error = "Debe seleccionar las dos fechas para obtener el reporte";
          break;
        default:
          error = "Debe seleccionar una sucursal para realizar el reporte";
          break;
      }
      this.$errorAlert(error);
      return;
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
