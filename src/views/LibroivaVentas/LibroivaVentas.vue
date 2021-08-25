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
                      loguedUser.sucursal,
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
                label="Factura(A)"
              ></v-checkbox>
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
        :items="ventas"
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
import ReportsService from "../../services/ReportsService";
//import Detail from "../../components/Buttons/Detail";
import Pagination from "../../components/Pagination";
import {
  generateIntegerDate,
  getYearsList,
  monthsList,
} from "../../helpers/dateHelper";
import { exportExcelLibro } from "../../helpers/exportFileHelper";
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
    selectedInvoice: [],
    years: getYearsList(),
    sucursales: [],
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkedInvoice: [],
    ventas: [],
    comprobantesFiscales: [],
    comprobantesComerciales: [],
    FiscalCondicion: [],
    file: null,
    sucusal: [],
    filterInvoice:[],
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
    filterParams: {
      blackReceiptFilter: "",
      sucursalId: "",
      codigoDocumento: "",
      fechaEmision: "",
      comprobanteCerrado: "",
      numeroComprobante: "",
      validityStatus: false,
      totalVenta: "",
      documentosComerciales: "",
      cuit: "",
      numeroCbte: "",
      razonSocial: "",
      fechaVto: "",
      ingresosBrutos: "",
      cae: "",
      letra: "",
      subTotal: "",
      totalIva21: "",
      totalIva27: "",
      totalIva10: "",
      porcentaje: "",
      condicionIva: "",
      condicionVenta: "",
      barCode: "",
      nombreDocumento:"",
      documentoComercialName: "",
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
      { text: "Numero Comprobantes", value: "barCode" },
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
    //Detail,
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
      GenericService(this.tenant, "ventas", this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.ventas = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
      console.log(this.ventas);
    },

    createDate(date, param) {
      const integerDate = generateIntegerDate(date);
      if (param === "fechaDesde") {
        this.object.fechaDesde = integerDate;
      } else {
        this.object.fechaHasta = integerDate;
      }
    },
    salesForDate1(sucursal, fechaDesde, fechaHasta) {
      if (this.notPassSucursalValidations()) return this.error("sucursal");
      let id = sucursal.id;

      ReportsService(this.tenant, this.service, this.token)
        .salesForDate(id, fechaDesde, fechaHasta)
        .then((res) => {
          console.log(res);
        });
    },
async exportGeneralExcel() {
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
      const data = await this.setDataToExcel();
      exportExcelLibro(headers, data);
      this.loaded = true;
      console.log(data);
    },

     async setDataToExcel() {
      let dataForExcel = [];
      let filters = {
        fechaEmision: "",
        nombreDocumento: "",
        barCode: "",
        razonSocial: "",
        condicionIva: "",
        cuit: "",
        ingBrutos: "",
        totalIva27: "",
        totalIva21:"",
        totalIva10:"",
        totalIva0:"",
        totalVenta:"",
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

    formatForExcel(product) {
      if (product.marca) {
        product.marca = product.marca.nombre;
      }
      if (product.rubro) {
        product.rubro = product.rubro.nombre;
      }
      if (product.atributos) {
        product.atributos = product.atributos.reduce((acc, el) => {
          if (el.valor) {
            acc = acc + el.valor + ",";
            return acc;
          } else {
            acc = acc + el.valorNumerico + ",";
            return acc;
          }
        }, "");
      }
      if (product.distribuidores) {
        product.distribuidores = product.distribuidores.reduce(
          (acc, el) => acc + el.razonSocial + ",",
          ""
        );
      }
      if (product.propiedades) {
        product.propiedades = product.propiedades.reduce(
          (acc, el) => acc + el.nombre + ",",
          ""
        );
      }
      return product;
    },

    notPassSucursalValidations() {
      if (this.loguedUser.sucursal) return false;
      return true;
    },

    error(type) {
      let error = "";
      switch (type) {
        case "products":
          error = "Debe seleccionar al menos un producto para este reporte";
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
