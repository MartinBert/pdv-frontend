<template>
  <v-container style="min-width: 100%;">
    <v-card min-width="100%">
      <ImpresorasTable
        :items="impresoras"
        v-on:editItem="edit"
        v-on:deleteItem="deleteItem"
        v-if="loaded"
      />
      <Spinner v-if="!loaded" />
      <DeleteDialog
        :status="deleteDialogStatus"
        v-on:deleteConfirmation="deleteConfirmation"
      />
    </v-card>
  </v-container>
</template>
<script>
import ImpresorasTable from "../../components/Tables/ImpresorasTable.vue";
import Spinner from "../../components/Graphics/Spinner";
import GenericService from "../../services/GenericService";
import DeleteDialog from "../../components/Dialogs/DeleteDialog.vue";
export default {
  data: () => ({
    impresoras: [],
    itemss: ["80 mm ", "58 mm"],
    filterParams: {
      sucursalId: "",
      valor: "",
      nombreImpresora: "",
      etiqueta:"",
      ticket:"",
      estado: true,
      page: 1,
      size: 10,
      totalPages: 0,
    },
    viewCheckboxState: 0,
    checkboxModel: {},
    loaded: true,
    tenant: "",
    deleteDialogStatus: false,
    service: "impresoras",
    token: localStorage.getItem("token"),
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    headers: [
      { text: "Nombre", value: "nombreImpresora" },
      { text: "Ancho", value: "valor" },
      { text: "Impresora por defecto", value: "impresoraPredeterminada" },
      {text:"Etiquetas",value:""},
      {text:"Ticket",value:""},
      { text: "Acciones", value: "acciones", sortable: false },
    ],
  }),

  components: {
    Spinner,
    ImpresorasTable,
    DeleteDialog
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    if (this.loguedUser.perfil > 1) {
      this.filterParams.sucursalId = this.loguedUser.sucursal.id;
    }
    this.getObjects();
  },

  methods: {
    getObjects(page) {
      if (page) this.filterParams.page = page;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.impresoras = data.data.content;
          console.log(this.impresoras);
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },

    deleteItem(id) {
      this.idObjet = id;
      this.deleteDialogStatus = true;
    },

    deleteConfirmation(result) {
      return result ? this.deleteObject() : (this.deleteDialogStatus = false);
    },

    deleteObject() {
      this.loaded = false;
      this.deleteDialogStatus = false;
      GenericService(this.tenant, this.service, this.token)
        .delete(this.idObjet)
        .then(() => {
          this.getObjects();
        });
    },
    newObject() {
      this.$router.push({ name: "ImpresorasForm", params: { id: 0 } });
    },

    edit(id) {
      this.$router.push({ name: "ImpresorasForm", params: { id: id } });
    },
  },
};
</script>
