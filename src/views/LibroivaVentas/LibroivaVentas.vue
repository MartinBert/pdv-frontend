<template>
  <v-container
    style="min-width: 98%;
    margin-left:1px;"
  >
    <v-card min-width="100%">
      <form style="display:flex;flex-direction:row;align-items:center;justify-content: space-between;
                  width:100% ;padding:10px">

        <div style="display:flex;flex-direction:column;width:32%; border: 1px solid rgba(24, 23, 23,0.3)
                    ;align-items:center;padding:10px ;border-radius: 15px;height:220px;
                      box-shadow: 0px 0px 5px rgb(139, 136, 136);background-color: #f5f5f5;">
          <h2 style="padding:5px; border-bottom:1px dashed rgba(24, 23, 23,0.3);width:100%;text-align:center">Seleccione las fechas:</h2>
          <div style="display:flex;flex-direction:column;align-items:center;padding:10px">
            <v-text-field
                  style="width:70%"
                  id="input1"
                  name="input1"
                  type="date"
                  v-model="fechaDesde"
                  label="Fecha desde"
                  @input="filterObjects()"
                  required
                >
                </v-text-field>
                <v-text-field
                  style="width:70%"
                  id="input2"
                  name="input2"
                  type="date"
                  label="Fecha hasta"
                  v-model="fechaHasta"
                  @input="filterObjects()"
                  required
                >
                </v-text-field>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;width:32%; border: 1px solid rgba(24, 23, 23,0.3)
                    ;align-items:center;padding:10px ;border-radius: 15px;height:220px;
                      box-shadow: 0px 0px 5px rgb(139, 136, 136);background-color: #f5f5f5;">
          <h2 style="padding:5px; border-bottom:1px dashed rgba(24, 23, 23,0.3);width:100%;text-align:center;">Seleccione comprobantes:</h2>
          <div style="display:flex;flex-direction:row;align-items:center;padding:3px;justify-content: space-between;width:100%">
            <div style="display:flex;flex-direction:column;align-items:center;width:50%;justify-content: space-between">
              <h4 style="font-size:1rem">Facturas(A)</h4>
              <v-checkbox
                style="margin:0;height:25px"
                v-on:change="filterObjects()"
                v-model="filterParams.facturaA"
              >
              </v-checkbox>
              <h4 style="font-size:1rem">Nota Débito(A)</h4>
              <v-checkbox
                style="margin:0;height:25px"
                v-on:change="filterObjects()"
                v-model="filterParams.notaDebitoA"
              >
              </v-checkbox>
              <h4 style="font-size:1rem">Nota Crédito(A)</h4>
              <v-checkbox
                style="margin:0;height:25px"
                v-on:change="filterObjects()"
                v-model="filterParams.notaCreditoA"
              >
              </v-checkbox>
            </div>
            <div style="display:flex;flex-direction:column;align-items:center;width:50%;justify-content: space-between">
              <h4 style="font-size:1rem">Facturas(B)</h4>
              <v-checkbox
                style="margin:0;height:25px"
                v-on:change="filterObjects()"
                v-model="filterParams.facturaB"
              >
              </v-checkbox>
              <h4 style="font-size:1rem">Nota Débito(B)</h4>
              <v-checkbox
                style="margin:0;height:25px"
                v-on:change="filterObjects()"
                v-model="filterParams.notaDebitoB"
              >
              </v-checkbox>
              <h4 style="font-size:1rem">Nota Crédito(B)</h4>
              <v-checkbox
                style="margin:0;height:25px"
                v-on:change="filterObjects()"
                v-model="filterParams.notaCreditoB"
              >
              </v-checkbox>
            </div>

          </div>
        </div>
        <div style="display:flex;flex-direction:column;width:32%; border: 1px solid rgba(24, 23, 23,0.3)
                    ;align-items:center;padding:10px ;border-radius: 15px;height:220px;
                      box-shadow: 0px 0px 5px rgb(139, 136, 136);background-color: #f5f5f5;">
          <h2 style="padding:5px; border-bottom:1px dashed rgba(24, 23, 23,0.3);width:100%;text-align:center">Seleccione archivos:</h2>
          <div style="display:flex;flex-direction:column;align-items:center;padding:10px">
           <div style="display:flex;flex-direction:row;align-items:center;">
             <h4 style="font-size:1rem;margin-right:10px">Libro IVA EXCEL</h4>
              <v-checkbox
                v-on:change="filterObjects()"
                v-model="libroIvaExcel"
              >
              </v-checkbox>
           </div>
           <div style="display:flex;flex-direction:row;align-items:center;">
             <h4 style="font-size:1rem;margin-right:10px">Libro IVA TXT</h4>
              <v-checkbox
                v-on:change="filterObjects()"
                v-model="libroIvaTxt"
              >
              </v-checkbox>
           </div>
          </div>
        </div>
      </form>
      <div style="display:flex;margin:20px 0px">
                <v-btn
                  class="primary "
                  style="width:30%; margin:0px auto;font-size:1rem"
                  @click="salesForDate1()"
                >
                  Imprimir
                </v-btn>
      </div>

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
import ComprobantesService from "../../services/ComprobantesService";
import Pagination from "../../components/Pagination";
import { generateIntegerDate, monthsList, formatDate } from "../../helpers/dateHelper";
//import { exportExcelLibro } from "../../helpers/exportFileHelper";
import orderSales from "../../services/LibroIvaService"
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
    invoices: [],
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
    libroIvaExcel:false,
    libroIvaTxt:false,
    filterParams: {
      sucursalId: "",
      fechaDesdeString: "",
      fechaHastaString: "",
      facturaA: false,
      facturaB: false,
      facturaC: false,
      notaCreditoA:false,
      notaDebitoA:false,
      notaCreditoB:false,
      notaDebitoB:false,
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "librosDeIva",
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
      { text: "N° Cuit", value: "" },
      { text: "Neto Grabado", value: "netoGrabado" },
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
    this.filterParams.sucursalId = this.loguedUser.sucursal.id;
    this.filterObjects();
    this.months = monthsList;
  },

  methods: {
    filterObjects(page) {
      if (page) this.filterParams.page = page;
      if(this.fechaDesde && this.fechaHasta){
        this.filterParams.fechaDesdeString = formatDate(this.fechaDesde);
        this.filterParams.fechaHastaString = formatDate(this.fechaHasta);
      }
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          data.data.content.forEach((data) => {
            data.netoGrabado = Number(data.totalVenta) - Number(data.totalIvas);
          })
          this.ventas = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          if (this.filterParams.totalPages < this.filterParams.page) {
            this.filterParams.page = 1;
          }
          this.loaded = true;
        }); 
    },

    salesForDate1() {
      if (this.notPassSucursalValidations()) return this.error("sucursal");
      if (this.notPassDateValidations()) return this.error("fechas");
      if (this.notPassArchiveType()) return this.error("archivos");
      let sucursalId = this.loguedUser.sucursal.id;
      const filterParams = {
        sucursalId,
        fechaDesde: generateIntegerDate(this.fechaDesde),
        fechaHasta: generateIntegerDate(this.fechaHasta),
      };
      ComprobantesService(this.tenant, "comprobantesFiscales", this.token)
        .getInvoicesForDateRange(filterParams)
        .then((data) => {
          //let invoices = data.data;
          //dato de todos los comprobantes
          orderSales(data.data,this.filterParams.facturaA,
                               this.filterParams.facturaB,
                               this.filterParams.facturaC,
                               this.libroIvaTxt,
                               this.libroIvaExcel);
          /*
          if(this.filterParams.facturaA){
            invoices = invoices.filter(el => el.nombreDocumento === "FACTURAS A");
          }else if(this.filterParams.facturaB){
            invoices = invoices.filter(el => el.nombreDocumento === "FACTURAS B");
          }else if(this.filterParams.facturaC){
            invoices = invoices.filter(el => el.nombreDocumento === "FACTURAS C");
          }
          this.exportGeneralExcel(invoices);
          */

        });
    },
/*
    async exportGeneralExcel(invoices) {
      this.loaded = false;
      const headers = [
        "FECHA",
        "COMPROBANTE",
        "NUMERO COMPROBANTE",
        "RAZON SOCIAL",
        "CONDICION IVA",
        "NETO GRABADO",
        "IVA 27%",
        "IVA 21%",
        "IVA 10%",
        "TOTAL FACTURADO",
      ];
      if (invoices) {
        let formatedInvoicesParam = [];
        invoices.forEach((el) => {
          el = this.formatForExcel(el);
          formatedInvoicesParam.push(el);
        });
        exportExcelLibro(headers, formatedInvoicesParam);
      } else {
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
      await GenericService(this.tenant, "ventas", this.token)
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

*/

    notPassSucursalValidations() {
      if (this.loguedUser.sucursal) return false;
      return true;
    },

    notPassDateValidations() {
      if (this.fechaDesde && this.fechaHasta) return false;
      return true;
    },

     notPassInvoiceAValidations() {
      if (this.facturaA) return false;
      return true;
    },
    
    notPassInvoiceBValidations() {
      if (this.facturaB) return false;
      return true;
    },


    notPassInvoiceCValidations() {
      if (this.facturaC) return false;
      return true;
    },

    notPassArchiveType(){
      if(!this.libroIvaExcel && !this.libroIvaTxt) return true;
      return false;
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
        case "facturas":
          error = "Debe seleccionar el tipo de factura que desea imprimir"
          break;
        case "archivos":
          error = "Debe seleccionar el tipo de archivo que desea imprimir"
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
