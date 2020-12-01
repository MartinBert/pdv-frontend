<template>
    <v-dialog v-model="$store.state.productos.dialogProd" scrollable max-width="900px" @input="refresh()">
      <v-card height="780px">
        <v-card-title>
          <v-row>
            <v-col>
                <h2>Búsqueda de productos</h2>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
        <v-text-field
          v-model="filterString"
          v-on:input="filterObjects(filterString, paginate.page - 1, paginate.size)"
          dense
          outlined
          rounded
          class="text-left ml-5 mr-5 mt-5"
          label="Escriba el nombre, código de artículo o código de barras del artículo que desea buscar"
          placeholder=" "
          append-icon="mdi-magnify"
        ></v-text-field>
        <v-divider></v-divider>
          <v-container fluid>
            <v-row>
              <v-col>
                <v-simple-table style="background-color: transparent">
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
                  @input="filterObjects(filterString, paginate.page - 1, paginate.size)"
                  v-if="paginate.totalPages > 1"
                ></v-pagination>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>
<script>
import GenericService from "../services/GenericService";
export default {
  name: "ProductDialog",

  data(){
    return {
      productos: [],
      filterString: "",
      paginate: {
        page: 1,
        size: 7,
        totalPages: 0
      }
    }
  },

  mounted(){
    this.tenant = this.$route.params.tenant;
    this.token = localStorage.getItem('token');
    this.filterObjects(this.filterString, this.paginate.page - 1, this.paginate.size);
  },

  methods:{
    filterObjects(param, page, size) {
      this.loaded = false;
      
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

    refresh(){
      this.$store.commit('productos/resetStates');
      this.filterObjects(this.filterString, this.paginate.page - 1, this.paginate.size);
    }
  }
}
</script>
