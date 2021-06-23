<template>
  <v-container>
    <v-data-table :headers="headers" :items="marcas">
      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title class="text-h5"
            >Are you sure you want to delete this item?</v-card-title
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDelete"
              >Cancel</v-btn
            >
            <v-btn color="blue darken-1" text @click="deleteItemConfirm"
              >OK</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <td>
        <Edit :itemId="marcas.id" v-on:editItem="editItem" />
        <Delete :itemId="marcas.id" v-on:deleteItem="deleteItem" />
      </td>
    </v-data-table>
  </v-container>
</template>

<script>
import GenericService from "../../services/GenericService";

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    filterParams: {
      marcaName: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    marcas: [],
    loaded: false,
    tenant: "",
    service: "marcas",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    headers: [
      {
        text: "Nombre",
        align: "start",
        value: "nombre",
      },
      { text: "Acciones", value: "acciones", sortable: false},
    ],
  }),

  components: {},
  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterObjects();
  },
  methods: {
    filterObjects(page) {
      if (page) this.filterParams.page = page;
      GenericService(this.tenant, "marcas", this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.marcas = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },
  },
  editItem(marcasId) {
    this.$emit("editItem", marcasId);
  },
  deleteItem(marcasId) {
    this.$emit("deleteItem", marcasId);
  },

  deleteItemConfirm() {
    this.marcas.splice(this.editedIndex, 1);
    this.closeDelete();
  },

  close() {
    this.dialog = false;
    this.$nextTick(() => {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    });
  },

  closeDelete() {
    this.dialogDelete = false;
    this.$nextTick(() => {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    });
  },
};
</script>
