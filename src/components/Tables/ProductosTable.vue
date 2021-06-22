<template>
  <v-container>
    <v-data-table class="elevation-8" :headers="headers" :items="productos">
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
        { text: "Atributos", value: "atributos" },
        { text: "Marca", value: "marca.nombre" },
        { text: "Costo Bruto", value: "costoBruto" },
        { text: "Costo Total", value: "costoTotal" },
      ],
      filterParams: {
        sucursalId: "",
        productoName: "",
        productoCodigo: "",
        productoCodigoBarras: "",
        productoMarcaName: "",
        productoPrimerAtributoName: "",
        productoSegundoAtributoName: "",
        productoTercerAtributoName: "",
        productoEstado: "",
        page: 1,
        size: 10,
        totalPages: 0,
      },
      //productos: [],
      loaded: false,
      tenant: "",
      idObject: "",
      service: "productos",
      token: localStorage.getItem("token"),
      dialogStock: false,
      loguedUser: JSON.parse(localStorage.getItem("userData")),
      checkImportStatus: 0,
      deleteDialogStatus: false,

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
      productos: [
        {
          nombre: "asdasdsa",
          codigoBarra: "12324324",
          codigoProducto: "234324234",
          costoTotal: "400000",
        },
        {
          nombre: "basas",
          codigoBarra: "32324324",
          codigoProducto: "434324234",
          costoTotal: "300000",
        },
        {
          nombre: "casas",
          codigoBarra: "42324324",
          codigoProducto: "534324234",
          costoTotal:"5000000"
        },
      ],
    };
  },
};
</script>

<style>
b {
  color: black;
}
</style>
