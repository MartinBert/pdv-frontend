<template>
  <v-container style="min-width: 100%;">
    <v-data-table :headers="headers" :items="usuarios" class="elevation-6">
      <template v-slot:[`item.empresa`]="{ item }">
        <span v-if="item.empresa == null">Todas</span>
        <span v-if="item.empresa != null">{{ item.empresa.alias }}</span>
      </template>
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
    usuarios: [],
    filterParams: {
      perfilId: "",
      empresaId: "",
      sucursalSocialReason: "",
      perfilName: "",
      puntoVentaName: "",
      usuarioName: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "usuarios",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    headers: [
      { text: "Nombre", value: "nombre" },
      { text: "Usuario", value: "username" },
      { text: "Perfil", value: "perfil.nombre" },
      { text: "Empresa", value: "empresa" },
      { text: "Acciones", value: "acciones", sortable: false},
    ],
  }),
  components: {
    Edit,
    Delete,
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
          this.usuarios = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          if (this.filterParams.totalPages < this.filterParams.page) {
            this.filterParams.page = 1;
          }
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
