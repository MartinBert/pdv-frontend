<template>
  <v-container>
    <v-data-table :headers="headers" :items="stock">
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
  data: () => ({
    stock: [],
    filterParams: {
      productoName: "",
      productoCodigo: "",
      productoCodigoBarras: "",
      productoMarcaName: "",
      productoPrimerAtributoName: "",
      productoSegundoAtributoName: "",
      productoTercerAtributoName: "",
      productoEstado: 0,
      stockDepositoId: "",
      sucursalId: "",
      perfilId: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    depositsFilterParams: {
      depositoName: "",
      perfilId: "",
      sucursalId: "",
      page: 1,
      size: 100000,
    },
    headers: [
      {text: "Productos", value: "producto.nombre" },
      {text:"Atributos", value:"producto.atributos[0].valor"},
      {text:"Marca", value:"producto.marca.nombre"},
      {text:"Codigo de Barras", value:"producto.codigoBarra"},
      {text:"Codigo de producto", value:"producto.codigoProducto"},
      {text:"Cantidad", value:"cantidad"},
      {text:"Acciones", value:"acciones" , sorteable: false}
    
    ],
    loaded: false,
    tenant: "",
    service: "stock",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    depositos: [],
    realDeposits: [],
    typeList: 0,
    migration: [],
    destinationDepositForMigrations: {},
  }),
  mounted() {
    this.tenant = this.$route.params.tenant;
    this.items();
    this.getOtherModels();
  },
  methods: {
    items() {
      GenericService(this.tenant, "stock", this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.stock = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },
    getOtherModels() {
      GenericService(this.tenant, "depositos", this.token)
        .filter(this.depositsFilterParams)
        .then((data) => {
          this.depositos = data.data.content;
          this.depositos.push({
            id: 0,
            nombre: "Todos",
          });
          this.realDeposits = this.depositos.filter((el) => el.id !== 0);
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
    uncheck(object) {
      this.$emit("uncheck", object);
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
