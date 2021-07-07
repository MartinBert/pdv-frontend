<template>
  <v-container style="min-width: 100%;">
    <v-form style="justify-content: center;">
      <v-row>
        <v-col>
          <v-autocomplete
            :items="depositos"
            item-text="nombre"
            item-value="id"
            label="Depósito"
            v-model="typeList"
            @change="filterObjects()"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="filterParams.productoName"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            class="text-left mt-2"
            label="Nombre"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="filterParams.productoCodigo"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            class="text-left mt-2"
            label="Codigo"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="filterParams.productoCodigoBarras"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            class="text-left mt-2"
            label="Codigo de barras"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="filterParams.productoMarcaName"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            class="text-left mt-2"
            label="Marca"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="filterParams.productoPrimerAtributoName"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            class="text-left mt-2"
            label="Atributo"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-autocomplete
            :items="realDeposits"
            item-text="nombre"
            :return-object="true"
            label="A depósito"
            v-model="destinationDepositForMigrations"
            required
            style="width: 250px"
          />
        </v-col>
        <v-col>
          <form
            @submit.prevent="migrateStockToOtherDeposit()"
            style="margin: 10px;"
          >
            <v-btn class="primary" type="submit">Migrar seleccionados</v-btn>
          </form>
        </v-col>
      </v-row>
    </v-form>
    <v-data-table :headers="headers" :items="stock" class="elevation-6">
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
      { text: "Productos", value: "producto.nombre" },
      { text: "Atributos", value: "producto.atributos[0].valor" },
      { text: "Marca", value: "producto.marca.nombre" },
      { text: "Codigo de Barras", value: "producto.codigoBarra" },
      { text: "Codigo de producto", value: "producto.codigoProducto" },
      { text: "Cantidad", value: "cantidad" },
      { text: "Acciones", value: "acciones", sorteable: false },
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
