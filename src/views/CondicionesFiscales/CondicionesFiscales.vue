<template>
  <v-container>
    <v-form class="mb-3">
      <v-row>
        <v-col cols="6">
          <v-btn class="primary" @click="newObject()" raised>Nuevo</v-btn>
        </v-col>
        <v-col cols="3"></v-col>
        <v-col cols="3">
          <v-text-field
            v-model="filterParams.condicionFiscalName"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            class="text-left"
            placeholder="Búsqueda"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <CondicionesFiscalesTable
      :items="condiciones"
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

    <Spinner v-if="!loaded"/>

    <DeleteDialog
      :status="deleteDialogStatus"
      v-on:deleteConfirmation="deleteConfirmation"
    />
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import CondicionesFiscalesTable from '../../components/Tables/CondicionesFiscalesTable';
import Spinner from '../../components/Spinner';
import DeleteDialog from '../../components/Dialogs/DeleteDialog';
import Pagination from '../../components/Pagination';

export default {
  data: () => ({
    condiciones: [],
    filterParams: {
      condicionFiscalName: "",
      page: 1,
      size: 10,
      totalPages: 0
    },
    loaded: false,
    tenant: "",
    service: "condicionesFiscales",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false
  }),

  components:{
    CondicionesFiscalesTable,
    Pagination,
    DeleteDialog,
    Spinner
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterObjects();
  },

  methods: {
    newObject() {
      this.$router.push({ name: "condicionesFiscalesForm", params: { id: 0 } });
    },

    edit(id) {
      this.$router.push({ name: "condicionesFiscalesForm", params: { id: id } });
    },

    filterObjects(page){
      if(page) this.filterParams.page = page;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then(data => {
          this.condiciones = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          if(this.filterParams.totalPages < this.filterParams.page){
              this.filterParams.page = 1;
          }
          this.loaded = true;
        });
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
  }
};
</script>