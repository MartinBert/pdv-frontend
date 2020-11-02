<template>
  <v-card min-width="100%">
    <v-snackbar v-model="snackError" :color="'#E53935'" :timeout="3000" :top="true">{{errorMessage}}</v-snackbar>
    <div v-if="loaded">
      <v-form ref="form" v-model="valid" :lazy-validation="false" class="mt-5">
        <v-row>
          <v-col class="ma-5">
            <v-autocomplete
              :items="tiposOperacion"
              v-model="tipoOperacion"
              item-text="text"
              item-value="id"
              label="Tipo de operación"
              :rules="[v => !!v || 'Campo requerido...']"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row class="ma-1" v-if="tipoOperacion">
          <v-col cols="12">

          </v-col>
          <v-col>
            <v-text-field
              type="text"
              v-model="object.descripcion"
              :counter="50"
              label="Descripción"
              required
              :rules="[v => !!v || 'Campo requerido...']"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-radio-group class="ml-5 mr-5" v-model="radioGroup">
              <label>Seleccione un parámetro para realizar la búsqueda</label>
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
          </v-col>
          <v-col cols="12">
            <v-simple-table style="background-color: transparent">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th></th>
                    <th>Nombre</th>
                    <th>Código de barras</th>
                    <th>Código de producto</th>
                    <th>Precio de costo</th>
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
                    <td>${{ producto.precioCosto }}</td>
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
              @input="changePage(loguedUser.sucursal.id, paginate.page - 1, paginate.size)"
              v-if="paginate.totalPages > 1"
            ></v-pagination>
          </v-col>
        </v-row>
        <div class="ma-1">
          <v-col class="col-6">
            <v-btn class="mr-4" color="primary" @click="save" :disabled="!valid">Guardar</v-btn>
            <v-btn color="default" @click="back()">Cancelar</v-btn>
          </v-col>
        </div>
      </v-form>
    </div>
    <div v-if="!loaded">
      <v-row class="ma-1">
        <v-col class="col-12" style="text-align:center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script>
import GenericService from "../../services/GenericService";

export default {
  data: () => ({
    tiposOperacion: [
      {id: 1, text: "Devolución"},
      {id: 2, text: "Cambio de artículo"}
    ],
    tipoOperacion: null,
    productos: [],
    clientes: [],
    depositos: [],
    object: {
      producto: []
    },
    valid: true,
    loaded: false,
    tenant: "",
    service: "devoluciones",
    token: localStorage.getItem("token"),
    snackError: false,
    errorMessage: "",
    paginate: {
      page: 1,
      size: 10,
      totalPages: 0
    },
    loguedUser: null,
    radioGroup: "",
    filterString: "",
    checked: false,
  }),

  mounted() {
    this.tenant = this.$route.params.tenant;
    if (this.$route.params.id && this.$route.params.id > 0) {
      this.getObject(this.$route.params.id);
    } else {
      this.loaded = true;
    }
    this.getLoguedUser();
  },

  methods: {
    getObject(id) {
      GenericService(this.tenant, this.service, this.token)
        .get(id)
        .then(data => {
          this.object = data.data;
          this.loaded = true;
        });
    },

    getLoguedUser(){
      GenericService(this.tenant, this.service, this.token)
      .getLoguedUser()
      .then(data => {
        this.loguedUser = data.data;
        if(this.loguedUser.perfil.id < 2){
          this.getAll(this.paginate.page - 1, this.paginate.size);
        }else{
          this.getModels(this.loguedUser.sucursal.id, this.paginate.page - 1, this.paginate.size);
        }
      })
    },
    
    getAll(page, size){
      GenericService(this.tenant, "productos", this.token)
      .getAll(page, size)
      .then(data => {
        this.productos = data.data.content;
        this.paginate.totalPages = data.data.totalPages;
      })

      GenericService(this.tenant, "clientes", this.token)
      .getAll(0, 100000)
      .then(data => {
        this.clientes = data.data.content;
      })

      GenericService(this.tenant, "stock", this.token)
      .getAll(0, 100000)
      .then(data => {
        this.stocks = data.data;
      })
    },

    getModels(sucursalId, page, size){
      GenericService(this.tenant, "productos", this.token)
      .getAll(page, size)
      .then(data => {
        if (this.object.producto.length > 0) {
          data.data.content.forEach((el) => {
            this.object.producto.forEach((e) => {
              if (el.id == e.id) {
                el.selected = true;
              }
            });
          });
          this.productos = data.data.content;
        } else {
          this.productos = data.data.content;
        }
        this.paginate.totalPages = data.data.totalPages;
      });

      GenericService(this.tenant, "clientes", this.token)
      .getDataForSucursal(sucursalId, 0, 100000)
      .then(data => {
        this.clientes = data.data.content;
        console.log(this.clientes);
      })

      GenericService(this.tenant, "stock", this.token)
      .getDataForSucursal(sucursalId, 0, 100000)
      .then(data => {
        this.stocks = data.data.content;
        console.log(this.stocks);
      })

      GenericService(this.tenant, "depositos", this.token)
      .getDataForSucursal(sucursalId, 0, 100000)
      .then(data => {
        this.depositos = data.data.content;
        console.log(this.depositos);
      })

    },

    changePage(sucursalId, page, size) {
      const perfil = this.loguedUser.perfil.id;

      if(perfil < 2){
        this.getAll(page, size);
      }else{
        this.getModels(sucursalId, page, size);
      }

    },

    filterObjects(filter, radio) {
      const sucursalId = this.loguedUser.sucursal.id;
      var filt = "";
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

      if (!this.filterString) {
        this.getModels(sucursalId, this.paginate.page - 1, this.paginate.size);
      } else {
        GenericService(this.tenant, "productos", this.token)
          .filter(filt)
          .then((data) => {
            if (this.object.producto.length > 0) {
              data.data.content.forEach((el) => {
                this.object.producto.forEach((e) => {
                  if (el.id == e.id) {
                    el.selected = true;
                  }
                });
              });
            }
            this.productos = data.data.content;
            this.paginate.totalPages = data.data.totalPages;
            this.loaded = true;
          });
      }
    },

    checkProduct(id) {
      const productosFiltrados = this.productos.filter((el) => el.id === id)[0];
      if (productosFiltrados.selected) {
        this.object.producto.push(productosFiltrados);
      } else {
        const object = this.object.producto.filter(
          (el) => el.id !== productosFiltrados.id
        );
        this.object.producto = object;
      }
    },

    save() {
      this.object.sucursales = [this.loguedUser.sucursal];
      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(() => {
          this.$router.push({ name: "devoluciones" });
        })
        .catch(error => {
          if (error.response.status == 500) {
            this.snackError = true;
            this.errorMessage = "Ocurrio un error";
          }
        });
    },

    back() {
      this.$router.push({ name: "devoluciones" });
    }
  }
};
</script>