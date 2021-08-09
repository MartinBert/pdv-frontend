<template>
  <v-container style="min-width: 100%;">
    <v-data-table :headers="headers" :items="productos" class="elevation-6" ref="stockTable">
      <template v-slot:[`item.acciones`]="{ item }">
        
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import StocksService from "../../services/StocksService";
export default {
  data: () => ({
    stocks: [],
    productos:[],
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
    depositosFilterParams: {
      depositoName: "",
      perfilId: "",
      sucursalId: "",
      page: 1,
      size: 100000,
    },
    headers: [
      { text: "Productos", value: "producto.nombre" },
      { text: "Atributos", value: "producto.atributos[0].valor" },
      { text: "Marca", value: "producto.marca.nombre" },
      { text: "Codigo de Barras", value: "producto.codigoBarra" },
      { text: "Codigo de producto", value: "producto.codigoProducto" },
      { text: "Cantidad", value: "cantidad" },
      { text: "Acciones", value: "acciones", sorteable: false },
    ],
    perfil:"",
    perfilId:"",
    loaded: false,
    tenant: "",
    service: "productos",
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
   
    // if (this.loguedUser.perfil > 1) {
      //this.filterParams.sucursalId = this.loguedUser.sucursal.id;
      //this.depositsFilterParams.sucursalId = this.loguedUser.sucursal.id;
    //}
    this.getOtherModels();
    this.search();
  },
  methods: {
    search() {
      GenericService(this.tenant, "productos", this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.productos = data.data.content;
          if (this.migration.length > 0) {
            this.migration.filter((el) => {
              this.productos.filter((e) => {
                if (el.id === e.id) {
                  e.selected = true;
                }
              });
            });
          }
          this.filterParams.totalPages = data.data.totalPages;
          if (this.filterParams.totalPages < this.filterParams.page) {
            this.filterParams.page = 1;
          }
          this.loaded = true;
        });
    },

    searchForDeposit(typeList) {
      this.filterParams.stockDepositoId = typeList;
      StocksService(this.tenant, this.service, this.token)
        .filterStockForDepositId(this.filterParams)
        .then((data) => {
          this.stocks = data.data.content;
          if (this.migration.length > 0) {
            this.migration.filter((el) => {
              this.stocks.filter((e) => {
                if (el.id === e.id) {
                  e.selected = true;
                }
              });
            });
          }
          this.filterParams.totalPages = data.data.totalPages;
          if (this.filterParams.totalPages < this.filterParams.page) {
            this.filterParams.page = 1;
          }
          this.loaded = true;
        });
    },
    getOtherModels() {
      GenericService(this.tenant, "depositos", this.token)
        .filter(this.depositosFilterParams)
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
    migrateStockToOtherDeposit() {
      if (this.migration.length > 0) {
        this.loaded = false;
        this.migration.forEach((el) => {
          el.deposito = this.destinationDepositForMigrations;
          el.algorim = el.producto.codigoBarra + el.deposito.id;
          GenericService(this.tenant, this.service, this.token).update(el);
        });

        this.saveHistorial(this.migration, "Migración de productos");

        this.migration = [];
        this.destinationDepositForMigrations = {};

        setTimeout(() => {
          this.filterObjects(this.typeList);
        }, 500);
      } else {
        this.$errorAlert(
          "Debe seleccionar al menos 1 producto para migrar su stock de depósito"
        );
      }
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
