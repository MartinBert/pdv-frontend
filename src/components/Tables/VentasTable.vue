<template>
  <v-container style="min-width: 98%;">
    <v-form class="mb-0">
      <v-row class="mb-0">
        <v-col>
          <v-btn class="primary" @click="seeReports()" raised
            >Reporte de Ventas</v-btn
          >
        </v-col>
        <v-spacer></v-spacer>
        <v-col>
          <v-text-field
            type="text"
            v-model="filterParams.fechaEmision"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            label="Búsqueda por fecha"
            class="text-left"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            type="text"
            v-model="filterParams.barCode"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            label="Búsqueda por número de comprobante"
            placeholder=" "
            class="text-left"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            type="number"
            v-model="filterParams.blackReceiptFilter"
            dense
            outlined
            rounded
            class="text-left"
            label="Búsqueda especial"
            placeholder=" "
            append-icon="mdi-magnify"
            @input="filterObjects()"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <v-row style="justify-content: center;">
      <v-col>
        <h2 style="text-align:center;">Lista de comprobantes emitidos</h2>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="obj"
      class="elevation-6"
      hide-default-footer
    >
      <template v-slot:[`item.productos`]="{ item }">
        <Detail :objectsArray="item.productos" v-on:seeDetails="seeDetails" />
      </template>
      <template v-slot:[`item.mediosPago`]="{ item }">
        <Detail :objectsArray="item.mediosPago" v-on:seeDetails="seeDetails" />
      </template>
      <template v-slot:[`item.planesPago`]="{ item }">
        <Detail :objectsArray="item.planesPago" v-on:seeDetails="seeDetails" />
      </template>
      <template v-slot:[`item.acciones`]="{ item }">
        <Print :object="item" v-on:print="print" />
      </template>
    </v-data-table>
    <Pagination
      :page="filterParams.page"
      :totalPages="filterParams.totalPages"
      :totalVisible="7"
      v-on:changePage="filterObjects"
    />
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import Pagination from "../../components/Pagination";
import Detail from "../Buttons/Detail";
import Print from "../Buttons/Print";
export default {
  data: () => ({
    icon: "mdi-check-circle",
    ventas: [],
    obj: [],
    loaded: false,
    tenant: "",
    service: "ventas",
    token: localStorage.getItem("token"),
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    filterParams: {
      blackReceiptFilter: "",
      sucursalId: "",
      barCode: "",
      numeroCbte: "",
      fechaEmision: "",
      comprobanteCerrado: "",
      numeroComprobante: "",
      totalVenta: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    headers: [
      { text: "Fecha de Venta", value: "fechaEmision" },
      { text: "Codigo de barra", value: "barCode" },
      { text: "Comprobante", value: "nombreDocumento", sortable: false },
      { text: "Detalles", value: "productos", sortable: false },
      {
        text: "Medios de pago empleados",
        value: "mediosPago",
        sortable: false,
      },
      { text: "Planes de pago", value: "planesPago", sortable: false },
      { text: "Precio de venta", value: "totalVenta" },
      { text: "Acciones", value: "acciones", sortable: false },
    ],
  }),

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterObjects();
  },

  components: {
    Pagination,
    Detail,
    Print,
  },

  methods: {
    filterObjects(page) {
      if (page) this.filterParams.page = page;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          let ventas = data.data.content;
          ventas.forEach((el) => {
            if (
              el.nombreDocumento === "FACTURAS C" 
            ) {
              this.obj.push(el);
            }
            this.filterParams.totalPages = data.data.totalPages;
            if (this.filterParams.totalPages < this.filterParams.page) {
              this.filterParams.page = 1;
            }
            this.loaded = true;
          });
        });
    },
    seeReports() {
      this.$store.commit("eventual/mutateEventualDialog");
    },
    seeDetails(objects) {
      this.$emit("seeDetails", objects);
    },
    print(object) {
      this.$emit("print", object);
    },
  },
};
</script>
