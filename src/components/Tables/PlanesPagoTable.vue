<template>
  <v-container style="min-width: 100%;">
    <v-form class="mb-0">
      <v-row>
        <v-col cols="1">
          <v-btn class="primary" @click="newObject()" raised>Nuevo</v-btn>
        </v-col>
        <v-col cols="3">
          <v-file-input
            v-model="file"
            class="mt-0"
            placeholder="Importar planes de pago"
            accept=".xlsx, xls"
            @change="importDocuments($event)"
          ></v-file-input>
        </v-col>
        <v-col cols="6"></v-col>
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.planPagoName"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            placeholder="Búsqueda"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <v-data-table :headers="headers" :items="planesPago" class="elevation-6">
      <template v-slot:[`item.acciones`]="{ item }">
        <Edit :itemId="item.id" v-on:editItem="editItem" />
        <Delete :itemId="item.id" v-on:deleteItem="deleteItem" />
      </template>
       <template v-slot:[`item.coutas`]="{item}">
         <Detail :objectsArray="item.planesPago" v-on:seeDetails="seeDetails" />
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import Detail from "../Buttons/Detail";
import Edit from "../Buttons/Edit";
import Delete from "../Buttons/Delete";
import GenericService from "../../services/GenericService";
export default {
  data: () => ({
    planesPago: [],
    file: null,
    filterParams: {
      sucursalId: "",
      planPagoName: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "planesPago",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    headers: [
      { text: "Nombre", value: "nombre" },
      { text: "Cantidad de coutas", value: "coutas"},
      { text: "Porcentaje de recargo", value: "porcentaje"},
      { text: "Accciones", value: "acciones", sortable: false },
    ],
  }),
  components: {
    Edit,
    Delete,
    Detail
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
          this.planesPago = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          if (this.filterParams.totalPages < this.filterParams.page) {
            this.filterParams.page = 1;
          }
          this.loaded = true;
          console.log(this.planesPago);
        });
    },
    newObject() {
      this.$router.push({ name: "planesPagoForm", params: { id: 0 } });
    },
    editItem(itemId) {
      this.$emit("editItem", itemId);
    },
    deleteItem(itemId) {
      this.$emit("deleteItem", itemId);
    },
    seeDetails(objects) {
      this.$emit("seeDetails", objects);
    }
  },
};
</script>
