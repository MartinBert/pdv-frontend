<template>
  <v-container>
    <v-col cols="12" v-if="loaded">
      <v-row class="mb-1">
        <v-col cols="6">
          <div class="d-flex text-left">
            <v-btn
              color="primary"
              @click="$store.commit('productos/dialogProductosMutation')"
              >BUSCAR PRODUCTOS</v-btn
            >
            <h3 class="mt-2 ml-2">
              Depósito predeterminado:
              <span v-if="defaultDeposit">
                {{ defaultDeposit.nombre }}
              </span>
              <span v-if="!defaultDeposit"> No definido </span>
            </h3>
          </div>
        </v-col>
        <v-col class="text-right">
          <select class="select-ventas-import" v-model="modificator">
            <option value="">Modificar importe total</option>
            <option value="descuento">Descuento</option>
            <option value="recargo">Recargo</option>
          </select>
        </v-col>
        <v-col cols="3" v-if="modificator">
          <input
            class="totalInput"
            v-model="priceModificationPorcent"
            type="number"
          />
          <v-btn
            class="success ml-3"
            @click="applyModification(modificator, priceModificationPorcent)"
            >Aplicar<v-icon>mdi-check-bold</v-icon></v-btn
          >
        </v-col>
      </v-row>
      <div class="horizontalSeparator"></div>
      <v-row>
        <v-col cols="9">
          <v-form v-on:submit.prevent="saveSale()">
            <v-row>
              <v-col cols="8">
                <v-row>
                  <v-col cols="6">
                    <v-autocomplete
                      @change="
                        getComercialDocuments(
                          object.cliente.condicionIva.documentos,
                          loguedUser.sucursal.condicionIva.documentos
                        )
                      "
                      v-model="object.cliente"
                      :items="databaseItems.clientes"
                      item-text="razonSocial"
                      :return-object="true"
                      placeholder="Seleccione un cliente"
                      required
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="6">
                    <v-autocomplete
                      class="button-ventas comprobante"
                      v-model="object.documento"
                      :items="databaseItems.documentos"
                      item-text="nombre"
                      :return-object="true"
                      placeholder="Seleccione un tipo de comprobante"
                      required
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="6">
                    <v-autocomplete
                      class="button-ventas medio-pago"
                      @change="getPaymentPlans(object.mediosPago)"
                      v-model="object.mediosPago"
                      :items="databaseItems.medios_de_pago"
                      item-text="nombre"
                      :return-object="true"
                      placeholder="Seleccione un medio de pago"
                      required
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="6">
                    <v-autocomplete
                      class="button-ventas plan-pago"
                      v-model="object.planPago"
                      :items="databaseItems.planes"
                      item-text="nombre"
                      :return-object="true"
                      placeholder="Seleccione un plan de pago"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="4">
                <div class="verticalSeparator"></div>
                <v-container style="color: rgb(63, 81, 181)">
                  <v-row>
                    <v-col class="text-right">
                      <label class="mr-3">TOTAL:</label>
                      <input
                        disabled
                        class="totalInput"
                        v-model="totalVenta"
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
                        v-model="totalItems"
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
                        <th class="text-left">Precion unitario</th>
                        <th class="text-left">Precion total</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="p in products" :key="p.id">
                        <td
                          @click="applyIndividualPercent(p)"
                          style="cursor: pointer"
                        >
                          {{ p.nombre }}
                        </td>
                        <td>{{ p.codigoBarra }}</td>
                        <td>
                          <input
                            type="number"
                            @input="updateTotal(p.id)"
                            v-model="p.cantUnidades"
                          />
                        </td>
                        <td>${{ p.precioUnitario }}</td>
                        <td>
                          <div v-if="p.editable === false">${{ p.precioTotal }}</div>
                          <div class="d-flex align-center" v-if="p.editable === true">
                            <p class="mt-4">$</p>
                            <input
                              type="number"
                              v-model="p.precioTotal"
                            />
                          </div>
                        <td>
                          <button type="button">
                            <img
                              src="/../../images/icons/delete.svg"
                              @click="deleteLine(p.id)"
                              width="30"
                              height="30"
                            />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="text-right">
                <v-btn type="submit" class="primary">Finalizar venta</v-btn>
                <v-btn type="button" class="default ml-1" @click="clear()"
                  >Cancelar</v-btn
                >
              </v-col>
            </v-row>
          </v-form>
        </v-col>
        <v-col cols="3">
          <v-row>
            <v-col cols="1">
              <div class="verticalSeparator"></div>
            </v-col>
            <v-col cols="11">
              <Calculator class="mt-2" />
              <div style="text-align: center; padding: 1em 0">
                <h3>
                  <a
                    style="text-decoration: none"
                    href="https://www.zeitverschiebung.net/es/city/3435910"
                    ><span style="color: gray">Hora actual en</span
                    ><br />Argentina</a
                  >
                </h3>
                <iframe
                  src="https://www.zeitverschiebung.net/clock-widget-iframe-v2?language=es&size=medium&timezone=America%2FArgentina%2FBuenos_Aires"
                  width="100%"
                  height="115"
                  frameborder="0"
                  seamless
                ></iframe>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <ProductDialog
      v-on:productList="addProduct"
      v-on:resetListStatus="resetListOfDialog"
      :refreshListStatus="listennerOfListChange"
    />
    <v-dialog v-model="dialogIndividualPercent" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Modificar precio a renglón
        </v-card-title>
        <v-container class="text-center">
          <v-text-field
            placeholder="Porcentaje"
            type="number"
            v-model="individualPercent"
          ></v-text-field>
          <v-btn class="success ml-3" @click="applyToLine(individualPercent)"
            >Aplicar<v-icon>mdi-check-bold</v-icon></v-btn
          >
        </v-container>
      </v-card>
    </v-dialog>
    <Spinner v-if="!loaded" />
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import VentasService from "../../services/VentasService";
import Calculator from "../../components/Graphics/Calculator";
import Spinner from "../../components/Graphics/Spinner";
import ProductDialog from "../../components/Dialogs/ProductDialog";
import {
  formatDate,
  getCurrentDate,
  getInternationalDate,
  formatDateWithoutSlash,
} from "../../helpers/dateHelper";
import { checkIfInvoice } from "../../helpers/processObjectsHelper";
import {
  generateBarCode,
  calculatePercentaje,
  decimalPercent,
  generateFiveDecimalCode,
  roundTwoDecimals,
} from "../../helpers/mathHelper";
import { formatFiscalInvoice } from "../../helpers/receiptFormatHelper";
import { addZerosInString } from "../../helpers/stringHelper";
import axios from "axios";
import ReportsService from "../../services/ReportsService";
export default {
  data: () => ({
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    fecha: getCurrentDate(),
    barcode: "",
    loaded: true,
    page: 0,
    size: 1000,
    object: {},
    databaseItems: {
      clientes: [],
      medios_de_pago: [],
      documentos: [],
    },
    productos: [],
    products: [],
    depositos: [],
    defaultDeposit: {},
    tenant: "",
    service: "ventas",
    token: localStorage.getItem("token"),
    modificator: "",
    priceModificationPorcent: 0,
    dialogIndividualPercent: false,
    renglon: {},
    individualPercent: "",
    listennerOfListChange: 0,
    clientIp: ""
  }),

  components: {
    Calculator,
    ProductDialog,
    Spinner,
  },

  created() {
    this.$barcodeScanner.init((barcode) => this.onBarcodeScanned(barcode));
  },

  destroyed() {
    this.$barcodeScanner.destroy();
  },

  computed: {
    totalVenta() {
      let total = this.products.reduce((acc, el) => {
        if (this.object.planPago) {
          const cleanPorcent = decimalPercent(this.object.planPago.porcentaje);
          const impPorcent = el.precioTotal * cleanPorcent;
          const totalValue =
            Math.round(
              (acc + Number(el.precioTotal) + Number(impPorcent)) * 100
            ) / 100;
          return totalValue;
        } else {
          return acc + Number(el.precioTotal);
        }
      }, 0);
      if (this.object.cliente && this.object.cliente.alicIngBrutos > 0) {
        total = total + (total * this.object.cliente.alicIngBrutos) / 100;
      }
      return roundTwoDecimals(total);
    },

    totalItems() {
      const totItems = this.products.reduce(
        (acc, el) => acc + Number(el.cantUnidades),
        0
      );
      return totItems;
    },
  },

  mounted() {
    this.$store.commit("productos/resetStates");
    this.tenant = this.$route.params.tenant;
    this.getObjects();
    this.getClientIpForFiscalController();
  },

  methods: {
    /******************************************************************************************************/
    /* ALL FUNCTIONS FOR GET OBJECTS ---------------------------------------------------------------------*/
    /******************************************************************************************************/
    getObjects() {
      let sucursalId;
      if (this.loguedUser.perfil > 1) {
        sucursalId = this.loguedUser.sucursal.id;
      }
      const clientFilter = {
        sucursalId: sucursalId,
        personaSocialReason: "",
        personaName: "",
        personaCuit: "",
        personaDirection: "",
        personaContactName: "",
        page: 1,
        size: 100000,
      };
      const medioPagoFilter = {
        sucursalId: sucursalId,
        medioPagoName: "",
        page: 1,
        size: 100000,
      };
      const depositoFilter = {
        depositoName: "",
        perfilId: this.loguedUser.perfil,
        sucursalId: sucursalId,
        page: 1,
        size: 10,
        totalPages: 0,
      };

      GenericService(this.tenant, "clientes", this.token)
        .filter(clientFilter)
        .then((data) => {
          this.databaseItems.clientes = data.data.content;
        });

      GenericService(this.tenant, "mediosPago", this.token)
        .filter(medioPagoFilter)
        .then((data) => {
          this.databaseItems.medios_de_pago = data.data.content;
        });

      GenericService(this.tenant, "depositos", this.token)
        .filter(depositoFilter)
        .then((data) => {
          this.depositos = data.data.content;
          this.defaultDeposit = data.data.content.filter(
            (el) => el.defaultDeposit === "1"
          )[0];
        });
    },

    getClientIpForFiscalController(){
      axios.get('https://api.ipify.org?format=json')
      .then(data => {
        this.clientIp = data.data.ip;
      })
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
        productoEstado: "",
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
            } else {
              databaseItem.cantUnidades = 1;
              databaseItem.total = databaseItem.precioTotal;
              this.products.push(this.processProductsObject(databaseItem));
            }
          }
        })
        .catch(() => {
          this.$errorAlert("No existe un producto con ese código de barras");
        });
    },

    addProduct(data) {
      data = [...new Set(data)];
      let processPorducts = [];
      data.forEach((el) => {
        processPorducts.push(this.processProductsObject(el));
      });
      if (this.products.length > 0) {
        this.products.forEach((el) => {
          processPorducts = processPorducts.filter((e) => e.id !== el.id);
        });
        processPorducts.forEach((el) => {
          this.products.push(el);
        });
      } else {
        this.products = processPorducts;
      }
    },

    getComercialDocuments(clientCond, businessCond) {
      let AllDocuments = [];
      for (let i = 0; i < clientCond.length; i++) {
        businessCond.forEach((el) => {
          if (clientCond[i].id == el.id) {
            AllDocuments.push(el);
          }
        });
      }
      this.databaseItems.documentos = checkIfInvoice(AllDocuments);
    },

    getPaymentPlans(id) {
      this.databaseItems.planes = id.planPago;
    },

    /******************************************************************************************************/
    /* ALL FUNCTIONS FOR PROCESS SALE DATA ---------------------------------------------------------------*/
    /******************************************************************************************************/
    updateTotal(id) {
      return this.products.reduce((acc, el) => {
        if (el.id == id) {
          el.precioTotal = acc;
          el.precioTotal = parseFloat(el.precioUnitario) * el.cantUnidades;
        }
      }, 0);
    },

    processProductsObject(producto) {
      const {
        id,
        nombre,
        codigoBarra,
        cantUnidades,
        precioTotal,
        ivaVentasObject,
        total,
        editable
      } = producto;
      let object = {
        id: id,
        nombre: nombre,
        codigoBarra: codigoBarra,
        cantUnidades: cantUnidades,
        precioUnitario: parseFloat(precioTotal).toFixed(2),
        ivaVentas: ivaVentasObject.porcentaje,
        precioTotal: parseFloat(total).toFixed(2),
        editable: editable
      };
      return object;
    },

    deleteLine(id) {
      const filter = this.products.filter((el) => el.id !== id);
      const filterForStore = this.products.filter((el) => el.id === id)[0].id;
      this.products = filter;
      this.$store.commit("productos/removeProductsToList", filterForStore);
      this.listennerOfListChange = id;
    },

    applyModification(modificator, priceModificationPorcent) {
      if (this.totalVenta > 0) {
        let percent = calculatePercentaje(
          this.totalVenta,
          priceModificationPorcent
        );
        if (modificator === "descuento") {
          if (Math.sign(percent) === 1) {
            percent = percent * -1;
          }
          let obj = {
            id: this.products.length + 1,
            nombre: "DESCUENTO",
            codigoBarra: 1111111111,
            cantUnidades: 0,
            ivaVentas: 8888,
            precioUnitario: percent,
            precioTotal: percent,
            editable:false
          };
          this.products.push(obj);
        } else {
          if (Math.sign(percent) === -1) {
            percent = percent * -1;
          }
          let obj = {
            id: this.products.length + 1,
            nombre: "RECARGO",
            codigoBarra: 2222222222,
            cantUnidades: 0,
            ivaVentas: 8888,
            precioUnitario: percent,
            precioTotal: percent,
            editable:false
          };
          this.products.push(obj);
        }
      } else {
        this.$errorAlert("No hay productos seleccionados en la venta");
      }
    },

    applyIndividualPercent(p) {
      this.dialogIndividualPercent = true;
      this.renglon = p;
    },

    applyToLine(percent) {
      let object = {};
      if (Math.sign(percent) === -1) {
        object = {
          id: this.products.length + 1,
          nombre: "DESCUENTO - " + this.renglon.nombre,
          codigoBarra: generateBarCode(),
          cantUnidades: 0,
          ivaVentas: 99999,
          precioUnitario: calculatePercentaje(
            this.renglon.precioTotal,
            percent
          ),
          precioTotal: calculatePercentaje(this.renglon.precioTotal, percent),
          editable: false
        };
      } else {
        object = {
          id: this.products.length + 1,
          nombre: "RECARGO - " + this.renglon.nombre,
          codigoBarra: generateBarCode(),
          cantUnidades: 0,
          ivaVentas: 99999,
          precioUnitario: calculatePercentaje(
            this.renglon.precioTotal,
            percent
          ),
          precioTotal: calculatePercentaje(this.renglon.precioTotal, percent),
          editable: false
        };
      }
      this.products.push(object);
      this.dialogIndividualPercent = false;
    },

    resetListOfDialog() {
      this.listennerOfListChange = 0;
    },

    /******************************************************************************************************/
    /* ALL FUNCTIONS FOR FISCAL CONTROLLER ---------------------------------------------------------------*/
    /******************************************************************************************************/
    saveTicket(documentName) {
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
        .post(
          `http://${this.clientIp}:8009/${ticketRoute}`, jsonToFiscalController
        )
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
        surcharge: this.getTotalSurcharges(),
        discount: this.getTotalDiscounts(),
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

    getClientData(){
      const formattedObject = {
        name: this.object.cliente.nombre,
        socialReason: this.object.cliente.razonSocial,
        cuit: this.object.cliente.cuit,
        direction: this.object.cliente.direccion
      }
      return formattedObject;
    },

    getTotalSurcharges(letter) {
      let total = this.products.reduce((acc, el) => {
        if (el.nombre.includes("RECARGO")) {
          acc += Number(el.precioTotal * 1);
        }
        return Math.ceil(acc * 100) / 100;
      }, 0);
      if(letter === "A"){
        total = total / 1.21;
      }
      return total.toString();
    },

    getTotalDiscounts(letter) {
      let total = this.products.reduce((acc, el) => {
        if (el.nombre.includes("DESCUENTO")) {
          acc += Number(el.precioTotal * -1);
        }
        return Math.ceil(acc * 100) / 100;
      }, 0);
      if(letter === "A"){
        total = total / 1.21;
      }
      return total.toString();
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

    itemsInvoiceA(){
      let items = [];
      const validItems = this.products.filter(
        (el) =>
          !el.nombre.includes("DESCUENTO") && !el.nombre.includes("RECARGO")
      );
      validItems.forEach((el) => {
        const formattedObject = {
          name: el.nombre,
          quantity: el.cantUnidades.toString(),
          price: roundTwoDecimals(el.precioTotal / (1 + decimalPercent(el.ivaVentas))).toString(),
        };
        items.push(formattedObject);
      });
      return items;
    },

    itemsInvoiceB(){
      let items = [];
      const validItems = this.products.filter(
        (el) =>
          !el.nombre.includes("DESCUENTO") && !el.nombre.includes("RECARGO")
      );
      validItems.forEach((el) => {
        const formattedObject = {
          name: el.nombre,
          quantity: el.cantUnidades.toString(),
          price: roundTwoDecimals(el.precioTotal / (1 + decimalPercent(el.ivaVentas))).toString(),
        };
        items.push(formattedObject);
      });
      return items;
    },

    itemsInvoiceC(){
      let items = [];
      const validItems = this.products.filter(
        (el) =>
          !el.nombre.includes("DESCUENTO") && !el.nombre.includes("RECARGO")
      );
      validItems.forEach((el) => {
        const formattedObject = {
          name: el.nombre,
          quantity: el.cantUnidades.toString(),
          price: el.precioTotal.toString(),
        };
        items.push(formattedObject);
      });
      return items;
    },

    /******************************************************************************************************/
    /* ALL FUNCTIONS FOR ELECTRONIC BILLING --------------------------------------------------------------*/
    /******************************************************************************************************/
    saveSale() {
      this.loaded = false;
      const documento = this.object.documento;
      if (documento !== undefined) {
        if (documento.tipo === true) {
          if (documento.ticket === true) {
            this.saveTicket(documento.nombre);
          } else {
            this.save();
          }
        } else {
          this.saveNoFiscal();
        }
      } else {
        this.$errorAlert(
          "Debe seleccionar un cliente, comprobante y medio de pago para realizar la operación"
        ).then((result) => {
          if (result.isDismissed) {
            this.loaded = true;
          }
        });
      }
    },

    save() {
      const sucursal = this.loguedUser.sucursal;
      const ptoVenta = this.loguedUser.puntoVenta;
      const products = this.products;
      const documento = this.object.documento;
      const empresa = this.loguedUser.empresa;
      const cliente = this.object.cliente;
      const mediosPago = this.object.mediosPago;
      const planesPago = this.object.planPago;
      const totalVenta = this.totalVenta;
      const tenant = this.tenant;
      const token = this.token;
      const service = this.service;
      const condVenta = this.checkSaleCondition(planesPago);
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
          /*** Evaluate required sale form data ***/
          if (mediosPago !== undefined) {
            if (products.length > 0) {
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
                  // Create receipt
                  comprobante = {
                    letra: documento.letra,
                    numeroCbte: numberOfReceipt,
                    fechaEmision: formatDate(getCurrentDate()),
                    fechaVto: formatDate(dateOfCaeExpiration),
                    condicionVenta: condVenta,
                    productos: products,
                    barCode: barCode,
                    cae: cae,
                    puntoVenta: ptoVenta,
                    sucursal: sucursal,
                    documentoComercial: documento,
                    empresa: empresa,
                    cliente: cliente,
                    totalVenta: totalVenta,
                    mediosPago: [mediosPago],
                    planesPago: [planesPago],
                    nombreDocumento: documento.nombre,
                  };
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
                          });
                      })
                      .then(() => {
                        /*** Save stocks modifications ***/
                        this.applyStockModifications(comprobante)
                          .then((data) => {
                            const productsBelowMinimumStock = data[0];
                            const productsWithoutStockOnDefaultDeposit =
                              data[1];
                            const productsOutOfStockAndDeposits = data[2];
                            this.$successAlert("Venta realizada").then(() => {
                              VentasService(
                                this.tenant,
                                this.service,
                                this.token
                              ).checkProductsAndDepositsStatus(
                                productsBelowMinimumStock,
                                productsWithoutStockOnDefaultDeposit,
                                productsOutOfStockAndDeposits
                              );
                            });
                          })
                          .finally(() => {
                            /*** Reset view objects and status ***/
                            this.clear();
                            this.loaded = true;
                          });
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
                })
                .catch((err) => {
                  console.log(
                    "---------------- ERROR IN AFIP RESPONSE ----------------"
                  );
                  console.log(err);
                  this.loaded = true;
                });
            } else {
              this.$errorAlert(
                "No hay productos seleccionados en la venta"
              ).then((result) => {
                if (result.isDismissed) {
                  this.loaded = true;
                }
              });
            }
          } else {
            this.$errorAlert("Debe seleccionar un medio de pago").then(
              (result) => {
                if (result.isDismissed) {
                  this.loaded = true;
                }
              }
            );
          }
        });
    },

    saveNoFiscal() {
      const mediosPago = this.object.mediosPago;
      const planesPago = this.object.planPago;
      const totalVenta = this.totalVenta;
      const cliente = this.object.cliente;
      const empresa = this.loguedUser.empresa;
      const documento = this.object.documento;
      const sucursal = this.loguedUser.sucursal;
      const ptoVenta = this.loguedUser.puntoVenta;
      const products = this.products;
      const fecha = this.fecha;
      const tenant = this.tenant;
      const token = this.token;
      const service = this.service;
      const condVenta = this.checkSaleCondition(planesPago);
      let file;
      let fileURL;
      let comprobante;
      comprobante = {
        letra: "X",
        numeroCbte: generateFiveDecimalCode(),
        fechaEmision: formatDate(fecha),
        fechaVto: formatDate(fecha),
        condicionVenta: condVenta,
        productos: products,
        barCode: generateBarCode(),
        cae: "",
        puntoVenta: ptoVenta,
        sucursal: sucursal,
        documentoComercial: documento,
        empresa: empresa,
        cliente: cliente,
        totalVenta: totalVenta,
        mediosPago: [mediosPago],
        planesPago: [planesPago],
        nombreDocumento: documento.nombre,
      };
      /*** Evaluate required sale form data ***/
      if (comprobante.mediosPago[0] !== undefined) {
        if (Number(comprobante.totalVenta) !== 0) {
          /*** Save receipt in database and print ticket ***/
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
                })
                .then(() => {
                  /*** Save stocks modifications ***/
                  this.applyStockModifications(comprobante)
                    .then((data) => {
                      const productsBelowMinimumStock = data[0];
                      const productsWithoutStockOnDefaultDeposit = data[1];
                      const productsOutOfStockAndDeposits = data[2];
                      this.$successAlert("Venta realizada").then(() => {
                        VentasService(
                          this.tenant,
                          this.service,
                          this.token
                        ).checkProductsAndDepositsStatus(
                          productsBelowMinimumStock,
                          productsWithoutStockOnDefaultDeposit,
                          productsOutOfStockAndDeposits
                        );
                      });
                    })
                    .finally(() => {
                      /*** Reset view objects and status ***/
                      this.clear();
                      this.loaded = true;
                    });
                });
            });
        } else {
          this.$errorAlert("No hay productos seleccionados en la venta").then(
            (result) => {
              if (result.isDismissed) {
                this.loaded = true;
              }
            }
          );
        }
      } else {
        this.$errorAlert("Debe seleccionar un medio de pago").then((result) => {
          if (result.isDismissed) {
            this.loaded = true;
          }
        });
      }
    },

    async applyStockModifications(comprobante) {
      const filterParam = {
        sucursalId: this.loguedUser.sucursal.id,
        productoName: "",
        productoCodigo: "",
        productoMarcaName: "",
        productoCodigoBarras: "",
        productoPrimerAtributoName: "",
        page: 1,
        size: 100000,
      };
      let productsBelowMinimumStock = [];
      let productsWithoutStockOnDefaultDeposit = [];
      let productsOutOfStockAndDeposits = [];
      let stocks;
      let receiptData = comprobante;
      await GenericService(this.tenant, "stock", this.token)
        .filter(filterParam)
        .then((data) => {
          stocks = data.data.content;
          stocks.forEach((stock) => {
            receiptData.productos.forEach((productInReceipt) => {
              if (stock.producto.id === productInReceipt.id) {
                productInReceipt.checked = true;
                switch (stock.deposito.id) {
                  case this.defaultDeposit.id:
                    stock.cantidad =
                      parseInt(stock.cantidad) -
                      parseInt(productInReceipt.cantUnidades);
                    receiptData.productos = receiptData.productos.filter(
                      (el) => el.id !== productInReceipt.id
                    );
                    if (
                      stock.cantidadMinima &&
                      stock.cantidad < Number(stock.cantidadMinima)
                    ) {
                      productsBelowMinimumStock.push(stock);
                    }
                    GenericService(this.tenant, "stock", this.token).save(
                      stock
                    );
                    break;
                  default:
                    stock.cantidad =
                      parseInt(stock.cantidad) -
                      parseInt(productInReceipt.cantUnidades);
                    receiptData.productos = receiptData.productos.filter(
                      (el) => el.id !== productInReceipt.id
                    );
                    if (
                      stock.cantidadMinima &&
                      stock.cantidad < Number(stock.cantidadMinima)
                    ) {
                      productsBelowMinimumStock.push(stock);
                    }
                    GenericService(this.tenant, "stock", this.token).save(
                      stock
                    );
                    productsWithoutStockOnDefaultDeposit.push(stock);
                    break;
                }
              }
            });
          });
          const viewCheckedProductsInReceipt = receiptData.productos.filter(
            (el) => !el.checked
          );
          if (viewCheckedProductsInReceipt.length > 0) {
            productsOutOfStockAndDeposits = viewCheckedProductsInReceipt;
          }
        });

      return [
        productsBelowMinimumStock,
        productsWithoutStockOnDefaultDeposit,
        productsOutOfStockAndDeposits,
      ];
    },

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

    /******************************************************************************************************/
    /* CLEAR SALE FORM DATA ------------------------------------------------------------------------------*/
    /******************************************************************************************************/
    clear() {
      this.object = {};
      this.products = [];
      this.modificator = "";
      this.priceModificationPorcent = 0;
      this.individualPercent = "";
      this.listennerOfListChange = 999999999;
      this.$store.commit("productos/resetStates");
    },
  },
};
</script>