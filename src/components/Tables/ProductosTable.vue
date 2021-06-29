<template>
  <v-container style="max-width:100%">
    <v-data-table class="elevation-6" :headers="headers" :items="productos">
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
import Edit from "../Buttons/Edit";
import Delete from "../Buttons/Delete";
import Add from "../Buttons/Add";
import GenericService from "../../services/GenericService";

export default {
  data() {
    return {
      editedItem: {
      nombre: "",
      codigoBarra:0,
      codigoProducto:0,
      atributo:"",
      costoBruto:0,
      precioTotal:0,

    },
      components: {
        Edit,
        Delete,
        Add,
      },
      headers: [
        {
          text: "Nombre",
          align: "start",
          value: "nombre",
        },
        { text: "Codigo de barra", value: "codigoBarra" },
        { text: "Codigo de producto", value: "codigoProducto" },
        { text: "Atributos", value: "atributos[0].valor" },
        { text: "Marca", value: "marca.nombre" },
        { text: "Costo Bruto", value: "costoBruto" },
        { text: "Costo Total", value: "precioTotal" },
        { text: "Acciones", value: "acciones", sortable: false },
      ],
      filterParams: {
        productoName: "",
        productoCodigo: "",
        productoCodigoBarras: "",
        productoMarcaName: "",
        productoPrimerAtributoName: "",
        productoSegundoAtributoName: "",
        productoTercerAtributoName: "",
        page: 1,
        size: 10,
        totalPages: 0,
      },
      productos: [],
      loaded: false,
      tenant: "",
      idObject: "",
      service: "productos",
      token: localStorage.getItem("token"),
      dialogStock: false,
      loguedUser: JSON.parse(localStorage.getItem("userData")),
      checkImportStatus: 0,
      deleteDialogStatus: false,
    };
  },
  mounted() {
    this.tenant = this.$route.params.tenant;
    this.items();
  },

  methods: {
    items() {
      GenericService(this.tenant, "productos", this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.productos = data.data.content;
          console.log(this.productos);
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    editItem(itemId) {
      this.$emit("editItem", itemId);
    },
    deleteItem(itemId) {
      this.$emit("deleteItem", itemId);
    },
    add(object) {
      this.$emit("add", object);
    },
    setAttributesValues(atributes) {
      let str = atributes.reduce((acc, element) => {
        if (element.valor) {
          return acc + element.valor + ",";
        } else {
          return acc + element.valorNumerico.toString() + ",";
        }
      }, "");
      return str;
    },
  },
};
</script>

<style></style>
