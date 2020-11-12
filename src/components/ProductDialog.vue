<template>
    <v-dialog v-model="$store.state.productos.dialogProd" scrollable max-width="900px" @input="refresh()">
      <v-card>
        <v-card-title>
          <v-row>
            <v-col>
                <h2>Seleccione un parámetro para realizar la búsqueda</h2>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-radio-group class="ml-5 mr-5" v-model="radioGroup">
          <v-row>
            <v-col>
              <v-radio label="Nombre" value="nombre"></v-radio>
            </v-col>
            <v-col>
              <v-radio
                label="Código de barras"
                value="codigodebarras"
              ></v-radio>
            </v-col>
            <v-col>
              <v-radio
                label="Código de producto"
                value="codigodeproducto"
              ></v-radio>
            </v-col>
          </v-row>
        </v-radio-group>
        <v-text-field
          v-if="radioGroup"
          v-model="filterString"
          v-on:input="filterObjects(filterString, radioGroup)"
          dense
          outlined
          rounded
          class="text-left ml-5 mr-5"
          placeholder="Búsqueda"
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
      radioGroup: "",
      filterString: ""
    }
  },

  mounted(){
    this.tenant = this.$route.params.tenant;
    this.token = localStorage.getItem('token');
    this.getAllProducts();
  },

  methods:{
    filterObjects(filter, radio) {
      var filt = {};
      switch (radio) {
        case "nombre":
          filt = { nombre: filter };
          break;
        case "codigodebarras":
          filt = { codigoBarra: filter };
          break;
        default:
          filt = { codigoProducto: filter };
          break;
      }

      GenericService(this.tenant, "productos", this.token)
        .filter(filt)
        .then((data) => {
          this.productos = data.data.content;
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

    getAllProducts(){
      GenericService(this.tenant, "productos", this.token)
        .getAll(this.page, this.size)
        .then((data) => {
        this.productos = data.data.content;
      });
    },

    refresh(){
      this.$store.commit('productos/resetStates');
      this.getAllProducts();
    }
  }
}
</script>
