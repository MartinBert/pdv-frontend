<template>
  <v-container  style="min-width: 98%;
  margin-right:40px;
  ">
    <v-card>
      <EmpresasTable
        :items="empresas"
        v-on:editItem="edit"
        v-on:deleteItem="deleteItem"
        v-on:seeDetails="seeDetails"
        v-if="loaded"
      />
      <Pagination
        :page="filterParams.page"
        :totalPages="filterParams.totalPages"
        :totalVisible="7"
        v-on:changePage="filterObjects"
        v-if="loaded"
      />
      <Spinner v-if="!loaded" />
      <DeleteDialog
        :status="deleteDialogStatus"
        v-on:deleteConfirmation="deleteConfirmation"
      />
      <EmpresaDetails />
    </v-card>
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import Spinner from "../../components/Graphics/Spinner";
import Pagination from "../../components/Pagination";
import EmpresasTable from "../../components/Tables/EmpresasTable";
import DeleteDialog from "../../components/Dialogs/DeleteDialog";
import EmpresaDetails from "../../components/Details/EmpresaDetails";
export default {
  data: () => ({
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    empresas: [],
    filterParams: {
      perfilId: "",
      empresaId: "",
      empresaName: "",
      empresaCuit: "",
      empresaSocialReason: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "empresas",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
  }),

  components: {
    Spinner,
    Pagination,
    EmpresasTable,
    EmpresaDetails,
    DeleteDialog,
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterParams.perfilId = this.loguedUser.perfil;
    if (this.loguedUser.perfil > 1) {
      this.filterParams.empresaId = this.loguedUser.empresa.id;
    }
    this.filterObjects();
  },

  methods: {
    filterObjects(page) {
      if (page) this.filterParams.page = page;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.empresas = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          if (this.filterParams.totalPages < this.filterParams.page) {
            this.filterParams.page = 1;
          }
          this.loaded = true;
        });
    },
    edit(id) {
      this.$router.push({ name: "empresasForm", params: { id: id } });
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
