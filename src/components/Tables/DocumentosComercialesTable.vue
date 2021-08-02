<template>
  <v-container style="min-width: 100%;">
    <v-form class="mb-3">
      <v-row>
        <v-col cols="1">
          <v-btn class="primary" @click="newObject()" raised>Nuevo</v-btn>
        </v-col>
        <v-col cols="2">
          <div style="width: 300px">
            <v-file-input
              dense
              v-model="file"
              class="mt-0"
              placeholder="Importar depósitos"
              accept=".xlsx, xls"
              @change="importDocuments($event)"
            ></v-file-input>
          </div>
        </v-col>
        <v-col cols="6"></v-col>
        <v-col cols="3">
          <v-text-field
            v-model="filterParams.documentoComercialName"
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
    <v-data-table
      :items="documentosComerciales"
      :headers="headers"
      class="elevation-6"
      hide-default-footer
    >
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
    <Pagination
      :page="filterParams.page"
      :totalPages="filterParams.totalPages"
      :totalVisible="7"
      v-on:changePage="filterObjects"
    />
  </v-container>
</template>
<script>
//import Edit from "../Buttons/Edit";
//import Delete from "../Buttons/Delete";
import GenericService from "../../services/GenericService";
import Pagination from "../../components/Pagination"

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
    Pagination
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
    newObject() {
      this.$router.push({
        name: "documentosComercialesForm",
        params: { id: 0 },
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
