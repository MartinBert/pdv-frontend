<template>
  <v-container
    style="min-width: 98%;
  margin-right:40px;
  "
  >
    <v-card min-width="100%">
      <v-form class="mb-3">
        <v-row>
          <v-col>
            <v-btn class="primary" @click="newObject()" raised>Nuevo</v-btn>
          </v-col>
        </v-row>
      </v-form>
      <IvasTable
        v-on:editItem="edit"
        v-on:deleteItem="deleteItem"
        v-if="loaded"
      />
      <Pagination
        :page="filterParams.page"
        :totalPages="filterParams.totalPages"
        :totalVisible="7"
        v-on:changePage="filterObjects"
        v-if="loaded"
      />
      <DeleteDialog
        :status="deleteDialogStatus"
        v-on:deleteConfirmation="deleteConfirmation"
      />
    </v-card>
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import IvasTable from "../../components/Tables/IvasTable";
import Pagination from "../../components/Pagination";
import DeleteDialog from "../../components/Dialogs/DeleteDialog";
export default {
  data: () => ({
    ivas: [],
    loaded:false,
    filterParams: {
      page: 1,
      size: 10,
      totalPages: 0,
    },
    tenant: "",
    service: "ivas",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
  }),

  components: {
    IvasTable,
    Pagination,
    DeleteDialog,
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
  },

  methods: {

    newObject() {
      this.$router.push({ name: "ivasForm", params: { id: 0 } });
    },

    edit(id) {
      this.$router.push({ name: "ivasForm", params: { id: id } });
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
