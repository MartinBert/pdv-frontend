<template>
  <v-container style="min-width: 100%;">
     <v-form class="mb-3">
        <v-row>
          <v-col cols="6">
            <v-btn class="primary" @click="newObject()" raised>Nuevo</v-btn>
          </v-col>
          <v-col cols="3"></v-col>
          <v-col cols="3">
            <v-text-field
              v-model="filterParams.puntoVentaName"
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
    <v-data-table :headers="headers" :items="puntosVenta" class="elevation-6">
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
    puntosVenta: [],
    empresas: [],
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    filterParams: {
      puntoVentaName: "",
      sucursalId: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "punto_ventas",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    sucursales: [],
    sucursalName: "",
    headers: [
      { text: "Nombre", value: "nombre" },
      { text: "ID Fiscal", value: "idFiscal" },
      { text: "IPV4", value: "ipLocal" },
      { text: "Acciones", value: "acciones", sortable:false},
    ],
  }),
  components: {
    Edit,
    Delete,
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
          this.puntosVenta = data.data.content;
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
