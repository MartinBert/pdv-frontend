<template>
    <v-dialog v-model="$store.state.productos.dialogProd" scrollable max-width="900px">
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
                @change="filterObjects(filterString, paginate.page - 1, paginate.size, typeList)"
              />
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="10">
              <v-text-field
                v-model="filterString"
                dense
                outlined
                rounded
                class="text-left ml-5 mr-5 mt-5"
                label="Escriba el nombre, código de artículo o código de barras del artículo que desea buscar"
                placeholder=" "
                @keypress.enter="filterObjects(filterString, paginate.page - 1, paginate.size, typeList)"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-btn class="mt-5 primary"
                @click="filterObjects(filterString, paginate.page - 1, paginate.size, typeList)"
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
                        <th>Código de barras</th>
                        <th>Código de producto</th>
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
                        <td>{{ producto.codigoBarra }}</td>
                        <td>{{ producto.codigoProducto }}</td>
                      </tr>
                    </tbody>
                  </template>
                  
                </v-simple-table>
                <v-pagination
                  v-model="paginate.page"
                  :length="paginate.totalPages"
                  next-icon="mdi-chevron-right"
                  prev-icon="mdi-chevron-left"
                  :page="paginate.page"
                  :total-visible="8"
                  @input="filterObjects(filterString, paginate.page - 1, paginate.size, typeList)"
                  v-if="paginate.totalPages > 1"
                ></v-pagination>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="text-end">
                <v-btn class="success">CARGAR PRODUCTOS</v-btn>
                <v-btn class="error ml-1">LIMPIAR</v-btn>
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

  data(){
    return {
      productos: [],
      typeList: 1,
      typeProductsList: [],
      filterString: "",
      paginate: {
        page: 1,
        size: 5,
        totalPages: 0
      }
    }
  },

  mounted(){
    this.tenant = this.$route.params.tenant;
    this.token = localStorage.getItem('token');
    this.loguedUser = JSON.parse(localStorage.getItem("userData"));
    this.filterObjects(this.filterString, this.paginate.page - 1, this.paginate.size, this.typeList);
    this.createtypeProductsList();
  },

  methods:{
    filterObjects(param, page, size, typeList) {
      this.loaded = false;
      
      if(typeList === 1){
        console.log('passed');
        this.generalSearch(param, page, size);
      }else{
        this.searchForDeposit(param, page, size, typeList);
      }
      
    },

    checkProduct(id) {
      const productosFiltrados = this.productos.filter((el) => el.id === id)[0];
      if (productosFiltrados.selected) {
        productosFiltrados.cantUnidades = 1;
        productosFiltrados.total = productosFiltrados.precioTotal;
        this.$store.commit('productos/addProductsToList', productosFiltrados);
        this.$emit('productList', this.$store.state.productos.products);
      } else {
        this.$store.commit('productos/removeProductsToList', id);
        this.$emit('productList', this.$store.state.productos.products);
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

    generalSearch(param, page, size){
      GenericService(this.tenant, 'productos', this.token)
        .filter({ param, page, size })
        .then(data => {
          this.productos = data.data.content;
          this.paginate.totalPages = data.data.totalPages;
          if(this.paginate.totalPages < this.paginate.page){
              this.paginate.page = 1;
          }
          this.loaded = true;
        });
    },

    searchForDeposit(param, page, size, typeList){
      const idParam = typeList;
      let id;
      if(this.loguedUser.perfil < 3){
        id = ""
      }else{
        id = this.loguedUser.sucursal.id;
      }

      StocksService(this.tenant, 'stock', this.token)
      .filterStockForDepositId({id, param, page, size, idParam})
      .then(data => {
        console.log(data);
        this.productos = data.data.content.map(el => el.producto);
        this.paginate.totalPages = data.data.totalPages;
        if(this.paginate.totalPages < this.paginate.page){
            this.paginate.page = 1;
        }
        this.loaded = true;
      });
    },

    createtypeProductsList(){
      let id;
      if(this.loguedUser.perfil < 3){
        id = ""
      }else{
        id = this.loguedUser.sucursal.id;
      }

      GenericService(this.tenant, 'depositos', this.token)
      .filter({id: id, param: '', page: 0, size: 100000})
      .then(data => {
        this.typeProductsList.push({id: 1, text: 'Lista general de productos'});
        data.data.content.forEach(el => {
          this.typeProductsList.push({id: el.id, text: el.nombre});
        })
      })
    }
  }
}
</script>
