<template>
  <v-container style="min-width: 98%;">
    <v-form class="mb-3" v-if="loaded">
      <v-row>
        <v-col cols="1">
          <v-btn class="primary" @click="zClosure()" raised
            >Realizar cierre ventas diario</v-btn
          >
        </v-col>
        <v-col></v-col>
        <v-col cols="3">
          <v-text-field
            v-model="filterParams.fecha"
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
    <v-data-table class="elevation-6" :headers="headers" :items="cierres" :search="search"  hide-default-footer>
      <template v-slot:[`item.acciones`]="{ item }">
        <Detail
          :objectsArray="item.comprobantesFiscales"
          v-on:seeDetails="seeDetails"
        />
        <Print :object="item" v-on:print="printZClosure" class="ml-1" />
        <Delete :itemId="item.id" v-on:deleteItem="deleteItem" class="ml-1" />
      </template>
    </v-data-table>
     <CierrezDetails />
    <Pagination
      :page="filterParams.page"
      :totalPages="filterParams.totalPages"
      :totalVisible="7"
      v-on:changePage="filterObjects"
    />

  </v-container>
</template>
<script>
import ReportsService from "../../services/ReportsService";
import Pagination from "../Pagination";
import { formatDate } from '../../helpers/dateHelper';
import GenericService from "../../services/GenericService";
import CierrezDetails from "../../components/Details/CierrezDetails.vue";
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
      fechaEmision:"",
      numeroCorrelativo:"",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    invoiceFilterParams: {
      sucursalId: "",
      numeroCorrelativo:"",
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
      { text: "Numero de Comprobante", value: "numeroCorrelativo" },
      { text: "Acciones", value: "acciones", sortable: false },
    ],
  }),
  components: {
    Detail,
    Print,
    Delete,
    Pagination,
    CierrezDetails,
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
          data.data.content.forEach((data) => {
            data.fecha = formatDate(data.fecha);
          })
          this.cierres = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
      console.log(this.cierres);
    },
    
      print(object) {
      this.objectToPrint = object;
      this.printDialogStatus = true;
    },
    
     printSpecification(specification) {
      return this.printZClosure(specification);
    },

    printZClosure(specification) {
      ReportsService(this.tenant, "cierres_z", this.token)
        .printZClosure(this.objectToPrint, specification)
        .then((res) => {
          let file = new Blob([res["data"]], {
            type: "application/pdf",
          });
          let fileURL = URL.createObjectURL(file);
          window.open(fileURL, "_blank");
        });
    },

    seeDetails(object) {
      this.$emit("seeDetails", object);
    },
    deleteItem(itemId) {
      this.$emit("deleteItem", itemId);
    },
    zClosure() {
      this.$emit("zClosure");
    },
  },
};
</script>
