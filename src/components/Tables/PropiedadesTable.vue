<template>
  <v-container>
    <v-data-table :headers="headers" :items="propiedades">
      <v-dialog v-model="dialog" max-width="500px">
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="save">
            Save
          </v-btn>
        </v-card-actions>
      </v-dialog>
      <template v-slot:[`item.acciones`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">
          Reset
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
export default {
  data:()=>({
    propiedades: [],
     editedItem: {
      nombre: "",
    },
    filterParams: {
      propiedadName: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    headers:[
      {text:"Id", value:"id"},
      {text:"Nombre",value:"nombre"},
      {text:"Atributos", value:"atributos[0].valor"},
      {text:"Acciones", value:"acciones", sorteable: false}

    ],
    loaded: false,
    tenant: "",
    service: "propiedades",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
  }),
  components: {

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
          this.propiedades = data.data.content;
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