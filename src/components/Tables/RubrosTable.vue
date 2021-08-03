<template>
  <v-container style="min-width: 100%;">
    <v-form class="mb-0">
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
            v-model="filterParams.rubroName"
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
    <v-data-table :headers="headers" :items="rubros" class="elevation-6"  hide-default-footer>
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
    <Pagination
      :page="filterParams.page"
      :totalPages="filterParams.totalPages"
      :totalVisible="7"
      v-on:changePage="filterObjects"
      v-if="loaded"
    />
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
export default {
  data: () => ({
    editedItem: {
      nombre: "",
    },
    filterParams: {
      rubroName: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    headers: [
      { text: "Id", value: "id" },
      { text: "Nombre", value: "nombre" },
      { text: "Acciones", value: "acciones", sortable: false },
    ],
    rubros: [],
    loaded: false,
    tenant: "",
    service: "rubros",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
  }),
  components: {},
  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterObjects();
  },
  methods: {
    filterObjects(page) {
      if (page) this.filterParams.page = page;
      GenericService(this.tenant, "rubros", this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.rubros = data.data.content;
          console.log(this.rubros);
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },
    newObject() {
      this.$router.push({ name: "rubrosForm", params: { id: 0 } });
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
