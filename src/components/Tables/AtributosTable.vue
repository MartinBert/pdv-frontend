<template>
  <v-container style="min-width: 100%;">
    <v-data-table :headers="headers" :items="atributos" class="elevation-6">
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
import GenericService from "../../services/GenericService";
export default {
  data: () => ({
    editedItem: {
      valor: "",
      valorNumerico: 0,
    },
    atributos: [],
    headers: [
      { text: "Id", value: "id" },
      { text: "Text", value: "valor" },
      { text: "Valor Numerico", value: "valorNumerico" },
      { text: "Acciones", value: "acciones", sortable: false },
    ],
    filterParams: {
      atributoValor: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "atributos",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
  }),

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.items();
  },
  methods: {
    items(page) {
      if (page) this.filterParams.page = page;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.atributos = data.data.content;
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

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.atributos[this.editedIndex], this.editedItem);
      } else {
        this.atributos.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>
