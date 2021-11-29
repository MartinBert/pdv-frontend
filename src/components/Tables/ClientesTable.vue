<template>
  <v-container style="min-width: 100%;">
    <v-form class="mb-0">
      <v-row>
        <v-col>
          <v-btn class="primary" @click="newObject()" raised>Nuevo</v-btn>
        </v-col>
        <v-col cols="5"></v-col>
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.personaSocialReason"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            placeholder="Razón social"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.personaName"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            placeholder="Nombre"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.personaCuit"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            placeholder="Cuit"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <v-data-table :headers="headers" :items="clientes" class="elevation-6" hide-default-footer>
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
import Pagination from "../Pagination";
import GenericService from "../../services/GenericService";
import Edit from "../Buttons/Edit";
import Delete from "../Buttons/Delete";
import Detail from "../Buttons/Detail";
export default {
  data: () => ({
    clientes: [],
    filterParams: {
      sucursalId: "",
      nombreRegion:"",
      nombreEstado:"",
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
    service: "clientes",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    headers: [
      { text: "Nombre", value: "nombre" },
      { text: "Razon Social", value: "razonSocial" },
      { text: "Cuit", value: "cuit" },
      {text:"Localidad", value:"pais", sortablae:false},
      { text: "Detalles", value: "detalles", sortable:false},
      { text: "Acciones", value: "acciones" , sortable:false},
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
          this.clientes = data.data.content;
          console.log(this.clientes.pais);
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },
    newObject() {
      this.$router.push({ name: "clientesForm", params: { id: 0 } });
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
