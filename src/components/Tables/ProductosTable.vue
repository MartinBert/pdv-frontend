<template>
  <v-container style="max-width:100%">
    <v-row style="justify-content: center;" class="mt-1">
      <v-col cols="2">
        <v-text-field
          v-model="filterParams.productoName"
          v-on:input="filterObjects()"
          dense
          outlined
          rounded
          class="text-left"
          label="Nombre de producto"
          append-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field
          v-model="filterParams.productoCodigo"
          v-on:input="filterObjects()"
          dense
          outlined
          rounded
          class="text-left"
          label="Codigo de producto"
          append-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field
          v-model="filterParams.productoCodigoBarras"
          v-on:input="filterObjects()"
          dense
          outlined
          rounded
          class="text-left"
          label="Codigo de barras"
          append-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field
          v-model="filterParams.productoMarcaName"
          v-on:input="filterObjects()"
          dense
          outlined
          rounded
          class="text-left"
          label="Marca"
          append-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field
          v-model="filterParams.productoPrimerAtributoName"
          v-on:input="filterObjects()"
          dense
          outlined
          rounded
          class="text-left"
          label="Atributo"
          append-icon="mdi-magnify"
        />
      </v-col>
      <v-col v-if="view == 'labelPrinting'">
        <h2>Seleccion de productos</h2>
      </v-col>
    </v-row>
    <v-data-table class="elevation-6" :headers="headers" :items="productos">
      <v-dialog v-model="dialog" max-width="500px">
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1">
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
        codigoBarra: 0,
        codigoProducto: 0,
        atributo: "",
        costoBruto: 0,
        precioTotal: 0,
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
    this.filterObjects();
  },

  methods: {
    filterObjects() {
      GenericService(this.tenant, "productos", this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.productos = data.data.content;
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
