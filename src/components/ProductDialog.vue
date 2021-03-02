<template>
    <v-dialog v-model="$store.state.productos.dialogProd" scrollable max-width="1200px">
      <v-card height="780px">
        <v-card-title>
          <v-row>
            <v-col cols="6">
                <h3>Búsqueda de productos</h3>
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                :items="typeProductsList"
                v-model="typeList"
                item-text="text"
                item-value="id"
                label="Lista en la que buscar productos"
                @change="filterObjects(filterParams, typeList)"
              />
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="5">
              <v-text-field
                v-model="filterParams.stringParam"
                dense
                outlined
                rounded
                class="text-left ml-5 mr-5 mt-5"
                label="Nombre, código de artículo, código de barras"
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="filterParams.thirdStringParam"
                dense
                outlined
                rounded
                class="text-left ml-5 mr-5 mt-5"
                label="Marca"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-btn class="mt-5 primary"
                @click="filterObjects(filterParams, typeList)"
              >
                BUSCAR
              </v-btn>
            </v-col>
          </v-row>
          <v-container fluid>
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
                        <td>{{setAtributesValues(producto.atributos)}}</td>
                        <td>{{ producto.codigoBarra }}</td>
                        <td>{{ producto.codigoProducto }}</td>
                        <td v-if="typeList !== 0">{{producto.cantidad}}</td>
                      </tr>
                    </tbody>
                  </template>
                  
                </v-simple-table>
                <v-pagination
                  v-model="filterParams.page"
                  :length="filterParams.totalPages"
                  next-icon="mdi-chevron-right"
                  prev-icon="mdi-chevron-left"
                  :page="filterParams.page"
                  :total-visible="8"
                  @input="filterObjects(filterParams, typeList)"
                  v-if="filterParams.totalPages > 1"
                ></v-pagination>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="text-end">
                <v-btn class="success" @click="loadProducts()">CARGAR PRODUCTOS</v-btn>
                <v-btn class="error ml-1" @click="clearSelection()">LIMPIAR</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>
<script>
import GenericService from "../services/GenericService";
import StocksService from "../services/StocksService";
export default {
  name: "ProductDialog",

  props:{
    refreshListStatus: Number,
  },

  data(){
    return {
      productos: [],
      typeList: 0,
      typeProductsList: [],
      filterParams: {
        idPerfil: "",
        idParam: "",
        idSucursal: "",
        stringParam: "",
        thirdStringParam: "",
        doubleParam: 0,
        page: 1,
        size: 10,
        totalPages: 0
      },
    }
  },

  mounted(){
    this.tenant = this.$route.params.tenant;
    this.token = localStorage.getItem('token');
    this.loguedUser = JSON.parse(localStorage.getItem("userData"));
    this.filterParams.idPerfil = this.loguedUser.perfil;
    this.filterObjects(this.filterParams, this.typeList);
    this.createtypeProductsList();
  },

  watch:{
    refreshListStatus(){
      this.productos.filter(el => {
        if(this.refreshListStatus === 999999999){
          el.selected = false;
        }else{
          if(el.id === this.refreshListStatus){
            el.selected = false;
          }
        }
      })

      this.$emit('resetListStatus');
    }
  },

  methods:{
    filterObjects(filterParams, typeList) {
      this.loaded = false;
      
      if(typeList === 0){
        this.generalSearch(filterParams);
      }else{
        this.searchForDeposit(filterParams, typeList);
      }
      
    },

    checkProduct(id) {
      const productosFiltrados = this.productos.filter((el) => el.id === id)[0];
      if (productosFiltrados.selected) {
        productosFiltrados.cantUnidades = 1;
        productosFiltrados.total = productosFiltrados.precioTotal;
        this.$store.commit('productos/addProductsToList', productosFiltrados);
      } else {
        this.$store.commit('productos/removeProductsToList', id);
      }
    },

    checkSelected(){
      this.productos.forEach(el => {
        el.selected = false;
      })

      this.$store.state.productos.products.forEach(el => {
        this.productos.filter(e => e.id == el.id)[0].selected = true;
      })

      this.$refs.pTable.$forceUpdate();
    },

    generalSearch(filterParams){
      GenericService(this.tenant, 'productos', this.token)
        .filter(filterParams)
        .then(data => {
          this.productos = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          if(this.filterParams.totalPages < this.filterParams.page){
              this.filterParams.page = 1;
          }
          this.loaded = true;
        });
    },

    searchForDeposit(filterParams, typeList){
      filterParams.idParam = typeList;
      filterParams.idSucursal;
      
      switch (filterParams.idPerfil) {
        case 1:
            filterParams.idSucursal = '';
          break;
      
        default:
            filterParams.idSucursal = this.loguedUser.sucursal.id;
          break;
      }

      StocksService(this.tenant, 'stock', this.token)
      .filterStockForDepositId(filterParams)
      .then(data => {
        this.productos = data.data.content.map(el => {
          el.producto.cantidad = el.cantidad;
          return el.producto;
        });
        this.filterParams.totalPages = data.data.totalPages;
        if(this.filterParams.totalPages < this.filterParams.page){
            this.filterParams.page = 1;
        }
        this.loaded = true;
      });
    },

    createtypeProductsList(){
      const idPerfil = this.loguedUser.perfil;
      let idSucursal;
      
      switch (idPerfil) {
        case 1:
            idSucursal = '';
          break;
      
        default:
            idSucursal = this.loguedUser.sucursal.id;
          break;
      }

      GenericService(this.tenant, 'depositos', this.token)
      .filter({idPerfil, idSucursal, stringParam: '', page: 0, size: 100000})
      .then(data => {
        this.typeProductsList.push({id: 0, text: 'Lista general de productos'});
        data.data.content.forEach(el => {
          this.typeProductsList.push({id: el.id, text: el.nombre});
        })
      })
    },

    loadProducts(){
      this.$emit('productList', this.$store.state.productos.products);
      this.$store.commit('productos/dialogProductosMutation');
    },

    clearSelection(){
      this.productos.filter(el => {
        if(el.selected === true){
          el.selected = false;
        }
      });
      this.$store.commit('productos/clearProductsState');
      this.$store.commit('productos/dialogProductosMutation');
    },

    setAtributesValues(atributes){
      let str = atributes.reduce((acc, element) => {
        if(element.valor){
          return acc + element.valor + ",";
        }else{
          return acc + element.valorNumerico.toString() + ",";
        }
      }, "");

      return str;
    }
  }
}
</script>
