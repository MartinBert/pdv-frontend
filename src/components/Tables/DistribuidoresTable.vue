<template>
  <v-container style="max-width:100%;">
    <v-data-table
      :headers="headers"
      :items="distribuidores"
      class="elevation-6"
      hide-default-footer
    >
      <template v-slot:[`item.detalles`]="{ item }">
        <Detail :object="item" v-on:seeDetails="seeDetails" />
      </template>
      <template v-slot:[`item.acciones`]="{ item }">
        <Edit :itemId="item.id" v-on:editItem="editItem" />
        <Delete :itemId="item.id" v-on:deleteItem="deleteItem" />
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
import GenericService from "../../services/GenericService";
import Pagination from "../Pagination";
import Edit from "../Buttons/Edit";
import Delete from "../Buttons/Delete";
import Detail from "../Buttons/Detail";
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
    headers: [
      { text: "Nombre", value: "nombre" },
      { text: "Razon Social", value: "razonSocial" },
      { text: "Detalles", value: "detalles" },
      { text: "Cuit", value: "cuit" },
      { text: "Acciones", value: "acciones", sortable: false },
    ],
  }),
  components: {
    Edit,
    Delete,
    Detail,
    Pagination
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
    editItem(itemId) {
      this.$emit("editItem", itemId);
    },
    deleteItem(itemId) {
      this.$emit("deleteItem", itemId);
    },
    seeDetails(object) {
      this.$emit("seeDetails", object);
    },
  },
};
</script>
