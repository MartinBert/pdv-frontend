<template>
  <v-container style="min-width: 100%">
    <GlobalEvents @keydown="(e) => excecuteShortcut(e)" />
    <v-col v-if="this.defaultConfig">
      <h3>
        Cliente: {{ this.defaultConfig.clientePorDefecto.nombre }}, Comprobante:
        {{ this.defaultConfig.documentoPorDefecto.nombre }}
      </h3>
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
    <v-dialog
      v-model="totalProductload"
      @input="$store.commit('ventasFast/deleteWhenQuantityZero')"
      width="800"
    >
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
          <v-simple-table
            style="background-color: transparent"
            v-if="
              searchOfDialog &&
                $store.state.ventasFast.products.find(
                  (el) => el.codigoBarra === searchOfDialog
                )
            "
          >
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
                  <td>
                    {{
                      $store.state.ventasFast.products.find(
                        (el) => el.codigoBarra === searchOfDialog
                      ).nombre
                    }}
                  </td>
                  <td>
                    {{
                      $store.state.ventasFast.products.find(
                        (el) => el.codigoBarra === searchOfDialog
                      ).codigoBarra
                    }}
                  </td>
                  <input
                    id="cantUnidades"
                    type="number"
                    v-model="
                      $store.state.ventasFast.products.find(
                        (el) => el.codigoBarra === searchOfDialog
                      ).cantUnidades
                    "
                  />
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="paymentMethodSelection"
      @input="selectPaymentMethod()"
      width="800"
    >
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
    <v-dialog
      v-model="paymentPlanSelection"
      @input="selectPaymentPlan()"
      width="800"
    >
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
import ReportsService from "../../services/ReportsService";
import StocksService from "../../services/StocksService";
import { printReceipt } from "../../services/ImpresionService";
import Spinner from "../../components/Graphics/Spinner";
import Swal from "sweetalert2";
import {
  getCurrentDate,
  getInternationalDate,
  formatDate,
  formatDateWithoutSlash,
} from "../../helpers/dateHelper";
import { formatFiscalInvoice } from "../../helpers/receiptFormatHelper";
import axios from "axios";
import GlobalEvents from "vue-global-events";
import { addZerosInString } from "../../helpers/stringHelper";
import {
  decimalPercent,
  roundTwoDecimals,
  sumarNumeros,
  transformPositive,
  calculatePositivePercentajeCoefficient,
} from "../../helpers/mathHelper";

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
    products: [],
    productsDescription: [],
    percentOfModification: 0,
    productOfModification: "",
    totalModificationDialog: false,
    totalProductload: false,
    defaultPrint: false,
    barCodeSearch: "",
    writedBarCodes: [],
    searchOfDialog: null,
    defaultConfig: null,
    paymentMethodSelection: false,
    mediosPago: [],
    medioPagoSeleccionado: null,
    paymentPlanSelection: false,
    planPagoSeleccionado: null,
    totalVenta: 0
  }),

  components: {
    Spinner,
    GlobalEvents,
  },

  created() {
    this.$barcodeScanner.init((barcode) => {
      this.blurInputFocus("searchBarCodeInput");
      if (this.totalProductload) {
        this.$store.commit("ventasFast/focusToProduct", barcode);
        this.searchOfDialog = null;
      } else {
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
        .then((data) => {
          this.defaultConfig = data.data;
        });
      GenericService(this.tenant, "mediosPago", this.token)
        .filter({
          sucursalId: this.loguedUser.sucursal.id,
          medioPagoName: "",
          page: 1,
          size: 1000000,
          totalPages: 0,
        })
        .then((data) => {
          this.mediosPago = data.data.content;
        });
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
      switch (e.keyCode) {
        case 32:
          this.blurInputFocus("searchBarCodeInput");
          if (
            this.$store.state.ventasFast.paymentMethod &&
            this.$store.state.ventasFast.paymentPlan
          ) {
            this.saveSale();
          } else if (this.$store.state.ventasFast.paymentMethod) {
            this.paymentPlanSelection = true;
            setTimeout(() => {
              this.getInputFocus("planPagoAutocomplete");
            }, 50);
          } else {
            this.paymentMethodSelection = true;
            setTimeout(() => {
              this.getInputFocus("medioPagoAutocomplete");
            }, 50);
          }
          break;
        case 67:
          this.blurInputFocus("dialogInput");
          setTimeout(() => {
            this.getInputFocus("cantUnidades");
          }, 50);
          break;
        case 81:
          this.totalProductload = true;
          setTimeout(() => {
            this.getInputFocus("dialogInput");
          }, 50);
          break;
        case 66:
          this.getInputFocus("searchBarCodeInput");
          setTimeout(() => {
            this.barCodeSearch = "";
          }, 50);
          break;
        case 68:
          this.blurInputFocus("searchBarCodeInput");
          setTimeout(() => {
            this.getInputFocus("modificationInput");
          }, 50);
          this.totalModificationDialog = true;
          break;
        case 69:
          this.blurInputFocus("searchBarCodeInput");
          if (!this.totalProductload) {
            this.$store.commit(
              "ventasFast/removeProductsToList",
              this.writedBarCodes[this.writedBarCodes.length - 1]
            );
            this.writedBarCodes = this.writedBarCodes.filter(
              (el) => el !== this.writedBarCodes[this.writedBarCodes.length - 1]
            );
          }
          if (this.totalProductload) {
            this.$store.commit(
              "ventasFast/removeProductsToList",
              this.writedBarCodes
            );
            console.log("Eliminando producto");
          }
          break;
        default:
          break;
      }
    },

    selectPaymentMethod() {
      if (this.medioPagoSeleccionado) {
        this.$store.commit(
          "ventasFast/addPaymentMethod",
          this.medioPagoSeleccionado
        );
      }
    },

    selectPaymentPlan() {
      if (this.planPagoSeleccionado) {
        this.$store.commit(
          "ventasFast/addPaymentPlan",
          this.planPagoSeleccionado
        );
      }
    },

    searchProductToModify(e) {
      if (e.keyCode === 13) {
        this.$store.commit("ventasFast/focusToProduct", this.searchOfDialog);
        this.searchOfDialog = null;
        this.blurInputFocus("dialogInput");
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

    loadProductDelete(e) {
      if (e.keyCode === 81) {
        this.$store.commit("productos/dialogProductosMutation");
        this.totalProductload = false;
      }
    },

    deleteProduct(e, object) {
      if (e.keyCode === 69) {
        this.$store.commit("ventasFast/removeProductsToList", object.id);
      }
    },

    saveSale() {
      if (!this.defaultConfig)
        return this.$errorAlert(
          "No hay caracteristicas predeterminadas configuradas, contacte a su administrador para que configure las caracteristicas predeterminadas de la venta rapida"
        );
      const { nombre, tipo } = this.defaultConfig.documentoPorDefecto;
      if (nombre.includes("TIQUE FACTURA"))
        return this.saveTicketOnFiscalController(nombre);
      if (tipo) return this.saveFiscalSale();
      if (!tipo) return this.saveNotFiscalSale();
    },

    /******************************************************************************************************/
    /* ALL FUNCTIONS FOR FORMAT OBJECTS ------------------------------------------------------------------*/
    /******************************************************************************************************/
    processProductsObject(producto) {
      const {
        id,
        nombre,
        codigoBarra,
        cantUnidades,
        precioTotal,
        ivaVentasObject,
        precioTotalXCantidad,
        editable,
      } = producto;
      let object = {
        id: id,
        nombre: nombre,
        codigoBarra: codigoBarra,
        cantUnidades: cantUnidades,
        precioUnitario: parseFloat(precioTotal),
        ivaVentas: ivaVentasObject.porcentaje,
        precioTotal: parseFloat(precioTotalXCantidad),
        editable: editable,
      };
      return object;
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

    getTotalSurcharges() {
      const totalSurcharge = this.$store.getter["ventasFast/totalSurcharge"];
      return totalSurcharge.toString();
    },

    getTotalDiscounts() {
      const totalDiscount = this.$store.getter["ventasFast/totalDiscount"];
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

    /******************************************************************************************************/
    /* ALL FUNCTIONS FOR FISCAL SALE ---------------------------------------------------------------------*/
    /******************************************************************************************************/
    saveFiscalSale() {
      this.$store.state.ventasFast.products.forEach(el => {
        const formattedObject = this.processProductsObject(el);
        this.products.push(formattedObject);
      })
      this.productsDescription = this.$store.state.ventasFast.products;
      this.totalVenta = this.$store.getters['ventasFast/totalVenta'];
      Swal.fire("Generando Venta", "Espere por favor", "info");
      const sucursal = this.loguedUser.sucursal;
      const ptoVenta = this.loguedUser.puntoVenta;
      const products = this.products;
      const productsDetail = this.productsDetail;
      const documento = this.defaultConfig.documentoPorDefecto;
      const empresa = this.loguedUser.empresa;
      const cliente = this.defaultConfig.clientePorDefecto;
      const mediosPago = this.object.mediosPago;
      const totalVenta = this.totalVenta;
      const tenant = this.tenant;
      const token = this.token;
      const service = this.service;
      const planPago = this.object.planPago;
      const condVenta = this.checkSaleCondition(planPago);
      let comprobante;
      let file;
      let fileURL;
      let invoice;

      /*** Get last invoice emmited number ***/
      axios
        .get(
          `${process.env.VUE_APP_API_AFIP}/rest_api_afip/obtenerUltimoNumeroAutorizado/${sucursal.cuit}/${ptoVenta.idFiscal}/${documento.codigoDocumento}`
        )
        .then((data) => {
          const numberOfReceipt = parseInt(data.data.responseOfAfip) + 1;
          const dataForCreateInvoice = {
            ptoVentaId: ptoVenta.idFiscal,
            receiptCode: documento.codigoDocumento,
            clientCuit: cliente.cuit,
            percentIngBrutos: cliente.alicIngBrutos,
            numberOfReceipt: numberOfReceipt,
            date: getInternationalDate(),
            products: products,
            totalVenta: totalVenta,
          };
          invoice = formatFiscalInvoice(documento.letra, dataForCreateInvoice);

          /*** Send invoice to AFIP ***/
          axios
            .post(
              `${process.env.VUE_APP_API_AFIP}/rest_api_afip/generarComprobante/${sucursal.cuit}`,
              invoice
            )
            .then((data) => {
              const cae = data.data.CAE;
              const dateOfCaeExpiration = data.data.CAEFchVto;
              const barCode =
                sucursal.cuit +
                addZerosInString("02", documento.codigoDocumento) +
                addZerosInString("04", ptoVenta.idFiscal) +
                cae +
                formatDateWithoutSlash(dateOfCaeExpiration);

              this.calculateRelevantAmountsOfInvoice().then(
                ({
                  total,
                  subTotal,
                  amountOfIva21,
                  amountOfIva10,
                  amountOfIva27,
                  totalOfIvas,
                  totalOfDiscounts,
                  totalOfSurcharges,
                  planPercentSurcharge,
                  planPercentDiscount,
                  planAmountSurcharge,
                  planAmountDiscount,
                }) => {
                  // Create receipt
                  if (total && subTotal && amountOfIva21) {
                    comprobante = {
                      letra: documento.letra,
                      numeroCbte:
                        addZerosInString("04", ptoVenta.idFiscal) +
                        "-" +
                        addZerosInString("08", numberOfReceipt),
                      fechaEmision: formatDate(getCurrentDate()),
                      fechaVto: formatDate(dateOfCaeExpiration),
                      correlativoComprobante: numberOfReceipt,
                      condicionVenta: condVenta,
                      productos: products,
                      productosDetalle: productsDetail,
                      productoDescription: this.productsDescription,
                      barCode: barCode,
                      cae: cae,
                      logoUrl: this.loguedUser.sucursal.logo,
                      puntoVenta: ptoVenta,
                      sucursal: sucursal,
                      documentoComercial: documento,
                      empresa: empresa,
                      cliente: cliente,
                      totalVenta: total,
                      subTotal: subTotal,
                      totalDescuentoGlobal: this.descuentoGlobal,
                      totalRecargoGlobal: this.recargoGlobal,
                      porcentajeDescuentoGlobal: this.porcentajeDescuentoGlobal,
                      porcentajeRecargoGlobal: this.porcentajeRecargoGlobal,
                      totalIva21: amountOfIva21,
                      totalIva10: amountOfIva10,
                      totalIva27: amountOfIva27,
                      totalIvas: totalOfIvas,
                      totalDescuentos: totalOfDiscounts,
                      totalRecargos: totalOfSurcharges,
                      porcentajeRecargoPlan: planPercentSurcharge,
                      porcentajeDescuentoPlan: planPercentDiscount,
                      totalDescuentoPlan: roundTwoDecimals(planAmountDiscount),
                      totalRecargoPlan: roundTwoDecimals(planAmountSurcharge),
                      mediosPago: [mediosPago],
                      planesPago: [planPago],
                      nombreDocumento: documento.nombre,
                    };
                  } else {
                    comprobante = this.object;
                    comprobante.letra = documento.letra;
                    comprobante.numeroCbte =
                      addZerosInString("04", ptoVenta.idFiscal) +
                      "-" +
                      addZerosInString("08", numberOfReceipt);
                    comprobante.fechaEmision = formatDate(getCurrentDate());
                    comprobante.fechaVto = formatDate(dateOfCaeExpiration);
                    comprobante.correlativoComprobante = numberOfReceipt;
                    comprobante.condicionVenta = condVenta;
                    comprobante.barCode = barCode;
                    comprobante.cae = cae;
                    comprobante.mediosPago = [this.object.mediosPago];
                    comprobante.planesPago = this.object.planesPago;
                    comprobante.nombreDocumento = documento.nombre;
                    comprobante.documentoComercial = documento;
                  }

                  if (this.object.id) {
                    comprobante.id = this.object.id;
                  }

                  console.log(comprobante);

                  /*** Save receipt in database and print invoice ***/
                  if (comprobante.cae) {
                    GenericService(tenant, "comprobantesFiscales", token)
                      .save(comprobante)
                      .then(() => {
                        ReportsService(tenant, service, token)
                          .onCloseSaleReport(comprobante)
                          .then((res) => {
                            file = new Blob([res["data"]], {
                              type: "application/pdf",
                            });
                            fileURL = URL.createObjectURL(file);
                            window.open(fileURL, "_blank");
                            if (this.defaultPrint) {
                              printReceipt(
                                comprobante,
                                this.printName,
                                this.valorPrint
                              );
                            }
                          });
                      })
                      .then(() => {
                        this.applyStockModifications(comprobante);
                      });
                  } else {
                    this.$errorAlert("Tipo de comprobante no disponible").then(
                      (result) => {
                        if (result.isDismissed) {
                          this.loaded = true;
                        }
                      }
                    );
                  }
                }
              );
            })
            .catch((err) => {
              console.log(
                "---------------- ERROR IN AFIP RESPONSE ----------------"
              );
              console.log(err);
              this.loaded = true;
            });
        });
    },
    /******************************************************************************************************/
    /* ALL FUNCTIONS TO CALCULATE STATUS OF STOCKS IN SALE -----------------------------------------------*/
    /******************************************************************************************************/
    applyStockModifications(comprobante) {
      comprobante.productos.forEach((product) => {
        StocksService(this.tenant, "stock", this.token)
          .getStockByProductCodeBarInDefaultDeposit(
            product.codigoBarra,
            comprobante.sucursal.id
          )
          .then((data) => {
            let stock = data.data;
            if (stock) {
              stock.cantidad = stock.cantidad - Number(product.cantUnidades);
              this.saveStockModifications(stock, comprobante.productos.length);
            } else {
              StocksService(this.tenant, "stock", this.token)
                .getStockByProductCodeBarInAnyDeposit(
                  product.codigoBarra,
                  comprobante.sucursal.id
                )
                .then((data) => {
                  let firstStockDetected = data.data[0];
                  if (firstStockDetected) {
                    firstStockDetected.cantidad =
                      firstStockDetected.cantidad -
                      Number(product.cantUnidades);
                    this.saveStockModifications(
                      firstStockDetected,
                      comprobante.productos.length
                    );
                  } else {
                    this.saveStockModifications(
                      product.nombre,
                      comprobante.productos.length
                    );
                  }
                });
            }
          });
      });
    },

    saveStockModifications(stock, processProductsLength) {
      if (typeof stock === "string") {
        this.productsWithoutStock.push(stock);
        this.processStockResult.push("success");
        if (this.processStockResult.length === processProductsLength) {
          this.endSaleProcess();
        }
      } else {
        if (
          stock.cantidadMinima &&
          !stock.cantidadMinima.includes("asign") &&
          stock.cantidad < parseFloat(stock.cantidadMinima)
        ) {
          this.lowStock.push(stock.producto.nombre);
        }
        if (!stock.deposito.defaultDeposit) {
          this.productsInOtherDeposits.push(stock.producto.nombre);
        }
        GenericService(this.tenant, "stock", this.token)
          .save(stock)
          .then(() => {
            this.processStockResult.push("success");
            if (this.processStockResult.length === processProductsLength) {
              this.endSaleProcess();
            }
          })
          .catch((err) => {
            this.$errorAlert("Error al procesar stock");
            this.loaded = true;
            console.error(err);
          });
      }
    },

    endSaleProcess() {
      if (this.productsWithoutStock.length > 0) {
        this.$infoAlert2(
          `No existo un registro de stock de estos productos: ${this.productsWithoutStock.reduce(
            (acc, el) => acc + ", " + el
          )}.`
        ).then(() => {
          if (this.lowStock.length > 0) {
            this.$infoAlert2(
              `Productos bajos de stock: ${this.lowStock.reduce(
                (acc, el) => acc + ", " + el
              )}`
            ).then(() => {
              if (this.productsInOtherDeposits.length > 0) {
                this.$infoAlert2(
                  `Estos productos no se encuentran en el depósito principal: ${this.productsInOtherDeposits.reduce(
                    (acc, el) => acc + ", " + el
                  )}. Sus unidades fueron descontadas de otros depósitos.`
                ).then(() => {
                  this.$successAlert("Facturación realizada").then(() => {
                    this.clear();
                  });
                });
              } else {
                this.$successAlert("Facturación realizada").then(() => {
                  this.clear();
                });
              }
            });
          } else if (this.productsInOtherDeposits.length > 0) {
            this.$infoAlert2(
              `Estos productos no se encuentran en el depósito principal: ${this.productsInOtherDeposits.reduce(
                (acc, el) => acc + ", " + el
              )}. Sus unidades fueron descontadas de otros depósitos.`
            ).then(() => {
              this.$successAlert("Facturación realizada").then(() => {
                this.clear();
              });
            });
          } else {
            this.$successAlert("Facturación realizada").then(() => {
              this.clear();
            });
          }
        });
      } else if (this.lowStock.length > 0) {
        this.$infoAlert2(
          `Productos bajos de stock: ${this.lowStock.reduce(
            (acc, el) => acc + ", " + el
          )}`
        ).then(() => {
          if (this.productsInOtherDeposits.length > 0) {
            this.$infoAlert2(
              `Estos productos no se encuentran en el depósito principal: ${this.productsInOtherDeposits.reduce(
                (acc, el) => acc + ", " + el
              )}. Sus unidades fueron descontadas de otros depósitos.`
            ).then(() => {
              this.$successAlert("Facturación realizada").then(() => {
                this.clear();
              });
            });
          } else {
            this.$successAlert("Facturación realizada").then(() => {
              this.clear();
            });
          }
        });
      } else if (this.productsInOtherDeposits.length > 0) {
        this.$infoAlert2(
          `Estos productos no se encuentran en el depósito principal: ${this.productsInOtherDeposits.reduce(
            (acc, el) => acc + ", " + el
          )}. Sus unidades fueron descontadas de otros depósitos.`
        ).then(() => {
          this.$successAlert("Facturación realizada").then(() => {
            this.clear();
          });
        });
      } else {
        this.$successAlert("Facturación realizada").then(() => {
          this.clear();
        });
      }
    },

    /******************************************************************************************************/
    /* ALL FUNCTIONS TO CALCULATE PRICE ALTERATIONS ------------------------------------------------------*/
    /******************************************************************************************************/
    async calculateRelevantAmountsOfInvoice() {
      const planPago = this.$store.state.ventasFast.paymentPlan;

      this.productsDescription = await this.restLineDiscounts(
        this.products,
        this.productsDescription
      );

      this.productsDescription = await this.sumLineSurcharges(
        this.products,
        this.productsDescription
      );

      this.productsDescription = await this.restGlobalDiscount(
        this.productsDescription,
        this.porcentajeDescuentoGlobal
      );

      this.productsDescription = await this.sumGlobalSurcharge(
        this.productsDescription,
        this.porcentajeRecargoGlobal
      );

      this.productsDescription = await this.applyPaymentPlantPercentVariation(
        this.productsDescription,
        planPago.porcentaje
      );

      this.productsDescription = await this.calculateAmountOfPriceVariations(
        this.productsDescription
      );

      const totalOfDiscounts = await this.calculateTotalOfDiscounts(
        this.productsDescription
      );

      const totalOfSurcharges = await this.calculateTotalOfSurcharges(
        this.productsDescription
      );

      const subTotal = await this.calculateSumOfProductSalePrices(
        this.productsDescription
      );

      const planAmountDiscount =
        planPercentDiscount > 0
          ? subTotal * decimalPercent(planPercentDiscount)
          : 0;

      const planAmountSurcharge =
        planPercentSurcharge > 0
          ? subTotal * decimalPercent(planPercentSurcharge)
          : 0;

      const planPercentSurcharge =
        planPago.porcentaje > 0 ? planPago.porcentaje : 0;
      const planPercentDiscount =
        planPago.porcentaje < 0 ? transformPositive(planPago.porcentaje) : 0;

      this.productsDescription = await this.correctSalePriceAndIvaAmountOfProducts(
        this.productsDescription
      );

      const amountOfIva21 = await this.calculateAmountOfIva21(
        this.productsDescription
      );

      const amountOfIva10 = await this.calculateAmountOfIva10(
        this.productsDescription
      );

      const amountOfIva27 = await this.calculateAmountOfIva27(
        this.productsDescription
      );

      const totalOfIvas = sumarNumeros([
        amountOfIva21,
        amountOfIva10,
        amountOfIva27,
      ]);

      const total = subTotal - totalOfDiscounts + totalOfSurcharges;

      console.log({
        total,
        subTotal,
        amountOfIva21,
        amountOfIva10,
        amountOfIva27,
        totalOfIvas,
        totalOfDiscounts,
        totalOfSurcharges,
        planPercentSurcharge,
        planPercentDiscount,
        planAmountSurcharge,
        planAmountDiscount,
      })

      return {
        total,
        subTotal,
        amountOfIva21,
        amountOfIva10,
        amountOfIva27,
        totalOfIvas,
        totalOfDiscounts,
        totalOfSurcharges,
        planPercentSurcharge,
        planPercentDiscount,
        planAmountSurcharge,
        planAmountDiscount,
      };
    },

    restLineDiscounts(products, productDescriptions) {
      const discounts = products.filter((el) =>
        el.nombre.includes("DESCUENTO - ")
      );
      discounts.forEach((discount) => {
        const discountCleanName = discount.nombre.replace("DESCUENTO - ", "");
        productDescriptions.forEach((prodDescription) => {
          if (prodDescription.name === discountCleanName) {
            prodDescription.discountPercent = calculatePositivePercentajeCoefficient(
              discount.precioTotal,
              prodDescription.salePrice * Number(prodDescription.quantity)
            );
          }
        });
      });
      return productDescriptions;
    },

    sumLineSurcharges(products, productDescriptions) {
      const surcharges = products.filter((el) =>
        el.nombre.includes("RECARGO - ")
      );
      surcharges.forEach((surcharge) => {
        const surchargeCleanName = surcharge.nombre.replace("RECARGO - ", "");
        productDescriptions.forEach((prodDescription) => {
          if (prodDescription.name === surchargeCleanName) {
            prodDescription.surchargePercent = calculatePositivePercentajeCoefficient(
              surcharge.precioTotal,
              prodDescription.salePrice * Number(prodDescription.quantity)
            );
          }
        });
      });
      return productDescriptions;
    },

    restGlobalDiscount(productsDescription, globalDiscountPercent) {
      productsDescription.forEach((product) => {
        if (product.discountPercent) {
          product.discountPercent += globalDiscountPercent;
        } else {
          product.discountPercent = globalDiscountPercent;
        }
      });
      return productsDescription;
    },

    sumGlobalSurcharge(productsDescription, globalSurchargePercent) {
      productsDescription.forEach((product) => {
        if (product.surchargePercent) {
          product.surchargePercent += globalSurchargePercent;
        } else {
          product.surchargePercent = globalSurchargePercent;
        }
      });
      return productsDescription;
    },

    applyPaymentPlantPercentVariation(productsDescription, planPercent) {
      if (planPercent < 0)
        return this.restPlanDiscount(
          productsDescription,
          transformPositive(planPercent)
        );
      if (planPercent > 0)
        return this.sumPlanSurcharge(
          productsDescription,
          transformPositive(planPercent)
        );
      if (planPercent == 0) return productsDescription;
    },

    restPlanDiscount(productsDescription, planPercent) {
      productsDescription.forEach((prodDescription) => {
        prodDescription.discountPercent += planPercent;
      });
      return productsDescription;
    },

    sumPlanSurcharge(productsDescription, planPercent) {
      productsDescription.forEach((prodDescription) => {
        prodDescription.surchargePercent += planPercent;
      });
      return productsDescription;
    },

    calculateAmountOfPriceVariations(productsDescription) {
      productsDescription.forEach((prodDescription) => {
        if (!prodDescription.editable) {
          prodDescription.discountAmount =
            prodDescription.salePrice *
            Number(prodDescription.quantity) *
            decimalPercent(prodDescription.discountPercent);
          prodDescription.surchargeAmount =
            prodDescription.salePrice *
            Number(prodDescription.quantity) *
            decimalPercent(prodDescription.surchargePercent);
        } else {
          prodDescription.discountAmount =
            prodDescription.salePrice *
            decimalPercent(prodDescription.discountPercent);
          prodDescription.surchargeAmount =
            prodDescription.salePrice *
            decimalPercent(prodDescription.surchargePercent);
        }
      });
      return productsDescription;
    },

    calculateTotalOfDiscounts(productsDescription) {
      const discounts = productsDescription.map((el) =>
        el.discountAmount ? el.discountAmount : 0
      );
      const total = sumarNumeros(discounts);
      return total;
    },

    calculateTotalOfSurcharges(productsDescription) {
      const surcharges = productsDescription.map((el) =>
        el.surchargeAmount ? el.surchargeAmount : 0
      );
      const total = sumarNumeros(surcharges);
      return total;
    },

    calculateSumOfProductSalePrices(productsDescription) {
      const total = productsDescription.reduce((acc, el) => {
        if (!el.editable) {
          acc = acc + el.salePrice * Number(el.quantity);
        } else {
          acc = acc + el.salePrice;
        }
        return acc;
      }, 0);
      return roundTwoDecimals(total);
    },

    correctSalePriceAndIvaAmountOfProducts(productsDescription) {
      productsDescription.forEach((product) => {
        if (product.saleIvaPercent === 0) {
          product.saleIvaPercent = 21;
        }
        product.salePrice =
          product.salePrice -
          product.discountAmount / Number(product.quantity) +
          product.surchargeAmount / product.quantity;
        product.saleIvaAmount =
          product.salePrice * Number(product.quantity) -
          (product.salePrice * Number(product.quantity)) /
            (1 + decimalPercent(product.saleIvaPercent));
      });
      return productsDescription;
    },

    calculateAmountOfIva21(productsDescription) {
      const productsWithIva21 = productsDescription.filter(
        (el) => el.saleIvaPercent === 21
      );
      const amountOfIva = productsWithIva21.reduce(
        (acc, el) => acc + el.saleIvaAmount,
        0
      );
      return roundTwoDecimals(amountOfIva);
    },

    calculateAmountOfIva10(productsDescription) {
      const productsWithIva10 = productsDescription.filter(
        (el) => el.saleIvaPercent === 10.5
      );
      const amountOfIva = productsWithIva10.reduce(
        (acc, el) => acc + el.saleIvaAmount,
        0
      );
      return roundTwoDecimals(amountOfIva);
    },

    calculateAmountOfIva27(productsDescription) {
      const productsWithIva27 = productsDescription.filter(
        (el) => el.saleIvaPercent === 27
      );
      const amountOfIva = productsWithIva27.reduce(
        (acc, el) => acc + el.saleIvaAmount,
        0
      );
      return roundTwoDecimals(amountOfIva);
    },

    /******************************************************************************************************/
    /* CLEAR SALE FORM DATA ------------------------------------------------------------------------------*/
    /******************************************************************************************************/
    clear() {
      window.location.reload();
    },

    /******************************************************************************************************/
    /* CHECK IF SALE CONDITION IS EFFECTIVE --------------------------------------------------------------*/
    /******************************************************************************************************/
    checkSaleCondition(paymentPlan) {
      let saleCondition;
      if (paymentPlan) {
        if (paymentPlan.length < 2) {
          if (paymentPlan[0].cuotas > 1) {
            saleCondition = true;
          } else {
            saleCondition = false;
          }
        } else {
          saleCondition = false;
        }
      } else {
        saleCondition = true;
      }
      return saleCondition;
    },
  },
};
</script>
