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
      <v-form ref="form" v-model="valid" :lazy-validation="false">
        <v-row>
          <v-col class="col-12 ml-5">
            <v-btn
              color="primary"
              @click="$store.commit('productos/dialogProductosMutation')"
            >AGREGAR PRODUCTOS</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="mr-5 ml-5">
            <div class="horizontalSeparator"></div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="5" class="ml-5">
            <v-row>
              <v-col class="text-center">
                <label>Productos devueltos</label>
              </v-col>
            </v-row>
            <v-simple-table style="background-color: transparent" fixed-header>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Producto</th>
                    <th class="text-left">Cantidad</th>
                    <th class="text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="p in object.productosEntrantes" :key="p.id">
                    <td>{{ p.nombre }}</td>
                    <td>
                      <input type="number" v-model="p.cantUnidades" />
                    </td>
                    <td>
                      <div class="d-flex mt-1">
                        <button type="button">
                        <img
                          src="/../../images/icons/ico_11.svg"
                          @click="deleteLine(p.id, 'entrante')"
                          width="40"
                          height="40"
                        />
                      </button>
                      <button type="button">
                        <img
                          src="/../../images/icons/adelante.svg"
                          @click="changeStatus(p, 'entrante')"
                          width="40"
                          height="40"
                        />
                      </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
          <v-col class="d-flex justify-center"><div class="verticalSeparator"></div></v-col>
          <v-col cols="5" class="mr-5">
            <v-row>
              <v-col class="text-center">
                <label>Productos cedidos</label>
              </v-col>
            </v-row>
            <v-simple-table style="background-color: transparent" fixed-header>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Acciones</th>
                    <th class="text-left">Producto</th>
                    <th class="text-left">Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="p in object.productosSalientes" :key="p.id">
                    <td>
                      <div class="d-flex mt-1">
                        <button type="button">
                        <img
                          src="/../../images/icons/ico_11.svg"
                          @click="deleteLine(p.id, 'saliente')"
                          width="40"
                          height="40"
                        />
                      </button>
                      <button type="button">
                        <img
                          src="/../../images/icons/atras.svg"
                          @click="changeStatus(p, 'saliente')"
                          width="40"
                          height="40"
                        />
                      </button>
                      </div>
                    </td>
                    <td>{{ p.nombre }}</td>
                    <td>
                      <input type="number" v-model="p.cantUnidades" />
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
        <v-row class="ml-3 mr-3 mb-5">
          <v-col class="col-6">
            <v-btn class="mr-4" color="primary" @click="openSaveDialog" :disabled="!valid"
              >Guardar</v-btn
            >
            <v-btn color="default" @click="back()">Cancelar</v-btn>
          </v-col>
        </v-row>
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
    <ProductDialog v-on:productList="addProduct" />

    <v-dialog v-model="saveDialog" width="400px">
      <v-card>
        <v-card-title class="text-center">¿Desea emitir un comprobante?</v-card-title>
        <v-card-actions class="text-center w-100">
          <v-btn class="success">Si</v-btn>
          <v-btn class="error">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import GenericService from "../../services/GenericService";
import { getCurrentDate } from "../../helpers/dateHelper";
import { errorAlert } from "../../helpers/alerts";
import ProductDialog from "../../components/ProductDialog";


export default {
  data: () => ({
    tiposOperacion: [
      { id: 1, text: "Devolución" },
      { id: 2, text: "Cambio de artículo" },
    ],
    tipoOperacion: null,
    productos: [],
    clientes: [],
    depositos: [],
    object: {
      fecha: getCurrentDate(),
      productosEntrantes: [],
      productosSalientes: [],
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
      totalPages: 0,
    },
    loguedUser: null,
    radioGroup: "",
    filterString: "",
    checked: false,
    saveDialog: false,
  }),

  components: {
    ProductDialog,
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
        .then((data) => {
          this.object = data.data;
          this.loaded = true;
        });
    },

    getLoguedUser() {
      GenericService(this.tenant, this.service, this.token)
        .getLoguedUser()
        .then((data) => {
          this.loguedUser = data.data;
          if (this.loguedUser.perfil.id < 2) {
            this.getAll(this.paginate.page - 1, this.paginate.size);
          } else {
            this.getModels(
              this.loguedUser.sucursal.id,
              this.paginate.page - 1,
              this.paginate.size
            );
          }
        });
    },

    getAll(page, size) {
      GenericService(this.tenant, "productos", this.token)
        .getAll(page, size)
        .then((data) => {
          this.productos = data.data.content;
          this.paginate.totalPages = data.data.totalPages;
        });

      GenericService(this.tenant, "clientes", this.token)
        .getAll(0, 100000)
        .then((data) => {
          this.clientes = data.data.content;
        });

      GenericService(this.tenant, "stock", this.token)
        .getAll(0, 100000)
        .then((data) => {
          this.stocks = data.data;
        });
    },

    getModels(sucursalId, page, size) {
      GenericService(this.tenant, "productos", this.token)
        .getAll(page, size)
        .then((data) => {
          this.productos = data.data.content;
          this.paginate.totalPages = data.data.totalPages;
        });

      GenericService(this.tenant, "clientes", this.token)
        .getDataForSucursal(sucursalId, 0, 100000)
        .then((data) => {
          this.clientes = data.data.content;
        });

      GenericService(this.tenant, "stock", this.token)
        .getDataForSucursal(sucursalId, 0, 100000)
        .then((data) => {
          this.stocks = data.data.content;
        });

      GenericService(this.tenant, "depositos", this.token)
        .getDataForSucursal(sucursalId, 0, 100000)
        .then((data) => {
          this.depositos = data.data.content;
        });
    },

    deleteLine(id, status) {
      if (status === "entrante") {
        const filter = this.object.productosEntrantes.filter((el) => el.id !== id);
        this.object.productosEntrantes = filter;
      } else {
        const filter = this.object.productosSalientes.filter((el) => el.id !== id);
        this.object.productosSalientes = filter;
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

    addProduct(data) {
      let processObjects = [];

      data.forEach((el) => {
        processObjects.push(el);
      });

      this.object.productosEntrantes = processObjects;
    },

    save() {
      this.object.sucursal = this.loguedUser.sucursal;
      this.object.empresa = this.loguedUser.empresa;
      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(() => {
          this.$router.push({ name: "devoluciones" });
        })
        .catch((error) => {
          if (error.response.status == 500) {
            this.snackError = true;
            this.errorMessage = "Ocurrio un error";
          }
        });
    },

    back() {
      this.$router.push({ name: "devoluciones" });
    },

    changeStatus(product, status){
      if(status === 'entrante'){
        this.object.productosEntrantes = this.object.productosEntrantes.filter(el => el.id !== product.id);
        this.object.productosSalientes.push(product);
      }else{
        this.object.productosSalientes = this.object.productosSalientes.filter(el => el.id !== product.id);
        this.object.productosEntrantes.push(product);
      }
    },

    openSaveDialog() {
      if (this.object.productosEntrantes.length === 0) {
        errorAlert('Debe seleccionar al menos un producto devuelto');
      }else{
        this.saveDialog = true;
      }
    },
  },
};
</script>