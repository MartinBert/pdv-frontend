<template>
  <v-container
    style="min-width: 98%;
    margin-left:1px;"
  >
    <v-card min-width="100%">
      <v-row style="justify-content: center;">
        <v-col cols="3">
          <v-menu
            ref="menu1"
            v-model="menu1"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateFormatted"
                label="Fecha desde"
                hint="MM/DD/YYYY format"
                persistent-hint
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                @blur="date = parseDate(dateFormatted)"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              no-title
              @input="menu1 = false"
            ></v-date-picker>
          </v-menu>
        </v-col>

        <v-col cols="3">
          <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="computedDateFormatted"
                label="Fecha Hasta"
                hint="MM/DD/YYYY format"
                persistent-hint
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              no-title
              @input="menu2 = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="2">
          <v-checkbox v-model="checkbox1">
            <template v-slot:label>
              <div>
                Facturas A
              </div>
            </template>
          </v-checkbox>
        </v-col>
        <v-col cols="2">
          <v-checkbox v-model="checkbox2">
            <template v-slot:label>
              <div>
                Facturas B
              </div>
            </template>
          </v-checkbox>
        </v-col>
        <v-col cols="2">
          <v-checkbox v-model="checkbox3">
            <template v-slot:label>
              <div>
                Facturas C
              </div>
            </template>
          </v-checkbox>
        </v-col>
      </v-row>
      <v-row style="justify-content: center;">
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.letra"
            dense
            outlined
            rounded
            label="Nombre Comprobante"
            class="text-left"
            @input="filterProof()"
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
            @input="filterProof()"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.condicionVenta"
            dense
            outlined
            rounded
            label="Condicion Venta"
            class="text-left"
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
        :items="comprobantesFiscales"
      >
        <template v-slot:[`item.acciones`]="{}">
          <Print />
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script>
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
    checkbox1: false,
    checkbox2:false,
    checkbox3:false,
    comprobantesFiscales:[],
    comprobantesComerciales:[],
    FiscalCondicion:[],
    file: null,
    sucusal:[],
    empresa:[],
    ivas:[],
   filterParams: {
      blackReceiptFilter: "",
      sucursalId: "",
      fechaEmision: "",
      comprobanteCerrado: "",
      numeroComprobante: "",
      validityStatus:false,
      totalVenta: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "comprobantesFiscales",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    menu1: false,
    menu2: false,
    headers: [
      { text: "Fecha", value: "fecha" },
      { text: "Comprobante", value: "documentosComerciales.nombre" },
      { text: "Razon Social", value: "condicionVenta" },
      { text: "Condicion Iva", value: "" },
      { text: "N° Cuit", value: "empresa.cuit" },
      { text: "Neto Grabado", value: "" },
      { text: "Iva 27%", value: "ivaCompras" },
      { text: "Iva 21%", value: "ivaVentas" },
      { text: "Iva 10,5%", value: "" },
      { text: "Iva 0 %", value: "" },
      { text: "Total Facturado", value: "totalVenta" },
      { text: "Acciones", value: "acciones", sortable: false },
    ],
  }),
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
  },

  methods: {
 filterObjects(page) {
      if (page) this.filterParams.page = page;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.comprobantesFiscales = data.data.content;
          console.log(this.comprobantesFiscales);
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
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
