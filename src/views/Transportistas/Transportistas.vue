<template>
  <v-container>
    <v-card>
      <v-form class="mb-3">
        <v-row>
          <v-col>
            <v-btn class="primary" @click="newObject()" raised>Nuevo</v-btn>
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
              placeholder="CUIT"
              append-icon="mdi-magnify"
            ></v-text-field>
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
              v-model="filterParams.personaDirection"
              v-on:input="filterObjects()"
              dense
              outlined
              rounded
              placeholder="Dirección"
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="filterParams.personaContactName"
              v-on:input="filterObjects()"
              dense
              outlined
              rounded
              placeholder="Nombre de contacto"
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
      <TransportistasTable
        :items="transportistas"
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
      <TransportistaDetails />
    </v-card>
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import Spinner from "../../components/Graphics/Spinner";
import Pagination from "../../components/Pagination";
import TransportistasTable from "../../components/Tables/TransportistasTable";
import DeleteDialog from "../../components/Dialogs/DeleteDialog";
import TransportistaDetails from "../../components/Details/TransportistaDetails";
export default {
  data: () => ({
    transportistas: [],
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
    service: "transportistas",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
  }),

  components: {
    Spinner,
    Pagination,
    TransportistasTable,
    DeleteDialog,
    TransportistaDetails,
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
          this.transportistas = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },

    newObject() {
      this.$router.push({ name: "transportistasForm", params: { id: 0 } });
    },

    edit(id) {
      this.$router.push({ name: "transportistasForm", params: { id: id } });
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
