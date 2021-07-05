<template>
  <v-container style="min-width: 100%;" class="elevation-6">
    <v-data-table :headers="headers" :items="perfiles">
      <template v-slot:[`item.acciones`]="{ item }">
        <Edit :itemId="item.id" v-on:editItem="editItem" />
        <Delete :itemId="item.id" v-on:deleteItem="deleteItem" />
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import Edit from "../Buttons/Edit";
import Delete from "../Buttons/Delete";
export default {
  data: () => ({
    perfiles: [],
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    filterParams: {
      perfilId: "",
      perfilName: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "perfiles",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    headers: [
      { text: "Nombre", value: "nombre" },
      { text: "Usuario", value: "usuario" },
      { text: "Perfil", value: "perfil.nombre" },
      { text: "Empresa", value: "empresa.alias" },
      { text: "Acciones", value: "acciones" },
    ],
  }),
  components: {
    Edit,
    Delete,
  },
  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterParams.perfilId = this.loguedUser.perfil;
    this.filterObjects();
  },
  methods: {
    filterObjects(page) {
      if (page) this.filterParams.page = page;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.perfiles = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
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
