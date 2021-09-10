<template>
  <v-container>
    <v-data-table :headers="headers" :items="devoluciones" hide-default-footer>
      <template v-slot:[`item.productos`]="{ item }">
        <Detail :objectsArray="item.productos" v-on:seeDetails="seeDetails" />
      </template>
      <template v-slot:[`item.productosSalientes`]="{ item }">
        <Detail
          :objectsArray="item.productosSalientes"
          v-on:seeDetails="seeDetails"
        />
      </template>
      <template v-slot:[`item.nombreDocumento`]="{ item }">
        <span v-if="item.comprobante">{{
          item.comprobante.nombreDocumento
        }}</span>
        <span v-else>SIN COMPROBANTE</span>
      </template>
      <template v-slot:[`item.acciones`]="{ item }">
        <Print :object="item" v-on:print="print" v-if="item.comprobante" />
        <Add :object="item" v-on:add="add" v-else />
      </template>
    </v-data-table>
    <Pagination
      :page="filterParams.page"
      :totalPages="filterParams.totalPages"
      :totalVisible="7"
      v-on:changePage="filterObjects"
    />
    <Spinner v-if="!loaded"/>
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import Spinner from "../../components/Graphics/Spinner";
import Pagination from "../../components/Pagination";
import Print from "../Buttons/Print";
import Detail from "../Buttons/Detail";
import Add from "../Buttons/Add";
export default {
  props:{
    filter: Object,
    listenner: Number
  },
  data: () => ({
    devoluciones: [],
    loguedUser: JSON.parse(localStorage.getItem("userData")),
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
      { text: "Descripcion", value: "descripcion" },
      { text: "Fecha", value: "fecha" },
      { text: "Producto Devueltos", value: "productos", sortable:false},
      { text: "Productos Cedidos", value: "productosSalientes", sortable:false},
      { text: "Comprobante", value: "nombreDocumento" },
      { text: "Total", value: "totalDevolucion" },
      { text: "Acciones", value: "acciones", sortable:false},
    ],
    loaded: false,
    tenant: "",
    service: "devoluciones",
    token: localStorage.getItem("token"),
    details: {},
    activeDetailDialog: false,
    receiptDialogData: null,
    temporalObject: null,
  }),

  components: {
    Print,
    Detail,
    Add,
    Spinner,
    Pagination
  },

  watch: {
    listenner: function () {
      this.filterObjects();
    }
  },
  mounted() {
    this.tenant = this.$route.params.tenant;
    if (this.loguedUser.perfil > 1) {
      this.filterParams.sucursalId = this.loguedUser.sucursal.id;
    }
    this.filterObjects();
  },

  methods: {
    filterObjects(page) {
      if (page) this.filterParams.page = page;
      this.filterParams.blackReceiptFilter = this.filter.blackReceiptFilter;
      this.filterParams.fechaEmision = this.filter.fechaEmision;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.devoluciones = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          if (this.filterParams.totalPages < this.filterParams.page) {
            this.filterParams.page = 1;
          }
          this.loaded = true;
        });
    },
    editItem(itemId) {
      this.$emit("editItem", itemId);
    },
    deleteItem(itemId) {
      this.$emit("deleteItem", itemId);
    },
    seeDetails(object) {
      this.$emit("seeDetails", object);
    },
    print(object) {
      this.$emit("print", object);
    },
    add(object) {
      this.$emit("add", object);
    },
  },
};
</script>