<template>
  <v-container>
    <v-form class="mb-3">
      <v-row>
        <v-col>
          <v-btn class="primary" @click="newObject()" raised>Nuevo</v-btn>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.empresaSocialReason"
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
            v-model="filterParams.empresaName"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            placeholder="Nombre de empresa"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.empresaCuit"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            placeholder="CUIT"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
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
    <EmpresaDetails/>
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import Spinner from "../../components/Spinner";
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

  components:{
    Spinner,
    Pagination,
    EmpresasTable,
    EmpresaDetails,
    DeleteDialog
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
      if(page) this.filterParams.page = page;
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

    newObject() {
      this.$router.push({ name: "empresasForm", params: { id: 0 } });
    },

    edit(id) {
      this.$router.push({ name: "empresasForm", params: { id: id } });
    },

    deleteItem(id) {
      this.idObjet = id;
      this.deleteDialogStatus = true;
    },

    deleteConfirmation(result){
      return result ? this.deleteObject() : this.deleteDialogStatus = false;
    },

    deleteObject() {
      this.dialog = true;
      this.deleteDialogStatus = false;
      GenericService(this.tenant, this.service, this.token)
        .delete(this.idObjet)
        .then(() => {
          this.filterObjects();
        })
        .catch(()=>{
          this.$errorAlert("El registro se encuentra asociado a otros elementos en el sistema");
        })
    },

    seeDetails(object){
      this.$store.commit('details/mutateDialog');
      this.$store.commit('details/addObjectToDetail', object);
    },
  },
};
</script>