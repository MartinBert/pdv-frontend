<template>
  <v-container style="min-width: 98%;">
    <v-row style="justify-content: center;">
      <v-col>
        <h2>Lista de comprobantes emitidos</h2>
      </v-col>
    </v-row>
    <v-data-table style="background-color: transparent" :headers="headers" :items="ventas" class="elevation-6">
      <template v-slot:[`item.productos`]="{ item }">
        <Detail :objectsArray="item.productos" v-on:seeDetails="seeDetails" />
      </template>
      <template v-slot:[`item.mediosPagos`]="{ item }">
        <Detail :objectsArray="item.mediosPago" v-on:seeDetails="seeDetails" />
      </template>
      <template v-slot:[`item.planesPago`]="{ item }">
        <Detail :objectsArray="item.planesPago" v-on:seeDetails="seeDetails" />
      </template>
      <template v-slot:[`item.acciones`]="{ item }">
        <Print :object="item" v-on:print="print" />
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import Detail from "../Buttons/Detail";
import Print from "../Buttons/Print";
export default {
  data: () => ({
    icon: "mdi-check-circle",
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    ventas: [],
    token: localStorage.getItem('token'),
    filterParams: {
      blackReceiptFilter: "",
      sucursalId: "",
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
      { text: "Comprobante", value: "nombreDocumento", sortable:false},
      { text: "Detalles", value: "productos", sortable:false},
      { text: "Medios de pago empleados", value: "mediosPago" ,sortable:false},
      { text: "Planes de pago", value: "planesPago",sortable:false},
      { text: "Precio de venta", value: "totalVenta" },
      { text: "Acciones", value: "acciones", sortable:false},
    ],
  }),
  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterObjects();
  },

  components: {
    Detail,
    Print,
  },
  methods: {
    filterObjects(page) {
      if (page) this.filterParams.page = page;
      GenericService(this.tenant, "ventas", this.token)
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
    seeDetails(objects) {
      this.$emit("seeDetails", objects);
    },
    print(object) {
      this.$emit("print", object);
    },
  },
};
</script>
