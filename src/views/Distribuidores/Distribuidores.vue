<template>
  <v-container
    style="min-width: 98%;
  margin-right:40px;
  "
  >
    <v-card max-width="100%">
      <v-form class="mb-3">
        <v-row>
          <v-col>
            <v-btn class="primary" @click="newObject()" raised>Nuevo</v-btn>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="filterParams.personaSocialReason"
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
              v-model="filterParams.personaName"
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
              v-model="filterParams.personaCuit"
              v-on:input="filterObjects()"
              dense
              outlined
              rounded
              placeholder="Cuit"
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
      <DistribuidoresTable
        :items="distribuidores"
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
      <DistribuidorDetail />
    </v-card>
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import DistribuidoresTable from "../../components/Tables/DistribuidoresTable";
import Spinner from "../../components/Graphics/Spinner";
import Pagination from "../../components/Pagination";
import DeleteDialog from "../../components/Dialogs/DeleteDialog";
import DistribuidorDetail from "../../components/Details/DistribuidorDetails";
export default {
  data: () => ({
    distribuidores: [],
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    filterParams: {
      sucursalId: "",
      personaSocialReason: "",
      personaName: "",
      personaCuit: "",
      personaDirection: "",
      personaContactName: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "distribuidores",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
  }),

  components: {
    Pagination,
    DistribuidoresTable,
    DistribuidorDetail,
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
    filterObjects(page) {
      if (page) this.filterParams.page = page;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.distribuidores = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },

    newObject() {
      this.$router.push({ name: "distribuidoresForm", params: { id: 0 } });
    },

    edit(id) {
      this.$router.push({ name: "distribuidoresForm", params: { id: id } });
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
