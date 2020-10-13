<template>
  <v-card min-width="100%">
    <v-snackbar v-model="snackError" :color="'#E53935'" :timeout="3000" :top="true">{{errorMessage}}</v-snackbar>
    <div v-if="loaded">
      <v-form ref="form" v-model="valid" :lazy-validation="false" class="mt-5">
        <v-row class="ma-1" v-if="urlId == 0">
            <v-col>
                <v-autocomplete
                    :items="depositos"
                    v-model="object.deposito"
                    multiple
                    item-text="nombre"
                    label="Seleccione el o los depositos donde se encuentra su stock"
                    :return-object="true"
                    :rules="[v => !!v || 'Campo requerido...']"
                ></v-autocomplete>
            </v-col>
            <v-col>
                <v-text-field
                    type="number"
                    :counter="50"
                    v-model="object.cantidad"
                    placeholder="Cantidad de stock"
                    required
                    :rules="[v => !!v || 'Campo requerido...']"
                ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-radio-group class="ml-5 mr-5" v-model="radioGroup">
                <label>Seleccione un parámetro para realizar la búsqueda</label>
                <v-row>
                  <v-col>
                    <v-radio
                    label="Nombre"
                    value="nombre"
                    ></v-radio>
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
              <v-simple-table style="background-color: transparent;">
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
                      <td><v-checkbox v-model="producto.selected" @change="checkProduct(producto.id)"></v-checkbox></td>
                      <td>{{producto.nombre}}</td>
                      <td>{{producto.codigoBarra}}</td>
                      <td>{{producto.codigoProducto}}</td>
                      <td>${{producto.precioCosto}}</td>
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
                @input="changePage"
                v-if="paginate.totalPages > 1"
              ></v-pagination>
            </v-col>
        </v-row>
        <v-row class="ma-1"  v-if="urlId > 0">
            <v-col>
                <v-autocomplete
                    disabled
                    :items="productos"
                    v-model="object.producto"
                    item-text="nombre"
                    label="Productos"
                    :return-object="true"
                    :rules="[v => !!v || 'Campo requerido...']"
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
                    :rules="[v => !!v || 'Campo requerido...']"
                ></v-autocomplete>
            </v-col>
            <v-col>
                <v-text-field
                    type="number"
                    v-model="object.cantidad"
                    :counter="50"
                    placeholder="Cantidad"
                    required
                    :rules="[v => !!v || 'Campo requerido...']"
                ></v-text-field>
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
import StocksService from '../../services/StocksService';

export default {
  data: () => ({
    valid: true,
    urlId: 0,
    object: {
      producto: [],
    },
    depositos: [],
    productos: [],
    loguedUser: '',
    loaded: false,
    tenant: "",
    service: "stock",
    token: localStorage.getItem("token"),
    snackError: false,
    errorMessage: "",
    paginate: {
      page: 1,
      size: 10,
      totalPages: 0
    },
    radioGroup: '',
    filterString: '',
    checked: false
  }),

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.urlId = this.$route.params.id;
    if (this.$route.params.id && this.$route.params.id > 0) {
      this.getObject(this.$route.params.id);
    } else {
      this.getOtherModels(0, 10);
      this.getUserLogued();
      this.loaded = true;
    }
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

    checkProduct(id){
      const productosFiltrados = this.productos.filter(el => el.id === id)[0];
      if(productosFiltrados.selected){
        this.object.producto.push(productosFiltrados)
      }else{
        const object = this.object.producto.filter(el => el.id !== productosFiltrados.id);
        this.object.producto = object;
      }
      console.log(this.object.producto);
    },

    getDepositosForSucursal(id){
      StocksService(this.tenant, "depositos", this.token)
      .getDepositosForSucursal(id)
      .then(data => {
        this.depositos = data.data.content;
      })
    },

    changePage(page) {
      this.getOtherModels(page - 1, this.paginate.size);
    },

    save() {
      this.$refs.form.validate();
      if(this.urlId > 0){
        GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(() => {
          this.$router.push({ name: "stock" });
        })
        .catch(error => {
          if (error.response.status == 500) {
            this.snackError = true;
            this.errorMessage = "Ocurrio un error";
          }
        });
      }else{
          var stocks = [];
          this.object.deposito.forEach(ele =>{
                this.object.producto.forEach(el => {
                    let obj = {
       
       producto: el,
                        deposito: ele,
                        cantidad: this.object.cantidad,
                        sucursal: this.loguedUser.sucursal,
                        algorim: el.nombre+ele.id
                    }
                    stocks.push(obj);
                })
          })
          
          GenericService(this.tenant, this.service, this.token)
          .saveAll(stocks)
          .then(()=>{
              this.$router.push({ name: "stock" });
          })
      }
    },

    back() {
      this.$router.push({ name: "stock" });
    },

    getOtherModels(page, size) {
      GenericService(this.tenant, "productos", this.token)
        .getAll(page, size)
        .then(data => {
          if(this.object.producto.length > 0){
            console.log(data);
          }
          this.paginate.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },

    filterObjects(filter,radio){
      var filt = '';
      switch (radio) {
        case "nombre":
            filt = {nombre: filter}
          break;
        case "codigodebarras":
            filt = {codigoBarra: filter}
          break;
        default:
          filt = {codigoProducto: filter}
          break;
      }

      if(!filt.nombre && !filt.codigoBarra && !filt.codigoProducto){
        this.getOtherModels(0, 10);
      }else{
        GenericService(this.tenant, "productos", this.token)
        .filter(filt)
        .then(data => {
          if(this.object.producto.length > 0){
            data.data.content.forEach(el => {
              this.object.producto.forEach(e => {
                if(el.id == e.id){
                  el.selected = true;
                }
              })
            })
          }
          this.productos = data.data.content;
          this.paginate.totalPages = data.data.totalPages;
          this.loaded = true;
        });

        console.log(filt);
      }
    }, 

    getUserLogued(){
      GenericService(this.tenant, this.service, this.token)
      .getLoguedUser()
      .then(data => {
        this.loguedUser = data.data;
        this.getDepositosForSucursal(this.loguedUser.sucursal.id);
      })
    }
  }
};
</script>