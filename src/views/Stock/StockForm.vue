<template>
  <v-container
    style="min-width: 98%;
    margin-left:1px;"
  >
    <v-tabs fixed-tabs background-color="indigo" dark>
      <v-tab @click="newObject()" raise>
        Nuevo
      </v-tab>
      <v-tab @click="openDialog('minimumStockRestriction')" raised>
        Existencias Minimas
      </v-tab>
      <v-tab @click="openDialog('stockMigration')">
        Migrar Stock
      </v-tab>
      <v-tab @click="openDialog('reports')">
        Reportes
      </v-tab>
    </v-tabs>
    <v-card>
      <div v-if="loaded">
        <v-form
          ref="form"
          v-model="valid"
          :lazy-validation="false"
          class="mt-5"
        >
          <v-row v-if="urlId == 0" class="ml-5 mr-5">
            <v-col cols="1">
              <v-btn class="ma-0" outlined fab color="black" @click="newStock()">
                <v-icon>mdi-format-list-bulleted-square</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="filterParams.productoName"
                dense
                outlined
                rounded
                label="Nombre"
                @input="filterProducts()"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="filterParams.productoCodigo"
                dense
                outlined
                rounded
                label="Codigo de producto"
                @input="filterProducts()"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="filterParams.productoCodigoBarras"
                dense
                outlined
                rounded
                label="Codigo de barras"
                @input="filterProducts()"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="filterParams.productoMarcaName"
                dense
                outlined
                rounded
                label="Marca"
                @input="filterProducts()"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="filterParams.productoPrimerAtributoName"
                v-on:input="filterProducts()"
                dense
                outlined
                rounded
                label="Atributo"
                append-icon="mdi-magnify"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ml-5 mr-5" v-if="urlId == 0">
            <v-col cols="7">
              <v-simple-table style="background-color: transparent" ref="tab">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Nombre</th>
                      <th>Marca</th>
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
                      <td>{{ producto.marca.nombre }}</td>
                      <td>{{ producto.codigoBarra }}</td>
                      <td>{{ producto.codigoProducto }}</td>
                      <td>${{ producto.precioCosto }}</td>
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
                @input="filterProducts()"
                v-if="filterParams.totalPages > 1"
              ></v-pagination>
            </v-col>
            <v-col cols="1" class="d-flex justify-center">
              <div class="verticalSeparator"></div>
            </v-col>
            <v-col cols="3">
              <v-layout column style="height: 400px">
                <v-flex style="overflow: auto">
                  <v-simple-table style="background-color: transparent">
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody
                        v-for="producto in object.producto"
                        :key="producto.id"
                      >
                        <tr>
                          <td>{{ producto.nombre }}</td>
                          <td>
                            <button type="button">
                              <img
                                src="/../../images/icons/delete.svg"
                                @click="deleteLine(producto.id)"
                                width="30"
                                height="30"
                              />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-flex>
              </v-layout>
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
                placeholder=" "
                :return-object="true"
                :rules="[(v) => !!v || 'Campo requerido...']"
              ></v-autocomplete>
            </v-col>
            <v-col>
              <v-text-field
                type="number"
                :counter="50"
                v-model="object.cantidad"
                label="Cantidad de stock"
                placeholder=" "
                required
                :rules="[(v) => !!v || 'Campo requerido...']"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                type="number"
                v-model="object.cantidadMinima"
                label="Existencia mínima"
                placeholder=" "
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
                placeholder="Cantidad"
                required
                :rules="[(v) => !!v || 'Campo requerido...']"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                type="number"
                v-model="object.cantidadMinima"
                label="Existencia mínima"
                placeholder=" "
              ></v-text-field>
            </v-col>
          </v-row>
          <div class="ma-1">
            <v-col class="col-6">
              <v-btn
                class="mr-4"
                color="primary"
                @click="save"
                :disabled="!valid"
                >Guardar</v-btn
              >
              <v-btn color="default" @click="back()">Cancelar</v-btn>
            </v-col>
          </div>
        </v-form>
      </div>
      <Spinner v-if="!loaded" />
    </v-card>
    <ModifyMinimumStocksDialog
      v-on:stocksRestrictions="applyMassiveStocksRestrictions()"
    />
    <DepositMigrationDialog
      v-on:depositsForMigrationProcess="applyMassiveChangesInDeposits()"
    />
    <StockReportsDialog
      :loguedUser="loguedUser"
      :tenant="tenant"
      :service="service"
      :token="token"
    />
  </v-container>
</template>
<script>
//import TabBar from "../../components/Generics/TabBar.vue";
import ModifyMinimumStocksDialog from "../../components/Dialogs/ModifyMinimumStocksDialog";
import DepositMigrationDialog from "../../components/Dialogs/DepositMigrationDialog.vue";
import StockReportsDialog from "../../components/Dialogs/StockReportsDialog.vue";
import { getCurrentDate, formatDate } from "../../helpers/dateHelper";
import GenericService from "../../services/GenericService";
import Spinner from "../../components/Graphics/Spinner";
//import Error from "../../components/Error";
export default {
  data: () => ({
    valid: true,
    urlId: 0,
    object: {
      producto: [],
    },
    depositos: [],
    productos: [],
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    loaded: false,
    tenant: "",
    service: "stock",
    token: localStorage.getItem("token"),
    errorStatus: false,
    filterParams: {
      productoName: "",
      productoCodigo: "",
      productoCodigoBarras: "",
      productoMarcaName: "",
      productoPrimerAtributoName: "",
      productoSegundoAtributoName: "",
      productoTercerAtributoName: "",
      productoEstado: 0,
      stockDepositoId: "",
      sucursalId: "",
      perfilId: "",
      page: 1,
      size: 5,
      totalPages: 0,
    },
    tabs: [
      { id: 1, title: "Lista", route: "/stock" },
      { id: 2, title: "Nuevo", route: "/stock/form/0" },
      { id: 3, title: "Existencias minimas" },
      { id: 4, title: "Migrar Stock" },
      { id: 5, title: "Reportes" },
    ],
    activeTab: 2,
    filterDepositsParam: {
      depositoName: "",
      perfilId: "",
      sucursalId: "",
      page: 1,
      size: 100000,
    },
    radioGroup: "",
    checked: false,
  }),

  components: {
    Spinner,
    //Error,
    ModifyMinimumStocksDialog,
    DepositMigrationDialog,
    StockReportsDialog,
    //TabBar,
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.urlId = this.$route.params.id;
    this.filterParams.perfilId = this.loguedUser.perfil;
    this.filterDepositsParam.perfilId = this.loguedUser.perfil;
    if (this.loguedUser.perfil > 1) {
      this.filterParams.sucursalId = this.loguedUser.sucursal.id;
      this.filterDepositsParam.sucursalId = this.loguedUser.sucursal.id;
    }

    if (this.urlId && this.urlId > 0) {
      this.getObject(this.urlId);
      this.filterDepositos();
    } else {
      this.filterDepositos();
      this.filterProducts();
    }
  },

  created() {
    this.$barcodeScanner.init(this.onBarcodeScanned);
  },

  destroyed() {
    this.$barcodeScanner.destroy();
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

    filterProducts() {
      GenericService(this.tenant, "productos", this.token)
        .filter(this.filterParams)
        .then((data) => {
          if (this.object.producto.length > 0) {
            this.object.producto.forEach((el) => {
              data.data.content.forEach((e) => {
                if (e.id === el.id) {
                  e.selected = true;
                }
              });
            });
          }
          this.filterParams.totalPages = data.data.totalPages;
          if (this.filterParams.totalPages < this.filterParams.page) {
            this.filterParams.page = 1;
          }
          this.productos = data.data.content;
          this.loaded = true;
        });
    },

    filterDepositos() {
      GenericService(this.tenant, "depositos", this.token)
        .filter(this.filterDepositsParam)
        .then((data) => {
          this.depositos = data.data.content;
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

    openDialog(param) {
      switch (param) {
        case "minimumStockRestriction": {
          this.$store.commit("stocks/dialogMutation");

          break;
        }
        case "stockMigration": {
          const deposits = this.depositos.filter((el) => el.id !== 0);
          this.$store.commit("stocks/allDepositsMutation", deposits);
          this.$store.commit("stocks/depositMigrationDialogMutation");

          break;
        }
        default: {
          this.$store.commit("stocks/stockReportsDialogMutation");

          break;
        }
      }
    },

    save() {
      this.loaded = false;
      if (this.object.producto.length < 1) {
        this.$errorAlert("No ha seleccionado productos");
      } else {
        this.$refs.form.validate();
        if (this.urlId > 0) {
          this.object.algorim =
            this.object.producto.codigoBarra + this.object.deposito.id;
          GenericService(this.tenant, this.service, this.token)
            .save(this.object)
            .then(() => {
              this.saveHistorial(
                [this.object],
                `Cambio en stock de ${this.object.producto.nombre}`
              );
              this.$router.push({ name: "stock" });
            })
            .catch(() => {
              this.errorStatus = true;
              this.$router.push({ name: "stock" });
            });
        } else {
          var stocks = [];
          this.object.deposito.forEach((ele) => {
            this.object.producto.forEach((el) => {
              let obj = {
                producto: el,
                deposito: ele,
                cantidad: this.object.cantidad,
                cantidadMinima: this.object.cantidadMinima,
                sucursal: this.loguedUser.sucursal,
                algorim: el.codigoBarra + ele.id,
              };
              stocks.push(obj);
            });
          });

          GenericService(this.tenant, this.service, this.token)
            .saveAll(stocks)
            .then(() => {
              this.saveHistorial(stocks, `Carga de stock`);
              this.$router.push({ name: "stock" });
            })
            .catch(() => {
              this.errorStatus = true;
              this.$router.push({ name: "stock" });
            });
        }
      }
    },

    onBarcodeScanned(barcode) {
      const filter = {
        productoName: "",
        productoCodigo: "",
        productoCodigoBarras: barcode,
        productoMarcaName: "",
        productoPrimerAtributoName: "",
        productoSegundoAtributoName: "",
        productoTercerAtributoName: "",
        productoEstado: 0,
        stockDepositoId: "",
        sucursalId: "",
        perfilId: "",
        page: 1,
        size: 1,
      };
      GenericService(this.tenant, "productos", this.token)
        .filter(filter)
        .then((data) => {
          const databaseItem = data.data.content[0];
          const productInList = this.productos.filter(
            (el) => el.id === databaseItem.id
          )[0];

          if (this.object.producto.length > 0) {
            if (productInList) {
              if (productInList.selected === true) {
                this.productos.filter(
                  (el) => el.id === databaseItem.id
                )[0].selected = false;
                this.$refs.tab.$forceUpdate();
              } else {
                this.productos.filter(
                  (el) => el.id === databaseItem.id
                )[0].selected = true;
                this.$refs.tab.$forceUpdate();
              }
            }

            const checkInAddedProductsList = this.object.producto.filter(
              (el) => el.id === databaseItem.id
            )[0];

            if (checkInAddedProductsList) {
              this.object.producto = this.object.producto.filter(
                (el) => el.id !== databaseItem.id
              );
            } else {
              this.object.producto.push(databaseItem);
            }
          } else {
            this.object.producto.push(databaseItem);
            if (productInList) {
              this.productos.filter(
                (el) => el.id === databaseItem.id
              )[0].selected = true;
              this.$refs.tab.$forceUpdate();
            }
          }
        })
        .catch(() => {
          this.$errorAlert("No existe un producto con ese código de barras");
        });
    },

    evalCheck(id) {
      const productosFiltrados = this.productos.filter((el) => el.id === id);
      if (productosFiltrados.length > 0) {
        switch (productosFiltrados[0].selected) {
          case false || undefined:
            this.productos.filter((el) => el.id === id)[0].selected = true;
            break;

          default:
            this.productos.filter((el) => el.id === id)[0].selected = false;
            break;
        }
      }
    },
    addToMigration(object) {
      this.migration.push(object);
      this.stocks.filter((el) => el.id === object.id)[0].selected = true;
      this.$refs.stockTable.$forceUpdate();
    },

    removeOfMigration(object) {
      this.migration = this.migration.filter((el) => el.id !== object.id);
      this.stocks.filter((el) => el.id === object.id)[0].selected = false;
      this.$refs.stockTable.$forceUpdate();
    },

    deleteLine(id) {
      this.object.producto = this.object.producto.filter((el) => el.id !== id);
      if (this.productos.filter((el) => el.id === id)[0]) {
        this.productos.filter((el) => el.id === id)[0].selected = false;
      }
    },

    back() {
      this.$router.push({ name: "stock" });
    },
    gotoList() {
      this.$router.push({ name: "stock", params: { id: 0 } });
    },
    newObject() {
      this.$router.push({ name: "stockForm", params: { id: 0 } });
    },
     newStock() {
      this.$router.push({ name: "stock", params: { id: 0 } });
    },

    saveHistorial(stocks, str) {
      const stockHistory = {
        stocks: stocks,
        descripcion: str,
        fecha: formatDate(getCurrentDate()),
        usuario: this.loguedUser.nombre,
        sucursal: this.loguedUser.sucursal,
      };

      GenericService(this.tenant, "historialStock", this.token).save(
        stockHistory
      );
    },
    migrateStockToOtherDeposit() {
      if (this.migration.length > 0) {
        this.loaded = false;
        this.migration.forEach((el) => {
          el.deposito = this.destinationDepositForMigrations;
          el.algorim = el.producto.codigoBarra + el.deposito.id;
          GenericService(this.tenant, this.service, this.token).update(el);
        });

        this.saveHistorial(this.migration, "Migración de productos");

        this.migration = [];
        this.destinationDepositForMigrations = {};

        setTimeout(() => {
          this.filterObjects(this.typeList);
        }, 500);
      } else {
        this.$errorAlert(
          "Debe seleccionar al menos 1 producto para migrar su stock de depósito"
        );
      }
    },
  },
};
</script>
<style>
.tab {
  margin-top: 1px;
}
</style>
