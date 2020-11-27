<template>
  <v-card min-width="100%">
    <v-snackbar
      v-model="snackError"
      :color="'#E53935'"
      :timeout="3000"
      :top="true"
      >{{ errorMessage }}</v-snackbar
    >
    <div v-if="loaded">
      <v-form ref="form" v-model="valid" :lazy-validation="false" class="mt-5">
        <v-row v-if="urlId == 0" class="ml-5 mr-5">
          <v-col cols="12">
            <v-text-field
              v-model="filterString"
              v-on:input="filterObjects(filterString, paginateProducts.page - 1, paginateProducts.size)"
              dense
              outlined
              rounded
              class="text-left"
              label="Puede buscar un artículo escribiendo su nombre, código o código de barras aquí"
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="ml-5 mr-5">
          <v-col cols="7">
            <v-simple-table style="background-color: transparent" ref="tab">
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
              v-model="paginateProducts.page"
              :length="paginateProducts.totalPages"
              next-icon="mdi-chevron-right"
              prev-icon="mdi-chevron-left"
              :page="paginateProducts.page"
              :total-visible="8"
              @input="changePage(paginateProducts.page - 1, paginateProducts.size)"
              v-if="paginateProducts.totalPages > 1"
            ></v-pagination>
          </v-col>
          <v-col cols="1" class="d-flex justify-center">
              <div class="verticalSeparator"></div>
          </v-col>
          <v-col cols="3">
            <v-simple-table style="background-color: transparent">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="producto in object.producto" :key="producto.id">
                  <tr>
                    <td>{{ producto.nombre }}</td>
                    <td>
                      <button type="button">
                        <img
                          src="/../../images/icons/ico_11.svg"
                          @click="deleteLine(producto.id)"
                          width="40"
                          height="40"
                        />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
        <v-row class="ma-5" v-if="urlId == 0">
          <v-col>
            <v-autocomplete
              :items="depositos"
              v-model="object.deposito"
              multiple
              item-text="nombre"
              label="Seleccione el o los depositos donde se encuentra su stock"
              :return-object="true"
              :rules="[(v) => !!v || 'Campo requerido...']"
            ></v-autocomplete>
          </v-col>
          <v-col>
            <v-text-field
              type="number"
              :counter="50"
              v-model="object.cantidad"
              placeholder="Cantidad de stock"
              required
              :rules="[(v) => !!v || 'Campo requerido...']"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="ma-1" v-if="urlId != 0">
          <v-col>
            <v-autocomplete
              disabled
              :items="productos"
              v-model="object.producto"
              item-text="nombre"
              label="Productos"
              :return-object="true"
              :rules="[(v) => !!v || 'Campo requerido...']"
            ></v-autocomplete>
          </v-col>
          <v-col>
            <v-autocomplete
              disabled
              :items="depositos"
              v-model="object.deposito"
              item-text="nombre"
              label="Depositos"
              :return-object="true"
              :rules="[(v) => !!v || 'Campo requerido...']"
            ></v-autocomplete>
          </v-col>
          <v-col>
            <v-text-field
              type="number"
              v-model="object.cantidad"
              :counter="50"
              placeholder="Cantidad"
              required
              :rules="[(v) => !!v || 'Campo requerido...']"
            ></v-text-field>
          </v-col>
        </v-row>
        <div class="ma-1">
          <v-col class="col-6">
            <v-btn class="mr-4" color="primary" @click="save" :disabled="!valid"
              >Guardar</v-btn
            >
            <v-btn color="default" @click="back()">Cancelar</v-btn>
          </v-col>
        </div>
      </v-form>
    </div>
    <div v-if="!loaded">
      <v-row class="ma-1">
        <v-col class="col-12" style="text-align: center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>
<script>
import { errorAlert } from '../../helpers/alerts';
import GenericService from "../../services/GenericService";

export default {
  data: () => ({
    valid: true,
    urlId: 0,
    object: {
      producto: [],
    },
    depositos: [],
    productos: [],
    loguedUser: "",
    loaded: false,
    tenant: "",
    service: "stock",
    token: localStorage.getItem("token"),
    snackError: false,
    errorMessage: "",
    paginate: {
      page: 1,
      size: 100000,
    },
    paginateProducts: {
      page: 1,
      size: 5,
      totalPages: 0,
    },
    radioGroup: "",
    filterString: "",
    checked: false,
  }),

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.urlId = this.$route.params.id;

    if (this.urlId && this.urlId > 0) {
      this.getObject(this.urlId);
    } else {
      this.getOtherModels(this.paginateProducts.page - 1, this.paginateProducts.size);
      this.getUserLogued();
    }
  },

  methods: {
    getObject(id) {
      GenericService(this.tenant, this.service, this.token)
        .get(id)
        .then((data) => {
          this.object = data.data;
          this.loaded = true;
        });
    },

    checkProduct(id) {
      const productosFiltrados = this.productos.filter((el) => el.id === id)[0];
      if (productosFiltrados.selected) {
        this.object.producto.push(productosFiltrados);
      } else {
        this.object.producto = this.object.producto.filter(
          (el) => el.id !== productosFiltrados.id
        );
      }
    },

    getDepositosForSucursal(id,page,size) {
      const filterParam = {id, param: "", page, size}
      GenericService(this.tenant, "depositos", this.token)
        .filter(filterParam)
        .then((data) => {
          this.depositos = data.data.content;
        });
    },

    changePage(page, size) {
      if(this.filterString){
        this.filterObjects(this.filterString, page, size);
      }else{
        this.getOtherModels(page, size);
      }
    },

    save() {
      if(this.object.producto.length < 1){
        errorAlert("No ha seleccionado productos");
      }else{
        this.$refs.form.validate();
        if (this.urlId > 0) {
          GenericService(this.tenant, this.service, this.token)
            .save(this.object)
            .then(() => {
              this.$router.push({ name: "stock" });
            })
            .catch((error) => {
              if (error.response.status == 500) {
                this.snackError = true;
                this.errorMessage = "Ocurrio un error";
              }
            });
        } else {
          var stocks = [];
          this.object.deposito.forEach((ele) => {
            this.object.producto.forEach((el) => {
              let obj = {
                producto: el,
                deposito: ele,
                cantidad: this.object.cantidad,
                sucursal: this.loguedUser.sucursal,
                algorim: el.nombre + ele.id,
              };
              stocks.push(obj);
            });
          });

          GenericService(this.tenant, this.service, this.token)
            .saveAll(stocks)
            .then(() => {
              this.$router.push({ name: "stock" });
            });
        }
      }
    },

    back() {
      this.$router.push({ name: "stock" });
    },

    getOtherModels(page, size) {
      GenericService(this.tenant, "productos", this.token)
        .getAll(page, size)
        .then((data) => {
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
          this.paginateProducts.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },

    filterObjects(param, page, size) {
      const filterParam = { param, page, size };
      if (!this.filterString) {
        this.getOtherModels(this.paginateProducts.page - 1, this.paginateProducts.size);
      } else {
        GenericService(this.tenant, "productos", this.token)
          .filter(filterParam)
          .then((data) => {
            if(this.object.producto.length > 0){
              this.object.producto.forEach(el => {
                data.data.content.forEach(e => {
                  if(e.id === el.id){
                    e.selected = true;
                  }
                })
              })
            }
            this.paginateProducts.totalPages = data.data.totalPages;
            if(this.paginateProducts.totalPages < this.paginateProducts.page){
              this.paginateProducts.page = 1;
            }
            this.productos = data.data.content;
            this.loaded = true;
          });
      }
    },

    getUserLogued() {
      GenericService(this.tenant, this.service, this.token)
        .getLoguedUser()
        .then((data) => {
          this.loguedUser = data.data;
          this.getDepositosForSucursal(this.loguedUser.sucursal.id, 0, 100000);
        });
    },

    deleteLine(id) {
      this.object.producto = this.object.producto.filter((el) => el.id !== id);
      if(this.productos.filter(el => el.id === id)[0]){
        this.productos.filter(el => el.id === id)[0].selected = false; 
      }
    },
  },
};
</script>