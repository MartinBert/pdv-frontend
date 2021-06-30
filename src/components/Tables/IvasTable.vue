<template>
  <v-container style="min-width: 100%;">
    <v-data-table :headers="headers" :items="ivas" class="elevation-6">
      <template v-slot:[`item.ivaVentas`]="{ item }">
        <v-alert v-if="!item.tipo" dense class="success">Iva Ventas</v-alert>
      </template>
      <template v-slot:[`item.ivaCompras`]="{ item }">
        <v-alert v-if="item.tipo" dense class="info">Iva Compras</v-alert>
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
    ivas: [],
    filterParams: {
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "ivas",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    headers: [
      { text: "ID", value: "id" },
      { text: "Nombre", value: "nombre" },
      { text: "Porcentaje", value: "porcentaje" },
      { text: "Iva Ventas", value: "ivaVentas" },
      { text: "Iva Compras", value: "ivaCompras" },
      { text: "Acciones", value: "acciones", sortable: false}
    ],
  }),
  components: {
    Edit,
    Delete,
  },
  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterObjects();
  },
  methods: {
    filterObjects(page) {
      if (page) this.filterParams.page = page;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.ivas = data.data.content;
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
