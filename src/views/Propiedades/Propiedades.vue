<template>
  <v-container style="min-width: 98%;
  margin-right:40px;
  ">
    <v-card>
      <PropiedadesTable
        :items="propiedades"
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
      <PropiedadesDetails />
    </v-card>
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import PropiedadesTable from "../../components/Tables/PropiedadesTable";
import PropiedadesDetails from "../../components/Details/PropiedadesDetails";
import DeleteDialog from "../../components/Dialogs/DeleteDialog";
import Spinner from "../../components/Graphics/Spinner";
export default {
  data: () => ({
    propiedades: [],
    filterParams: {
      propiedadName: "",
      estado:true,
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "propiedades",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
  }),

  components: {
    PropiedadesDetails,
    PropiedadesTable,
    DeleteDialog,
    Spinner,
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
          this.propiedades = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },
    edit(id) {
      this.$router.push({ name: "propiedadesForm", params: { id: id } });
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
    },

    seeDetails(objects) {
      this.$store.commit("details/mutateDialog");
      this.$store.commit("details/addObjectsToDetail", objects);
    },
  },
};
</script>
