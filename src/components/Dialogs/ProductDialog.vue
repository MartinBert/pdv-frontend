<template>
  <v-dialog
    v-model="$store.state.productos.dialogProd"
    scrollable
    max-width="1200px"
  >
    <v-card color="var(--main-bg-color)">
      <v-card-title>
        <v-row>
          <v-col class="mt-5">
            <h3>Búsqueda de productos</h3>
          </v-col>
          <v-spacer></v-spacer>
          <v-col>
            <v-autocomplete
              :items="typeProductsList"
              v-model="typeList"
              item-text="text"
              item-value="id"
              label="Lista en la que buscar productos"
              @change="filterObjects()"
            />
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col></v-col>
          <v-col cols="2">
            <v-text-field
              v-model="filterParams.productos.productoName"
              dense
              outlined
              rounded
              label="Nombre"
              @input="filterObjects()"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="filterParams.productos.productoCodigo"
              dense
              outlined
              rounded
              label="Codigo de producto"
              @input="filterObjects()"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="filterParams.productos.productoCodigoBarras"
              dense
              outlined
              rounded
              label="Codigo de barras"
              @input="filterObjects()"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="filterParams.productos.productoMarcaName"
              dense
              outlined
              rounded
              label="Marca"
              @input="filterObjects()"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="filterParams.productos.productoPrimerAtributoName"
              dense
              outlined
              rounded
              label="Atributo"
              @input="filterObjects()"
            ></v-text-field>
          </v-col>
          <v-col></v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-simple-table style="background-color: transparent" ref="pTable">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>Elegir</th>
                    <th>Producto</th>
                    <th>Marca</th>
                    <th>Atributos</th>
                    <th>Código de barras</th>
                    <th>Código de producto</th>
                    <th v-if="typeList !== 0">Cantidad en stock</th>
                  </tr>
                </thead>
                <tbody v-for="producto in productos" :key="producto.id">
                  <tr>
                    <td>
                      <v-checkbox
                        v-model="producto.selected"
                        @change="checkProduct(producto.id)"
                      ></v-checkbox>
                    </td>
                    <td>{{ producto.nombre }}</td>
                    <td>{{ producto.marca.nombre }}</td>
                    <td>{{ setAtributesValues(producto.atributos) }}</td>
                    <td>{{ producto.codigoBarra }}</td>
                    <td>{{ producto.codigoProducto }}</td>
                    <td v-if="typeList !== 0">{{ producto.cantidad }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <Pagination
              :page="filterParams.productos.page"
              :totalPages="filterParams.productos.totalPages"
              :totalVisible="7"
              v-on:changePage="filterObjects"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-end">
            <v-btn class="primary" @click="loadProducts()"
              >CARGAR PRODUCTOS</v-btn
            >
            <v-btn class="default ml-1 mr-3" @click="clearSelection()"
              >LIMPIAR</v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import GenericService from "../../services/GenericService";
import StocksService from "../../services/StocksService";
import Pagination from "../Pagination";
export default {
  props: {
    refreshListStatus: Number,
  },

  data() {
    return {
      productos: [],
      typeList: 0,
      typeProductsList: [],
      tenant: "",
      service: "",
      token: localStorage.getItem("token"),
      loguedUser: JSON.parse(localStorage.getItem("userData")),
      filterParams: {
        productos: {
          stockDepositoId: "",
          productoName: "",
          productoCodigo: "",
          productoCodigoBarras: "",
          productoMarcaName: "",
          productoPrimerAtributoName: "",
          productoSegundoAtributoName: "",
          productoTercerAtributoName: "",
          productoEstado: 1,
          sucursalId: "",
          perfilId: "",
          page: 1,
          size: 5,
          totalPages: 0,
        },
        depositos: {
          perfilId: "",
          sucursalId: "",
          depositoName: "",
          page: 1,
          size: 100000,
        },
      },
    };
  },

  components: {
    Pagination,
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.generalAsignation();
    this.createtypeProductsList();
    this.filterObjects(this.typeList);
  },

  watch: {
    refreshListStatus() {
      this.productos.filter((el) => {
        if (this.refreshListStatus === 999999999) {
          el.selected = false;
        } else {
          if (el.id === this.refreshListStatus) {
            el.selected = false;
          }
        }
      });
      this.$emit("resetListStatus");
    },
  },

  methods: {
    generalAsignation() {
      this.filterParams.productos.perfilId = this.loguedUser.perfil;
      this.filterParams.depositos.perfilId = this.loguedUser.perfil;
      if (this.loguedUser.perfil > 1) {
        this.filterParams.depositos.sucursalId = this.loguedUser.sucursal.id;
        this.filterParams.productos.sucursalId = this.loguedUser.sucursal.id;
      }
    },

    filterObjects(page) {
      if (page) this.filterParams.productos.page = page;
      if (this.typeList === 0) {
        this.generalSearch();
      } else {
        this.searchForDeposit(this.typeList);
      }
    },

    generalSearch() {
      GenericService(this.tenant, "productos", this.token)
        .filter(this.filterParams.productos)
        .then((data) => {
          this.productos = data.data.content;
          this.filterParams.productos.totalPages = data.data.totalPages;
          if (
            this.filterParams.productos.totalPages <
            this.filterParams.productos.page
          ) {
            this.filterParams.productos.page = 1;
          }
          this.loaded = true;
        });
    },

    searchForDeposit(typeList) {
      this.filterParams.productos.stockDepositoId = typeList;
      StocksService(this.tenant, "stock", this.token)
        .filterStockForDepositId(this.filterParams.productos)
        .then((data) => {
          this.productos = data.data.content.map((el) => {
            el.producto.cantidad = el.cantidad;
            return el.producto;
          });
          this.filterParams.productos.totalPages = data.data.totalPages;
          if (
            this.filterParams.productos.totalPages <
            this.filterParams.productos.page
          ) {
            this.filterParams.productos.page = 1;
          }
          this.loaded = true;
        });
    },

    createtypeProductsList() {
      GenericService(this.tenant, "depositos", this.token)
        .filter(this.filterParams.depositos)
        .then((data) => {
          this.typeProductsList.push({
            id: 0,
            text: "Lista general de productos",
          });
          data.data.content.forEach((el) => {
            this.typeProductsList.push({ id: el.id, text: el.nombre });
          });
        });
    },

    loadProducts() {
      this.$emit("productList", this.$store.state.productos.products);
      this.$forceUpdate();
      this.$store.commit("productos/dialogProductosMutation");
    },

    clearSelection() {
      this.productos.filter((el) => {
        if (el.selected === true) {
          el.selected = false;
        }
      });
      this.$store.commit("productos/clearProductsState");
      this.$store.commit("productos/dialogProductosMutation");
    },

    checkProduct(id) {
      const productosFiltrados = this.productos.filter((el) => el.id === id)[0];
      if (productosFiltrados.selected) {
        productosFiltrados.cantUnidades = 1;
        productosFiltrados.total = productosFiltrados.precioTotal;
        this.$store.commit("productos/addProductsToList", productosFiltrados);
      } else {
        this.$store.commit("productos/removeProductsToList", id);
      }
    },

    checkSelected() {
      this.productos.forEach((el) => {
        el.selected = false;
      });
      this.$store.state.productos.products.forEach((el) => {
        this.productos.filter((e) => e.id == el.id)[0].selected = true;
      });
      this.$refs.pTable.$forceUpdate();
    },

    setAtributesValues(atributes) {
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
