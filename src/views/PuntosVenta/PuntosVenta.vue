<template>
  <v-container  style="min-width: 98%;
  margin-right:40px;
  ">
    <v-card>
      <PuntosVentaTable
        :items="puntosVenta"
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
import GenericService from "../../services/GenericService";
import PuntosVentaTable from "../../components/Tables/PuntosVentaTable";
import DeleteDialog from "../../components/Dialogs/DeleteDialog";
import Spinner from "../../components/Graphics/Spinner";
export default {
  data: () => ({
    puntosVenta: [],
    empresas: [],
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    filterParams: {
      puntoVentaName: "",
      sucursalId: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "punto_ventas",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    sucursales: [],
    sucursalName: "",
  }),

  components: {
    PuntosVentaTable,
    DeleteDialog,
    Spinner,
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    if (this.loguedUser.perfil > 1) {
      this.filterParams.sucursalId = this.loguedUser.sucursal.id;
    }
    this.filterObjects();
  },

  methods: {
  
    edit(id) {
      this.$router.push({ name: "puntosVentaForm", params: { id: id } });
    },

    filterObjects(page) {
      if (page) this.filterParams.page = page;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.puntosVenta = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          if (this.filterParams.totalPages < this.filterParams.page) {
            this.filterParams.page = 1;
          }
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
      this.deleteDialogStatus = false;
      GenericService(this.tenant, this.service, this.token)
        .delete(this.idObjet)
        .then(() => {
          this.filterObjects();
        })
        .catch(() => {
          this.$errorAlert(
            "El registro se encuentra asociado a otros elementos en el sistema"
          );
        });
    },
  },
};
</script>
