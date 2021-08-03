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
    </v-row>
    <v-data-table
      class="elevation-6"
      :headers="headers"
      :items="productos"
      style="background-color: transparent"
      hide-default-footer
    >
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
      v-if="loaded"
    />
  </v-container>
</template>
<script>
import Pagination from "../../components/Pagination";
import Edit from "../Buttons/Edit";
import Delete from "../Buttons/Delete";
import GenericService from "../../services/GenericService";

export default {
  data() {
    return {
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
      service: "productos",
      token: localStorage.getItem("token"),
      loguedUser: JSON.parse(localStorage.getItem("userData")),
    };
  },

  components: {
    Delete,
    Edit,
    Pagination,
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
