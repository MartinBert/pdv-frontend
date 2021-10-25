<template>
   <v-container style="min-width: 100%">
  <GlobalEvents
    @keyup="(e) => excecuteShortcut(e)"
  />
    <v-col cols="12" v-if="loaded">
      <v-card style="min-width: 100%">
        <v-row>
          <v-col>
            <v-form v-on:submit.prevent="saveSale()">
              <v-row>
                <v-col cols="4">
                   <v-text-field
                    label="Codigo de barras"
                    hide-details="auto"
                    id="searchBarCodeInput"
                    v-model="barCodeSearch"
                    @keyup="(e) => searchProduct(e)"
                  ></v-text-field>
                </v-col>
                <v-col cols="4" class="mt-5">
                  <div v-if="$store.state.ventasFast.discountPercent">
                    <h2>Descuento aplicado: {{$store.state.ventasFast.discountPercent}}%</h2>
                  </div>
                  <div v-if="$store.state.ventasFast.surchargePercent">
                    <h2>Recargo aplicado: {{$store.state.ventasFast.surchargePercent}}%</h2>
                  </div>
                </v-col>
                <v-col cols="4">
                  <v-container style="color: rgb(63, 81, 181)">
                    <v-row>
                      <v-col class="text-right">
                        <label class="mr-3">TOTAL:</label>
                        <input
                          disabled
                          class="totalInput"
                          v-model="$store.getters['ventasFast/totalVenta']"
                          type="text"
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col class="text-right">
                        <label class="mr-3">ITEMS:</label>
                        <input
                          disabled
                          class="totalInput"
                          type="text"
                          v-model="$store.getters['ventasFast/totalItems']"
                        />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
              </v-row>
              <div class="horizontalSeparator"></div>
              <v-row>
                <v-col cols="12">
                  <v-simple-table style="background-color: transparent">
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">Producto</th>
                          <th class="text-left">Codigo de barras</th>
                          <th class="text-left">Cantidad de unidades</th>
                          <th class="text-left">Precio unitario</th>
                          <th class="text-left">Precio total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="p in $store.state.ventasFast.products" :key="p.id">
                          <td>
                            {{ p.nombre }}
                          </td>
                          <td>{{ p.codigoBarra }}</td>
                          <td>
                            {{ p.cantUnidades }}
                          </td>
                          <td>${{ p.precioTotal }}</td>
                          <td>
                            <div v-show="hiddenElements === 2">
                              {{ p.precioTotalXCantidad = p.precioTotal * p.cantUnidades }}
                            </div>
                            <div v-if="p.editable === false">
                              ${{ p.precioTotalXCantidad }}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-dialog v-model="totalModificationDialog" width="400">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          <p style="text-align: center; width: 100%; padding: 0; margin: 0;">Aplicar porcentaje de variación</p>
        </v-card-title>
        <v-container class="text-center">
          <v-text-field
            id="modificationInput"
            style="width: 100%;"
            placeholder="Porcentaje"
            type="number"
            v-model="percentOfModification"
            @keyup="(e) => loadModification(e)"
          ></v-text-field>
        </v-container>
      </v-card>
    </v-dialog>
    <Spinner v-if="!loaded" />
  </v-container>
</template>
<script>
import ProductsService from "../../services/ProductsService";
import Spinner from "../../components/Graphics/Spinner";
import { getCurrentDate } from "../../helpers/dateHelper";
import axios from "axios";
import GlobalEvents from 'vue-global-events';
import GenericService from "../../services/GenericService";
export default {
  data: () => ({
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    hiddenElements: 1,
    tenant: "",
    service: "ventas",
    token: localStorage.getItem("token"),
    fecha: getCurrentDate(),
    loaded: true,
    object: {},
    clientIp: "",
    printName: "",
    percentOfModification: 0,
    totalModificationDialog: false,
    defaultPrint: false,
    barCodeSearch: ''
  }),

  components: {
    Spinner,
    GlobalEvents
  },

  created() {
    this.$barcodeScanner.init((barcode) => {
      this.barCodeSearch = this.onBarcodeScanned(barcode);
      this.searchProduct();
    });
  },

  destroyed() {
    this.$barcodeScanner.destroy();
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.getClientIpForFiscalController();
  },

  methods: {
    /******************************************************************************************************/
    /* ALL FUNCTIONS FOR GET OBJECTS ---------------------------------------------------------------------*/
    /******************************************************************************************************/
    getObjects() {},

    getClientIpForFiscalController() {
      axios.get("https://api.ipify.org?format=json").then((data) => {
        this.clientIp = data.data.ip;
      });
    },

    /******************************************************************************************************/
    /* GLOBAL KEY EVENTS ---------------------------------------------------------------------------------*/
    /******************************************************************************************************/
    excecuteShortcut(e){
      switch (e.keyCode) {
        case 66:
            this.getInputFocus('searchBarCodeInput')
          break;
        case 68:
            this.blurInputFocus('searchBarCodeInput');
            this.totalModificationDialog = true;
            setTimeout(() => {
              this.getInputFocus('modificationInput');
            }, 10);
          break;
        default:
          break;
      }
    },

    getInputFocus(inputId){
      document.getElementById(inputId).focus();
    },

    blurInputFocus(inputId){
      document.getElementById(inputId).blur();
    },
    onBarcodeScanned(barcode) {
      const filterParams = {
        productoName: "",
        productoCodigo: "",
        productoCodigoBarras: barcode,
        productoMarcaName: "",
        productoPrimerAtributoName: "",
        productoSegundoAtributoName: "",
        productoTercerAtributoName: "",
        productoEstado: 1,
        page: 1,
        size: 1,
        totalPages: 0,
      };
      GenericService(this.tenant, "productos", this.token)
        .filter(filterParams)
        .then((data) => {
          let databaseItem = data.data.content[0];
          if (this.products.length == 0) {
            databaseItem.cantUnidades = 1;
            databaseItem.total = databaseItem.precioTotal;
            this.products.push(this.processProductsObject(databaseItem));
            this.productsDescription.push({
              name: databaseItem.nombre,
              editable: databaseItem.editable,
              barCode: databaseItem.codigoBarra,
              code: databaseItem.codigoProducto,
              tradeMarkName: databaseItem.marca.nombre,
              tradeMarkId: databaseItem.marca.id,
              rubroName: databaseItem.rubro.nombre,
              rubroId: databaseItem.rubro.id,
              attributes: databaseItem.atributos,
              properties: databaseItem.propiedades,
              quantity: databaseItem.cantUnidades,
              costPrice: databaseItem.precioCosto,
              salePrice: databaseItem.precioTotal,
              buyIvaPercent: databaseItem.ivaComprasObject.porcentaje,
              saleIvaPercent: databaseItem.ivaVentasObject.porcentaje,
              buyIvaAmount: databaseItem.ivaCompra,
              saleIvaAmount: databaseItem.ivaVenta,
              providerData: databaseItem.proveedores
                ? databaseItem.proveedores
                : [],
            });
          } else {
            if (
              this.products.filter((el) => el.id === databaseItem.id).length > 0
            ) {
              this.products.filter((el) => el.id === databaseItem.id)[0]
                .cantUnidades++;
              this.products.filter(
                (el) => el.id === databaseItem.id
              )[0].precioTotal =
                this.products.filter((el) => el.id === databaseItem.id)[0]
                  .precioUnitario *
                this.products.filter((el) => el.id === databaseItem.id)[0]
                  .cantUnidades;

              this.productsDescription.filter(
                (el) => el.barCode === databaseItem.codigoBarra
              )[0].quantity++;
              this.productsDescription.filter(
                (el) => el.barCode === databaseItem.codigoBarra
              )[0].precioTotal =
                this.productsDescription.filter(
                  (el) => el.barCode === databaseItem.codigoBarra
                )[0].precioUnitario *
                this.productsDescription.filter(
                  (el) => el.barCode === databaseItem.codigoBarra
                )[0].quantity;
            } else {
              databaseItem.cantUnidades = 1;
              databaseItem.total = databaseItem.precioTotal;
              this.products.push(this.processProductsObject(databaseItem));
              this.productsDescription.push({
                name: databaseItem.nombre,
                editable: databaseItem.editable,
                barCode: databaseItem.codigoBarra,
                code: databaseItem.codigoProducto,
                tradeMarkName: databaseItem.marca.nombre,
                tradeMarkId: databaseItem.marca.id,
                rubroName: databaseItem.rubro.nombre,
                rubroId: databaseItem.rubro.id,
                attributes: databaseItem.atributos,
                properties: databaseItem.propiedades,
                quantity: databaseItem.cantUnidades,
                costPrice: databaseItem.precioCosto,
                salePrice: databaseItem.precioTotal,
                buyIvaPercent: databaseItem.ivaComprasObject.porcentaje,
                saleIvaPercent: databaseItem.ivaVentasObject.porcentaje,
                buyIvaAmount: databaseItem.ivaCompra,
                saleIvaAmount: databaseItem.ivaVenta,
                providerData: databaseItem.proveedores
                  ? databaseItem.proveedores
                  : [],
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
          this.$errorAlert("No existe un producto con ese código de barras");
        });
    },
    searchProduct(e){
        if(e.keyCode === 13){
          ProductsService(this.tenant, "productos", this.token)
          .getProductForBarCode(this.barCodeSearch)
          .then(res => {
            if(res.data) {
              res.data.cantUnidades = 1;
              this.$store.commit("ventasFast/addProductsToList", res.data);
            }else{
              this.$errorAlert("No se encontró un producto con ese codigo de barras") 
            }
          })
          .catch((err) => {
            console.error(err);
          })
        }
    },

    loadModification(e){
      if(e.keyCode === 13){
        this.$store.commit("ventasFast/loadModification", this.percentOfModification);
        this.totalModificationDialog = false;
      }
    },

    deleteProduct(e){
      if(e.key === 101){
        this.$store.commit("ventasFast/removeProductsToList");
      }
    }
  },
};
</script>
