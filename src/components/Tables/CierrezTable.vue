<template>
  <v-container style="min-width: 98%;">
    <v-form class="mb-3" v-if="loaded">
      <v-row>
        <v-col cols="1">
          <v-btn class="primary" @click="generateZClosure()" raised
            >Realizar cierre ventas diario</v-btn
          >
        </v-col>
        <v-col></v-col>
        <v-col cols="3">
          <v-text-field
            v-model="search"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            class="text-left"
            placeholder="Búsqueda"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <v-data-table class="elevation-6" :headers="headers" :items="cierres" :search="search">
      <template v-slot:[`item.acciones`]="{ item }">
        <Detail
          :objectsArray="item.comprobantesFiscales"
          v-on:seeDetails="seeDetails"
        />
        <Print :object="item" v-on:print="print" class="ml-1" />
        <Delete :itemId="item.id" v-on:deleteItem="deleteItem" class="ml-1" />
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
import Pagination from "../Pagination";
import GenericService from "../../services/GenericService";
import Print from "../Buttons/Print";
import Detail from "../Buttons/Detail";
import Delete from "../Buttons/Delete";
export default {
  data: () => ({
    search:"",
    cierres: [],
    comprobantes: [],
    file: null,
    filterParams: {
      sucursalId: "",
      date: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    invoiceFilterParams: {
      sucursalId: "",
      fechaEmision: "",
      page: 1,
      size: 100000,
    },
    activeTab: 3,
    objectToPrint: null,
    savedMedioDetalles: [],
    printDialogStatus: false,
    loaded: false,
    tenant: "",
    service: "cierres_z",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    headers: [
      { text: "Fecha", value: "fecha" },
      { text: "Numero de Comprobante", value: "id" },
      { text: "Acciones", value: "acciones", sortable: false },
    ],
  }),
  components: {
    Detail,
    Print,
    Delete,
    Pagination,
  },
  mounted() {
    this.tenant = this.$route.params.tenant;
    if (this.loguedUser.perfil > 1) {
      this.filterParams.sucursalId = this.loguedUser.sucursal.id;
      this.invoiceFilterParams.sucursalId = this.loguedUser.sucursal.id;
    }
    this.filterObjects();
  },
  methods: {
    filterObjects(page) {
      if (page) this.filterParams.page = page;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.cierres = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
      console.log(this.cierres);
    },
    seeDetails(object) {
      this.$emit("seeDetails", object);
    },
    print(object) {
      this.$emit("print", object);
    },
    deleteItem(itemId) {
      this.$emit("deleteItem", itemId);
    },
  },
};
</script>
