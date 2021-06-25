<template>
  <v-container style="min-width: 100%;">
    <v-card>
      <v-form class="mb-3">
        <v-row>
          <v-col>
            <v-btn
              v-if="loguedUser.perfil < 3"
              class="primary"
              @click="newObject()"
              raised
              >Nuevo</v-btn
            >
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="filterParams.sucursalSocialReason"
              v-on:input="filterObjects()"
              dense
              outlined
              rounded
              placeholder="Razón social"
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="filterParams.sucursalName"
              v-on:input="filterObjects()"
              dense
              outlined
              rounded
              placeholder="Nombre"
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="filterParams.sucursalDirection"
              v-on:input="filterObjects()"
              dense
              outlined
              rounded
              placeholder="Dirección"
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
      <SucursalesTable
        :items="sucursales"
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
      <SucursalDetails />
    </v-card>
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import Spinner from "../../components/Graphics/Spinner";
import Pagination from "../../components/Pagination";
import SucursalesTable from "../../components/Tables/SucursalesTable";
import DeleteDialog from "../../components/Dialogs/DeleteDialog";
import SucursalDetails from "../../components/Details/SucursalDetails";
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
    Pagination,
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

    newObject() {
      this.$router.push({ name: "sucursalesForm", params: { id: 0 } });
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
