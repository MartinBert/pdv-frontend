<template>
  <v-container>
    <v-card min-width="100%">
      <h1 style="text-align: center;">Configuracion Impresora</h1>
      <v-col>
        <v-btn class="primary" raised @click="newObject()">Nuevo</v-btn>
      </v-col>
      <v-row>
        <v-col cols="12">
          <div class="horizontalSeparator"></div>
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="desserts"
        sort-by="calories"
        class="elevation-1"
        hide-default-footer
      ></v-data-table>
      <template >

      </template>
    </v-card>
    <Spinner v-if="!loaded" />
  </v-container>
</template>
<script>
import ImpresoraTable from "../../components/Tables/ImpresorasTable";
import Spinner from "../../components/Graphics/Spinner";
export default {
  data: () => ({
    itemss: ["80 mm ", "58 mm"],
    filterParams: {
      sucursalId: "",
      valor: "",
      nombreImpresora: "",
    },
    loaded: false,
    tenant: "",
    service: "",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "Nombre", value: "nombre" },
      { text: "Ancho", value: "ancho" },
      { text: "Impresora por defecto", value: "impresora" },
      { text: "Acciones", value: "acciones", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      nombre: "",
      ancho: 0,
    },
    defaultItem: {
      nombre: "",
      ancho: 0,
    },
    components: {
      ImpresoraTable,
      Spinner,
    },
 }),
    mounted() {
      this.tenant = this.$route.params.tenant;
    },
    methods: {
      initialize() {
        this.desserts = [
          {
            nombre: "KitKat",
            ancho: 518,
          },
        ];
      },

      newObject() {
        this.$router.push({ name: "ImpresorasForm", params: { id: 0 } });
      },

      editItem(item) {
        this.editedIndex = this.desserts.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },

      deleteItem(item) {
        this.editedIndex = this.desserts.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
      },

      deleteItemConfirm() {
        this.desserts.splice(this.editedIndex, 1);
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

      save() {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem);
        } else {
          this.desserts.push(this.editedItem);
        }
        this.close();
      },
    },

      computed: {
      formTitle() {
        return this.editedIndex === -1 ? "New Item" : "Edit Item";
      },
    },

    watch: {
      dialog(val) {
        val || this.close();
      },
      dialogDelete(val) {
        val || this.closeDelete();
      },
    },

    created() {
      this.initialize();
    },
};
</script>
