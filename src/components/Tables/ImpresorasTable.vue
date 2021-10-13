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
        :items="impresoras"
        sort-by="calories"
        class="elevation-1"
        hide-default-footer
      >
        <template v-slot:[`item.impresoraPredeterminada`]="{ item, index }">
          <p v-show="viewCheckboxState === 1">
            {{
              item.impresoraPredeterminada
                ? (checkboxModel[index] = true)
                : (checkboxModel[index] = false)
            }}
          </p>
          <v-checkbox
            v-model="checkboxModel[index]"
            @change="selectDefaultPrinter(item)"
          ></v-checkbox>
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          <Edit :itemId="item.id" v-on:editItem="editItem" />
          <Delete :itemId="item.id" v-on:deleteItem="deleteItem" />
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script>
import Edit from "../../components/Buttons/Edit";
import Delete from "../../components/Buttons/Delete";
import GenericService from "../../services/GenericService";
export default {
  data: () => ({
    impresoras: [],
    itemss: ["80 mm ", "58 mm"],
    filterParams: {
      sucursalId: "",
      valor: "",
      nombreImpresora: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    viewCheckboxState: 0,
    checkboxModel: {},
    loaded: true,
    tenant: "",
    service: "impresoras",
    token: localStorage.getItem("token"),
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    headers: [
      { text: "Nombre", value: "nombreImpresora" },
      { text: "Ancho", value: "valor" },
      { text: "Impresora por defecto", value: "impresoraPredeterminada" },
      { text: "Acciones", value: "acciones", sortable: false },
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
    this.getObjects();
  },

  methods: {
    getObjects() {
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.impresoras = data.data.content;
          console.log(this.impresoras);
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },

    newObject() {
      this.$router.push({ name: "ImpresorasForm", params: { id: 0 } });
    },
    editItem(itemId) {
       this.$emit("editItem", itemId);
    },
    deleteItem(itemId) {
      this.$emit("deleteItem", itemId);
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    selectDefaultPrinter(printer) {
      this.impresoras.forEach((el) => {
        el.impresoraPredeterminada = false;
      });
      this.impresoras.filter(
        (el) => el.nombreImpresora === printer.nombreImpresora
      )[0].impresoraPredeterminada = true;
      GenericService(this.tenant, this.service, this.token)
        .saveAll(this.impresoras)
        .then(() => {
          this.getObjects();
        });
    },
  },
};
</script>
