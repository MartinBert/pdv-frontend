<template>
  <v-container style="min-width: 100%;">
    <v-form class="mb-0">
      <v-row>
        <v-col cols="1">
          <v-btn class="primary" @click="newObject()" raised>Nuevo</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-data-table :headers="headers" :items="configuraciones" class="elevation-6"  hide-default-footer>
      <template v-slot:[`item.acciones`]="{ item }">
        <Edit :itemId="item.id" v-on:editItem="editItem" />
        <Delete :itemId="item.id" v-on:deleteItem="deleteItem"/>
      </template>
    </v-data-table>
      <Pagination
      :page="filterParams.page"
      :totalPages="filterParams.totalPages"
      :totalVisible="7"
      v-on:changePage="filterObjects"
    />
  </v-container>
</template>
<script>
import Edit from "../../components/Buttons/Edit";
import Delete from "../../components/Buttons/Delete";
import GenericService from "../../services/GenericService";
import Pagination from "../Pagination";
export default {
  data: () => ({
    editedItem: {
      valor: "",
      valorNumerico:"",
    },
    file:"",
    configuraciones: [],
    headers: [
      { text: "Cliente", value: "clientePorDefecto.nombre" },
      { text: "Documento", value: "documentoPorDefecto.nombre" },
      { text: "Acciones", value: "acciones", sortable: false },
    ],
    filterParams: {
      clientName: '',
      documentName:'',
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "ventasFastConfig",
    token: localStorage.getItem("token"),
    loguedUser: JSON.parse(localStorage.getItem("userData")),
  }),
  components:{
    Pagination,
    Edit,
    Delete
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    if(this.loguedUser.perfil > 1){
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
          this.configuraciones = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },

    newObject() {
      this.$router.push({ name: "ventasfastconfiguracionForm", params: { id: 0 } });
    },

    editItem(itemId) {
      this.$emit("editItem", itemId);
    },

    deleteItem(itemId) {
      this.$emit("deleteItem", itemId);
    },
  },
};
</script>
