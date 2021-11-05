<template>
  <v-container style="min-width: 100%">
    <GlobalEvents @keydown="(e) => excecuteShortcut(e)" />
    <v-col v-if="this.defaultConfig">
      <h3>Cliente: {{this.defaultConfig.clientePorDefecto.nombre}}, Comprobante: {{this.defaultConfig.documentoPorDefecto.nombre}}</h3>
    </v-col>
    <v-col cols="12" v-if="loaded">
      <v-card style="min-width: 100%">
        <v-row>
          <v-col>
            <v-form v-on:submit.prevent="saveSale()" ref="anyName">
              <v-row>
                <v-col cols="3">
                  <v-text-field
                    label="Codigo de barras"
                    hide-details="auto"
                    id="searchBarCodeInput"
                    v-model="barCodeSearch"
                    @keypress.esc="blurInputFocus(e)"
                    @keyup="(e) => searchWithInput(e)"
                  ></v-text-field>
                </v-col>
                <v-col cols="3" class="mt-5">
                  <div v-if="$store.state.ventasFast.discountPercent">
                    <h2>
                      Descuento aplicado:
                      {{ $store.state.ventasFast.discountPercent }}%
                    </h2>
                  </div>
                  <div v-if="$store.state.ventasFast.surchargePercent">
                    <h2>
                      Recargo aplicado:
                      {{ $store.state.ventasFast.surchargePercent }}%
                    </h2>
                  </div>
                </v-col>
                <v-col cols="3">
                  <div v-if="$store.state.ventasFast.paymentMethod">
                    <h2>
                      Medio de pago:
                      {{ $store.state.ventasFast.paymentMethod.nombre }}
                    </h2>
                  </div>
                  <div v-if="$store.state.ventasFast.paymentPlan">
                    <h2>
                      Plan de pago:
                      {{ $store.state.ventasFast.paymentPlan.nombre }}
                    </h2>
                  </div>
                </v-col>
                <v-col cols="3">
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
                        <tr
                          v-for="p in $store.state.ventasFast.products"
                          :key="p.id"
                        >
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
                              {{
                                (p.precioTotalXCantidad =
                                  p.precioTotal * p.cantUnidades)
                              }}
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
          <p style="text-align: center; width: 100%; padding: 0; margin: 0;">
            Aplicar porcentaje de variación
          </p>
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
    <v-dialog v-model="totalProductload" @input="$store.commit('ventasFast/deleteWhenQuantityZero')" width="800">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          <p style="text-align: center; width: 100%; padding: 0; margin: 0;">
            Eliminar productos de la lista
          </p>
        </v-card-title>
          <v-container class="text-center">
          <v-text-field
            dense
            outlined
            rounded
            class="text-left"
            label="Codigo de Barras"
            append-icon="mdi-magnify"
            v-model="searchOfDialog"
            id="dialogInput"
            @keydown="(e) => searchProductToModify(e)"
          ></v-text-field>
            <v-simple-table style="background-color: transparent" v-if="searchOfDialog && $store.state.ventasFast.products.find(el => el.codigoBarra === searchOfDialog)">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Producto</th>
                    <th class="text-left">Codigo de barras</th>
                    <th class="text-left">Cantidad de unidades</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ $store.state.ventasFast.products.find(el => el.codigoBarra === searchOfDialog).nombre }}</td>
                    <td>{{ $store.state.ventasFast.products.find(el => el.codigoBarra === searchOfDialog).codigoBarra }}</td>
                    <input
                    id="cantUnidades"
                    type="number"
                    v-model="$store.state.ventasFast.products.find(el => el.codigoBarra === searchOfDialog).cantUnidades"
                    />
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-container>
      </v-card>
    </v-dialog>
    <v-dialog v-model="paymentMethodSelection" @input="selectPaymentMethod()" width="800">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          <p style="text-align: center; width: 100%; padding: 0; margin: 0;">
            Seleccione un medio de pago
          </p>
        </v-card-title>
          <v-container class="text-center">
            <v-autocomplete
              :items="mediosPago"
              item-text="nombre"
              :return-object="true"
              v-model="medioPagoSeleccionado"
              id="medioPagoAutocomplete"
            />
          </v-container>
      </v-card>
    </v-dialog>
    <v-dialog v-model="paymentPlanSelection" @input="selectPaymentPlan()" width="800">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          <p style="text-align: center; width: 100%; padding: 0; margin: 0;">
            Seleccione un plan de pago
          </p>
        </v-card-title>
          <v-container class="text-center">
            <v-autocomplete
              :items="$store.state.ventasFast.paymentPlans"
              item-text="nombre"
              :return-object="true"
              v-model="planPagoSeleccionado"
              id="planPagoAutocomplete"
            />
          </v-container>
      </v-card>
    </v-dialog>
    <Spinner v-if="!loaded" />
  </v-container>
</template>
<script>
import ProductsService from "../../services/ProductsService";
import VentasFastService from "../../services/VentasFastService";
import GenericService from "../../services/GenericService";
import Spinner from "../../components/Graphics/Spinner";
import { getCurrentDate } from "../../helpers/dateHelper";
import axios from "axios";
import GlobalEvents from "vue-global-events";
import {decimalPercent, roundTwoDecimals} from '../../helpers/mathHelper';

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
    productOfModification:"",
    totalModificationDialog: false,
    totalProductload:false,
    defaultPrint: false,
    barCodeSearch: "",
    writedBarCodes: [],
    searchOfDialog: null,
    defaultConfig: null,
    paymentMethodSelection: false,
    mediosPago: [],
    medioPagoSeleccionado: null,
    paymentPlanSelection: false,
    planPagoSeleccionado: null
  }),

  components: {
    Spinner,
    GlobalEvents,
  },

  created() {
    this.$barcodeScanner.init((barcode) => {
      this.blurInputFocus("searchBarCodeInput");
      if(this.totalProductload){
        this.$store.commit('ventasFast/focusToProduct', barcode)
        this.searchOfDialog = null;
      }else{
        setTimeout(() => {
          this.searchWithScanner(barcode);
        }, 50);
      }
    });
  },

  destroyed() {
    this.$barcodeScanner.destroy();
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.getClientIpForFiscalController();
    this.getObjects();
  },

  methods: {
    /******************************************************************************************************/
    /* ALL FUNCTIONS FOR GET OBJECTS ---------------------------------------------------------------------*/
    /******************************************************************************************************/
    getObjects() {
      VentasFastService(this.tenant, "ventasFastConfig", this.token)
      .getSelected(this.loguedUser.sucursal.id)
      .then(data => {
        this.defaultConfig = data.data;
      })
      GenericService(this.tenant, "mediosPago", this.token)
      .filter({
        sucursalId: this.loguedUser.sucursal.id,
        medioPagoName: "",
        page: 1,
        size: 1000000,
        totalPages: 0,
      })
      .then(data => {
        this.mediosPago = data.data.content;
        console.log(this.mediosPago);
      })
    },

    getClientIpForFiscalController() {
      axios.get("https://api.ipify.org?format=json").then((data) => {
        this.clientIp = data.data.ip;
      });
    },

    /******************************************************************************************************/
    /* GLOBAL KEY EVENTS ---------------------------------------------------------------------------------*/
    /******************************************************************************************************/
    excecuteShortcut(e) {
      console.log(e.keyCode);
      switch (e.keyCode) {
        case 32:
          this.blurInputFocus("searchBarCodeInput");
          if(this.$store.state.ventasFast.paymentMethod && this.$store.state.ventasFast.paymentPlan){
            this.$successAlert("Vendiste merca a los pendejos, felicidades")
          }else if(this.$store.state.ventasFast.paymentMethod){
            this.paymentPlanSelection = true;
            setTimeout(() => {
              this.getInputFocus("planPagoAutocomplete");
            }, 50)
          }else{
            this.paymentMethodSelection = true;
            setTimeout(() => {
              this.getInputFocus("medioPagoAutocomplete");
            }, 50)
          }
          break;
        case 67:
          this.blurInputFocus("dialogInput");
           setTimeout(() => {
            this.getInputFocus("cantUnidades");
          }, 50)
          break;
        case 81:          
          this.totalProductload = true;
          setTimeout(() => {
            this.getInputFocus("dialogInput");
          }, 50)
          break;
        case 66:
          this.getInputFocus("searchBarCodeInput");
          setTimeout(() => {
            this.barCodeSearch = '';
          }, 50)
          break;
        case 68:
          this.blurInputFocus("searchBarCodeInput");
           setTimeout(() => {
              this.getInputFocus('modificationInput');
            },50);
          this.totalModificationDialog = true;
          break;
        case 69:
          this.blurInputFocus("searchBarCodeInput");
          if(!this.totalProductload){
          this.$store.commit("ventasFast/removeProductsToList", this.writedBarCodes[this.writedBarCodes.length - 1]);
          this.writedBarCodes = this.writedBarCodes.filter(el => el !== this.writedBarCodes[this.writedBarCodes.length - 1]);
          }
          if(this.totalProductload){
            this.$store.commit("ventasFast/removeProductsToList",this.writedBarCodes);
            console.log("Eliminando producto");
          }
          break;
        default:
          break;
      }
    },

    selectPaymentMethod(){
      if(this.medioPagoSeleccionado){
        this.$store.commit('ventasFast/addPaymentMethod', this.medioPagoSeleccionado)
      }
    },

    selectPaymentPlan(){
      if(this.planPagoSeleccionado){
        this.$store.commit('ventasFast/addPaymentPlan', this.planPagoSeleccionado)
      }
    },

    searchProductToModify(e){
      if(e.keyCode === 13){
        this.$store.commit('ventasFast/focusToProduct', this.searchOfDialog)
        this.searchOfDialog = null;
        this.blurInputFocus('dialogInput');
      }
    },

    resetForm() {
      this.barCodeSearch = "";
    },

    getInputFocus(inputId) {
      document.getElementById(inputId).focus();
    },

    blurInputFocus(inputId) {
      document.getElementById(inputId).blur();
    },

    searchWithInput(e) {
      if (e.keyCode === 13) {
        this.search(this.barCodeSearch);
      }
      if (e.keyCode === 27) {
        document.getElementById("searchBarCodeInput").blur();
        this.barCodeSearch = "";
      }
    },

    searchWithScanner(barcode, e) {
      this.search(barcode);
      if (e.keyCode === 13) {
        this.search(barcode);
      }
      if (e.keyCode === 27) {
        document.getElementById("searchBarCodeInput").blur();
        this.barCodeSearch = "";
      }
    },

    search(barcode) {
      this.writedBarCodes.push(barcode);
      console.log(this.writedBarCodes);
      ProductsService(this.tenant, "productos", this.token)
        .getProductForBarCode(barcode)
        .then((res) => {
          if (res.data) {
            res.data.cantUnidades = 1;
            this.$store.commit("ventasFast/addProductsToList", res.data);
          } else {
            this.$errorAlert(
              "No se encontró un producto con ese codigo de barras"
            );
            this.barCodeSearch = "";
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },

    loadModification(e) {
      if (e.keyCode === 13) {
        this.$store.commit(
          "ventasFast/loadModification",
          this.percentOfModification
        );
        this.totalModificationDialog = false;
      }
    },

    loadProductDelete(e){
      if(e.keyCode === 81){
        console.log("Alla la estan apretando");
        this.$store.commit("productos/dialogProductosMutation");
        this.totalProductload = false;
      }
    },

    deleteProduct(e, object) {
      if (e.keyCode === 69) {
        console.log("Borrando");
        this.$store.commit("ventasFast/removeProductsToList", object.id);
      }
    },

    saveSale(){
      if(!this.defaultConfig) return this.$errorAlert(
        "No hay caracteristicas predeterminadas configuradas, contacte a su administrador para que configure las caracteristicas predeterminadas de la venta rapida"
      );
      const { nombre, presupuesto, tipo } = this.defaultConfig.documentoPorDefecto;
      if(nombre.includes('TIQUE FACTURA')) return this.saveTicketOnFiscalController(nombre);
      if(presupuesto) return this.savePresupuesto();
      if(tipo) return this.saveFiscalSale();
      if(!tipo) return this.saveNotFiscalSale();    
    },

    /******************************************************************************************************/
    /* ALL FUNCTIONS FOR FISCAL CONTROLLER ---------------------------------------------------------------*/
    /******************************************************************************************************/
    saveTicketOnFiscalController(documentName) {
      switch (documentName) {
        case "TIQUE FACTURA A":
          this.saveTicketInvoiceA();
          break;
        case "TIQUE FACTURA B":
          this.saveTicketInvoiceB();
          break;
        default:
          this.saveTicketInvoiceC();
          break;
      }
    },

    saveTicketInvoiceA() {
      this.sendTicketData(this.createJsonForTicketInvoiceA(), "ticket_a");
    },

    saveTicketInvoiceB() {
      this.sendTicketData(this.createJsonForTicketInvoiceB(), "ticket_b");
    },

    saveTicketInvoiceC() {
      this.sendTicketData(this.createJsonForTicketInvoiceC(), "ticket");
    },

    sendTicketData(jsonToFiscalController, ticketRoute) {
      axios
        .post(`http://${this.clientIp}/${ticketRoute}`, jsonToFiscalController)
        .then(() => {
          this.$successAlert("Venta realizada");
          this.clear();
          this.loaded = true;
        })
        .catch((err) => {
          console.error(err);
        });
    },

    createJsonForTicketInvoiceA() {
      const jsonToFiscalController = {
        client: this.getClientData(),
        surcharge: this.getTotalSurcharges("A"),
        discount: this.getTotalDiscounts("A"),
        items: this.getItemsForFiscalTicketInvoice("A"),
      };
      return jsonToFiscalController;
    },

    createJsonForTicketInvoiceB() {
      const jsonToFiscalController = {
        client: this.getClientData(),
        surcharge: this.getTotalSurcharges("B"),
        discount: this.getTotalDiscounts("B"),
        items: this.getItemsForFiscalTicketInvoice("B"),
      };
      return jsonToFiscalController;
    },

    createJsonForTicketInvoiceC() {
      const jsonToFiscalController = {
        surcharge: this.getTotalSurcharges("C"),
        discount: this.getTotalDiscounts("C"),
        items: this.getItemsForFiscalTicketInvoice("C"),
      };
      return jsonToFiscalController;
    },

    getClientData() {
      const formattedObject = {
        name: this.defaultConfig.clientePorDefecto.nombre,
        socialReason: this.defaultConfig.clientePorDefecto.razonSocial,
        cuit: this.defaultConfig.clientePorDefecto.cuit,
        direction: this.defaultConfig.clientePorDefecto.direccion,
      };
      return formattedObject;
    },

    getTotalSurcharges(letter) {
      const totalSurcharge = this.$store.getter['ventasFast/totalSurcharge'];
      console.log(letter);
      return totalSurcharge.toString();
    },

    getTotalDiscounts(letter) {
      const totalDiscount = this.$store.getter['ventasFast/totalDiscount'];
      console.log(letter);
      return totalDiscount.toString();
    },

    getItemsForFiscalTicketInvoice(letter) {
      let items = [];
      switch (letter) {
        case "A":
          items = this.itemsInvoiceA();
          break;
        case "B":
          items = this.itemsInvoiceB();
          break;
        default:
          items = this.itemsInvoiceC();
          break;
      }
      return items;
    },

    itemsInvoiceA() {
      let items = [];
      const validItems = this.products.filter(
        (el) =>
          !el.nombre.includes("DESCUENTO") && !el.nombre.includes("RECARGO")
      );
      validItems.forEach((el) => {
        const formattedObject = {
          name: el.nombre,
          quantity: el.cantUnidades.toString(),
          price: roundTwoDecimals(
            el.precioUnitario / (1 + decimalPercent(el.ivaVentas))
          ).toString(),
        };
        items.push(formattedObject);
      });
      return items;
    },

    itemsInvoiceB() {
      let items = [];
      const validItems = this.products.filter(
        (el) =>
          !el.nombre.includes("DESCUENTO") && !el.nombre.includes("RECARGO")
      );
      validItems.forEach((el) => {
        const formattedObject = {
          name: el.nombre,
          quantity: el.cantUnidades.toString(),
          price: roundTwoDecimals(
            el.precioUnitario / (1 + decimalPercent(el.ivaVentas))
          ).toString(),
        };
        items.push(formattedObject);
      });
      return items;
    },

    itemsInvoiceC() {
      let items = [];
      const validItems = this.products.filter(
        (el) =>
          !el.nombre.includes("DESCUENTO") && !el.nombre.includes("RECARGO")
      );
      validItems.forEach((el) => {
        const formattedObject = {
          name: el.nombre,
          quantity: el.cantUnidades.toString(),
          price: el.precioUnitario.toString(),
        };
        items.push(formattedObject);
      });
      return items;
    },
    
  },
};
</script>
