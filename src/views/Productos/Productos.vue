<template>
  <v-container>
    <v-form class="mb-3">
      <v-row>
        <v-col cols="1">
          <v-btn class="primary" @click="newObject()" raised>Nuevo</v-btn>
        </v-col>
        <v-col cols="3">
          <v-file-input
          v-model="file" 
          class="mt-0"
          placeholder="Importar productos"
          accept=".xlsx, xls"
          @change="onChange($event)"
          ></v-file-input>
        </v-col>
        <v-col cols="2">
          <v-select
            :items="estados"
            v-model="estadoSeleccionado"
            item-text="text"
            item-value="id"
            outlined
            dense
          ></v-select>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="3">
          <v-text-field
            v-model="filterString"
            v-on:input="filterObjects(filterString)"
            dense
            outlined
            rounded
            class="text-left"
            placeholder="Búsqueda"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>

    <!-- List -->
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Código de barras</th>
            <th>Código de producto</th>
            <th>Marca</th>
            <th>Precio de costo</th>
            <th>Precio de venta</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody v-for="object in objects" :key="object.id">
          <tr>
            <td>{{object.id}}</td>
            <td>{{object.nombre}}</td>
            <td>{{object.codigoBarra}}</td>
            <td>{{object.codigoProducto}}</td>
            <td>{{object.marca ? object.marca.nombre : 'Sin marca'}}</td>
            <td>${{object.precioCosto}}</td>
            <td>${{object.precioTotal}}</td>
            <td>
              <v-icon title="Ver depositos" @click="showStock(object)">mdi-text-box</v-icon>
            </td>
            <td>
              <v-icon title="Editar" @click="edit(object.id)">mdi-pencil</v-icon>
              <v-icon title="Eliminar" @click="openDelete(object.id)">mdi-delete</v-icon>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <!-- End List -->

    <!-- Loader -->
    <div class="text-center" style="margin-top:15px" v-if="!loaded">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <!-- End Loader -->

    <!-- Paginate -->
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
    <!-- End Paginate -->

    <!-- Dialog Delete-->
    <v-dialog v-model="dialogDeleteObject" width="500">
      <v-card>
        <v-toolbar class="d-flex justify-center" color="primary" dark>
          <v-toolbar-title>Eliminar objeto</v-toolbar-title>
        </v-toolbar>
        <v-card-title class="d-flex justify-center">¿Está seguro que desea realizar esta acción?</v-card-title>
        <v-card-actions class="d-flex justify-center pb-4">
          <v-btn small color="disabled" class="mr-5" @click="deleteObject">Si</v-btn>
          <v-btn small color="disabled" @click="dialogDeleteObject = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End Dialog Delete -->

    <!-- Dialog Loader -->
    <template>
      <v-dialog v-model="loader" hide-overlay persistent width="400" v-if="loaderStatus == false">
        <v-card color="primary" dark>
          <v-card-text>
            Importando productos...
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="loader" v-if="loaderStatus == true" hide-overlay persistent width="400">
        <v-card color="primary">
          <v-list-item>
            <v-list-item-content justify="center" align="center">
              <v-icon x-large color="success">{{this.icon}}</v-icon>
              <v-card-text class="title">¡Importación finalizada!</v-card-text>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-dialog>
    </template>
    <!-- End Dialog Loader -->

    <!-- Dialog stock -->
    <v-dialog v-model="dialogStock" max-width="800" v-if="dialogStock">
      <v-card>
        <v-card-title>
          <span class="headline">Stock {{object.nombre + ' - ID:' + object.id}}</span>
        </v-card-title>
        <v-container>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>Deposito</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody v-for="s in stock" :key="s.id">
                <tr>
                  <td>{{s.deposito.nombre}}</td>
                  <td>
                    <v-text-field
                      type="number"
                      v-model="s.stock.cantidad"
                      style="width:100px"
                      min="0"
                    ></v-text-field>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-container>
        <v-card-actions>
          <v-btn color="primary" @click="updateStock()">Aplicar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End Dialog stock -->
  </v-container>
</template>

<script>
import GenericService from "../../services/GenericService";
import XLSX from "xlsx";

export default {
  data: () => ({
    icon: "mdi-check-circle",
    loader: false,
    loaderStatus: false,
    filterString: "",
    file: null,
    object: null,
    stock: [],
    objects: [],
    marcas: [],
    distribuidores: [],
    depositos: [],
    rubros: [],
    estados: [
      { id: 1, text: "Activos" },
      { id: 2, text: "Inactivos" }
    ],
    estadoSeleccionado: { id: 1, text: "Activos" },
    paginate: {
      page: 1,
      size: 10,
      totalPages: 0
    },
    loaded: false,
    tenant: "",
    service: "productos",
    token: localStorage.getItem("token"),
    dialogStock: false,
    dialogDeleteObject: false
  }),

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.getAll(this.paginate.page - 1, this.paginate.size);
    this.getOtherModels(0, 200000);
  },

  methods: {
    getAll: function(page, size) {
      this.objects = [];
      this.loaded = false;
      GenericService(this.tenant, this.service, this.token)
        .getAll(page, size)
        .then(data => {
          this.objects = data.data.content;
          this.paginate.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },

    getOtherModels(page, size) {
      GenericService(this.tenant, "marcas", this.token)
        .getAll(page, size)
        .then(data => {
          this.marcas = data.data.content;
        });

      GenericService(this.tenant, "distribuidores", this.token)
        .getAll(page, size)
        .then(data => {
          this.distribuidores = data.data.content;
        });

      GenericService(this.tenant, "depositos", this.token)
        .getAll(page, size)
        .then(data => {
          this.depositos = data.data.content;
        });

      GenericService(this.tenant, "rubros", this.token)
        .getAll(page, size)
        .then(data => {
          this.rubros = data.data.content;
        });
    },

    changePage: function(page) {
      this.getAll(page - 1, this.paginate.size);
    },

    newObject: function() {
      this.$router.push({ name: "productosForm", params: { id: 0 } });
    },

    edit: function(id) {
      this.$router.push({ name: "productosForm", params: { id: id } });
    },

    filterObjects: function(filter){
      var f ={
        nombre:filter
      }
      GenericService(this.tenant, "productos", this.token)
        .filter(f)
        .then(data => {
          this.objects = data.data.content;
        });
    },

    openDelete: function(id) {
      this.idObjet = id;
      this.dialogDeleteObject = true;
    },

    deleteObject: function() {
      this.dialog = true;
      this.dialogDeleteObject = false;
      GenericService(this.tenant, this.service, this.token).disable(
        this.idObjet,
        this.objects
      );
    },

    showStock: function(object) {
      this.stock = [];
      this.object = object;
      this.object.depositos.forEach(d => {
        var stock = {
          deposito: d,
          stock: {}
        };
        this.object.stocks.forEach(s => {
          if (s.deposito.id == d.id) {
            stock.stock = {
              id: s.id,
              cantidad: s.cantidad
            };
          }
        });
        this.stock.push(stock);
      });
      this.dialogStock = true;
    },

    updateStock: function() {
      var stocks = [];
      this.stock.forEach(element => {
        if (element.stock.cantidad >= 0) {
          if (element.stock.id) {
            stocks.push({
              id: element.stock.id,
              producto: {
                id: this.object.id
              },
              deposito: element.deposito,
              cantidad: element.stock.cantidad
            });
          } else {
            stocks.push({
              producto: {
                id: this.object.id
              },
              deposito: element.deposito,
              cantidad: element.stock.cantidad
            });
          }
        }
      });

      GenericService(this.tenant, "stock", this.token)
        .saveAll(stocks)
        .then(data => {
          this.object.stocks = data.data;
          this.showStock(this.object);
        });
    },

    //Load excel

    findFile() {
      this.$refs.uploader.click();
    },

    //Importar productos
    onChange: function(event) {
      console.log(event);
      this.file = event;
      var excel = [];
      var reader = new FileReader();
      reader.onload = e => {
        var data = e.target.result;
        var workbook = XLSX.read(data, { type: "binary" });

        var sheet_name_list = workbook.SheetNames;
        sheet_name_list.forEach(function(y) {
          var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
          if (exceljson.length > 0) {
            for (var i = 0; i < exceljson.length; i++) {
              excel.push(exceljson[i]);
            }
          }
        });
        var prod = this.validateImport(excel);
        if (prod.status) {
          GenericService(this.tenant, this.service, this.token)
            .saveAll(prod.data)
            .then(function(data){
              console.log(data)
            })
            .then(() => {
              this.getAll(this.paginate.page - 1, this.paginate.size);
              this.loaderStatus = true;
              window.setTimeout(()=>{
                this.loader = false
                this.loaderStatus=false;
              }, 2000);    
            });
        }
      };
      reader.readAsBinaryString(this.file);
    },

    validateImport: function(objects) {
      console.log(objects);
      var importacion = {
        status: true,
        data: [],
        message: ""
      };
      objects.forEach((element, index) => {
        if (
          element.nombre &&
          element.codigoBarra &&
          element.codigoProducto &&
          element.ganancia &&
          element.precioTotal
        ) {
          var iva = 21 / 100;
          var ganancia = element.ganancia / 100;
          var obj = {
            nombre: element.nombre,
            codigoBarra: String(element.codigoBarra),
            codigoProducto: String(element.codigoProducto),
            marca: this.getMarca(element.idMarca),
            rubro: this.getRubro(element.idRubro),
            propiedad: element.propiedad,
            distribuidores: this.getDistribuidores(
              String(element.idDistribuidores)
            ),
            precioCosto: ((element.precioTotal / (1 + ganancia)) / (1+iva)).toFixed(2),
            depositos: this.getDepositos(String(element.idDepositos)),
            costoNeto: (((element.precioTotal / (1 + ganancia)) / (1+iva))/(1+iva)).toFixed(2),
            costoBruto: ((element.precioTotal / (1 + ganancia)) / (1+iva)).toFixed(2),
            ivaCompra: (((element.precioTotal / (1 + ganancia)) / (1+iva)) - ((element.precioTotal / (1 + ganancia)) / (1+iva))/(1+iva)).toFixed(2),
            ganancia: element.ganancia,
            precioSinIva: (element.precioTotal / (1 + iva)).toFixed(2),
            ivaVenta: (element.precioTotal - (element.precioTotal / (1 + iva))).toFixed(2),
            precioTotal: element.precioTotal,
            estado: 1
          };
          importacion.data.push(obj);
        } else {
          importacion.status = false;
          importacion.message = "Faltan datos en el renglón " + (index + 2);
        }
      });
      return importacion;
    },

    getMarca: function(id) {
      var marca = null;
      if (this.marcas && id) {
        this.marcas.forEach(element => {
          if (element.id == id) {
            marca = element;
          }
        });
      }
      return marca;
    },

    getRubro: function(id) {
      var rubro = null;
      if (this.rubros && id) {
        this.rubros.forEach(element => {
          if (element.id == id) {
            rubro = element;
          }
        });
      }
      return rubro;
    },

    getDistribuidores: function(d) {
      var distribuidores = [];
      if (this.distribuidores && d) {
        var exp = d.match("-");
        if (exp) {
          var stringIds = d.split("-");
          this.distribuidores.forEach(element => {
            stringIds.forEach(s => {
              if (element.id == Number(s)) {
                distribuidores.push(element);
              }
            });
          });
        } else {
          this.distribuidores.forEach(element => {
            if (element.id == d) {
              distribuidores.push(element);
            }
          });
        }
      }
      return distribuidores;
    },

    getDepositos: function(d) {
      var depositos = [];
      if (this.depositos && d) {
        var exp = d.match("-");
        if (exp) {
          var stringIds = d.split("-");
          this.depositos.forEach(element => {
            stringIds.forEach(s => {
              if (element.id == Number(s)) {
                depositos.push(element);
              }
            });
          });
        } else {
          this.depositos.forEach(element => {
            if (element.id == d) {
              depositos.push(element);
            }
          });
        }
      }
      return depositos;
    }
  }
};
</script>