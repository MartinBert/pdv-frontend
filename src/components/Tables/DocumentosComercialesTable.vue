<template>
  <v-container>
    <v-data-table :items="documentosComerciales" :headers="headers">
      <template v-slot:[`item.tipo`]="{ item }">
         <v-alert type="success" dense v-if="item.tipo">Fiscal</v-alert>
            <v-alert
              color="secondary"
              icon="mdi-close-circle"
              dense
              dark
              v-if="!item.tipo"
              >No fiscal</v-alert
            >
      </template>
      <template v-slot:[`item.acciones`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
//import Edit from "../Buttons/Edit";
//import Delete from "../Buttons/Delete";
import GenericService from "../../services/GenericService";

export default {
  data: () => ({
    documentosComerciales: [],
    file: null,
    filterParams: {
      documentoComercialName: "",
      sucursalId: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "documentosComerciales",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    headers: [
      { text: "Nombre", value: "nombre" },
      { text: "Tipo de documento", value: "tipo" },
      { text: "Letra", value: "letra" },
      { text: "Acciones", value: "acciones", sorteable: false },
    ],
  }),

  components: {
    // Delete,
    //Edit,
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
          this.documentosComerciales = data.data.content;
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
