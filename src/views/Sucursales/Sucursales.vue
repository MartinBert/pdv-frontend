<template>
  <v-container  style="min-width: 98%;
  margin-right:40px;
  ">
    <v-card>
      <SucursalesTable
        :items="sucursales"
        v-on:editItem="edit"
        v-on:deleteItem="deleteItem"
        v-on:seeDetails="seeDetails"
        v-if="loaded"
      />
      <Spinner v-if="!loaded" />
      <DeleteDialog
        :status="deleteDialogStatus"
        v-on:deleteConfirmation="deleteConfirmation"
      />
      <SucursalDetails />
    </v-card>
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import Spinner from "../../components/Graphics/Spinner";
import SucursalesTable from "../../components/Tables/SucursalesTable";
import DeleteDialog from "../../components/Dialogs/DeleteDialog";
import SucursalDetails from "../../components/Details/SucursalDetails";
import { getCurrentDate, formatDate } from "../../helpers/dateHelper";
export default {
  data: () => ({
    sucursales: [],
    perfil: 0,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    filterParams: {
      sucursalName: "",
      sucursalSocialReason: "",
      sucursalDirection: "",
      sucursalId: "",
      fechaInicioAct:"",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "sucursales",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
  }),

  components: {
    Spinner,
    SucursalesTable,
    DeleteDialog,
    SucursalDetails,
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
      this.filterParams.fechaInicioAct = formatDate(getCurrentDate());
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.sucursales = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          if (this.filterParams.totalPages < this.filterParams.page) {
            this.filterParams.page = 1;
          }
          this.loaded = true;
        });
    },
    edit(id) {
      this.$router.push({ name: "sucursalesForm", params: { id: id } });
    },

    deleteItem(id) {
      this.idObjet = id;
      this.deleteDialogStatus = true;
    },

    deleteConfirmation(result) {
      return result ? this.deleteObject() : (this.deleteDialogStatus = false);
    },

    deleteObject() {
      this.dialog = true;
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

    seeDetails(object) {
      this.$store.commit("details/mutateDialog");
      this.$store.commit("details/addObjectToDetail", object);
    },
  },
};
</script>
