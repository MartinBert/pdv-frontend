<template>
  <v-card min-width="100%">
    <v-snackbar v-model="snackError" :color="'#E53935'" :timeout="3000" :top="true">{{errorMessage}}</v-snackbar>
    <div v-if="loaded">
      <v-form ref="form" v-model="valid" :lazy-validation="false">
        <v-row>
          <v-col class="col-12 ml-3">
              <v-btn 
              color="primary"
              @click="$store.commit('productos/dialogProductosMutation')"
              >AGREGAR PRODUCTO RECIBIDO</v-btn>
              <v-btn 
              color="primary"
              @click="$store.commit('productos/dialogProductosMutation')"
              >AGREGAR PRODUCTO RECIBIDO</v-btn>
          </v-col>
          <v-col class="ml-3 mr-3">
            <v-autocomplete
              :items="tiposOperacion"
              v-model="tipoOperacion"
              item-text="text"
              item-value="id"
              label="Tipo de operación"
              :rules="[v => !!v || 'Campo requerido...']"
            ></v-autocomplete>
          </v-col>
          <v-col class="mr-3 ml-3" v-if="tipoOperacion">
            <v-text-field
              type="text"
              v-model="object.descripcion"
              label="Descripción"
              required
              :rules="[v => !!v || 'Campo requerido...']"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="ml-3 mr-3 mb-5">
          <v-col class="col-6">
            <v-btn class="mr-4" color="primary" @click="save" :disabled="!valid">Guardar</v-btn>
            <v-btn color="default" @click="back()">Cancelar</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </div>

    <div v-if="!loaded">
      <v-row class="ma-1">
        <v-col class="col-12" style="text-align:center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-col>
      </v-row>
    </div>

    <ProductDialog />
  </v-card>
</template>

<script>
import GenericService from "../../services/GenericService";
import { getCurrentDate } from "../../helpers/dateHelper";
import ProductDialog from "../../components/ProductDialog";

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
      fecha: getCurrentDate(),
      productos: []
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
      size: 5,
      totalPages: 0
    },
    loguedUser: null,
    radioGroup: "",
    filterString: "",
    checked: false,
    saveDialog: false
  }),

  components:{
    ProductDialog
  },

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
        if (this.object.productos.length > 0) {
          data.data.content.forEach((el) => {
            this.object.productos.forEach((e) => {
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
            if (this.object.productos.length > 0) {
              data.data.content.forEach((el) => {
                this.object.productos.forEach((e) => {
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
        this.object.productos.push(productosFiltrados);
      } else {
        const object = this.object.productos.filter(
          (el) => el.id !== productosFiltrados.id
        );
        this.object.productos = object;
      }
    },
 
    save() {
      this.object.sucursal = this.loguedUser.sucursal;
      this.object.empresa = this.loguedUser.empresa;
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
    },

    openSaveDialog() {
      this.saveDialog = true;
    },
  }
};
</script>