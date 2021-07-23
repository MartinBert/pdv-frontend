<template>
  <v-container style="min-width: 100%">
    <v-col cols="12" v-if="loaded">
      <v-row class="mb-1">
        <v-col cols="6">
          <div class="d-flex text-left">
            <v-btn
              color="primary"
              @click="$store.commit('productos/dialogProductosMutation')"
              >BUSCAR PRODUCTOS</v-btn
            >
            <v-btn
              color="primary"
              class="ml-1"
              @click="$store.commit('receipt/receiptDialogMutation')"
              >BUSCAR PRESUPUESTO</v-btn
            >
            <h3 class="mt-2 ml-2">
              Depósito predeterminado:
              <span v-if="defaultDeposit">
                {{ defaultDeposit.nombre }}
              </span>
              <span v-if="!defaultDeposit"> No definido </span>
            </h3>
            <v-btn
              v-if="loguedUser.perfil === 1"
              color="primary"
              class="ml-5"
              @click="testCert()"
              >TEST CERTIFICADO</v-btn
            >
          </div>
        </v-col>
        <v-col class="text-right" cols="5">
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
      <br />
      <div class="horizontalSeparator"></div>
      <v-card style="min-width: 100%">
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
                        ref="documents"
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
                        ref="paymentMethods"
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
                        ref="paymentPlans"
                        class="button-ventas plan-pago"
                        v-model="object.planPago"
                        :items="databaseItems.planes"
                        item-text="nombre"
                        :return-object="true"
                        placeholder="Seleccione un plan de pago"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="6" v-if="object.documento && object.documento.nombre === 'Presupuesto'">
                      <label for="date_input">Fecha de vencimiento de presupuesto</label>
                      <v-text-field 
                        id="date_input" 
                        type="date" 
                        outlined 
                        filled 
                        dense
                        v-model="object.fechaVencimiento"
                      />
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
                          <th class="text-left">Precio unitario</th>
                          <th class="text-left">Precio total</th>
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
                            <div v-if="p.editable === false">
                              ${{ p.precioTotal }}
                            </div>
                            <div
                              class="d-flex align-center"
                              v-if="p.editable === true"
                            >
                              <p class="mt-4">$</p>
                              <input type="number" v-model="p.precioTotal" />
                            </div>
                          </td>

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
              <v-col cols="10">
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
      </v-card>
    </v-col>
    <ProductDialog
      v-on:productList="addProduct"
      v-on:resetListStatus="resetListOfDialog"
      :refreshListStatus="listennerOfListChange"
    />
    <SearchPresupuestoDialog v-on:selectPresupuesto="selectPresupuesto" :resetPresupuestSearch="resetPresupuestSearch"/>
    <v-dialog v-model="dialogIndividualPercent" width="600">
      <v-card min-width: 100%>
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
import SearchPresupuestoDialog from "../../components/Dialogs/SearchPresupuestoDialog";
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
  transformPositive,
  calculateAmountMinusPercentaje,
  calculateAmountPlusPercentaje,
  calculatePercentReductionInAmount,
  sumarNumeros,
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
    productsDetail: [],
    productsDescription: [],
    depositos: [],
    defaultDeposit: {},
    descuentoGlobal: 0,
    recargoGlobal: 0,
    porcentajeDescuentoGlobal: 0,
    porcentajeRecargoGlobal: 0,
    tenant: "",
    service: "ventas",
    token: localStorage.getItem("token"),
    modificator: "",
    priceModificationPorcent: 0,
    dialogIndividualPercent: false,
    renglon: {},
    individualPercent: "",
    listennerOfListChange: 0,
    clientIp: "",
    resetPresupuestSearch: false
  }),

  components: {
    Calculator,
    ProductDialog,
    Spinner,
    SearchPresupuestoDialog
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

    getClientIpForFiscalController() {
      axios.get("https://api.ipify.org?format=json").then((data) => {
        this.clientIp = data.data.ip;
      });
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
      this.productsDescription = [];
      data = [...new Set(data)];
      this.productsDetail = data;
      data.forEach((product) => {
        const objectForProductsDescription = {
          name: product.nombre,
          barCode: product.codigoBarra,
          code: product.codigoProducto,
          tradeMarkName: product.marca.nombre,
          tradeMarkId: product.marca.id,
          rubroName: product.rubro.nombre,
          rubroId: product.rubro.id,
          attributes: product.atributos,
          properties: product.propiedades,
          quantity: product.cantUnidades,
          costPrice: product.precioCosto,
          salePrice: product.precioTotal,
          buyIvaPercent: product.ivaComprasObject.porcentaje,
          saleIvaPercent: product.ivaVentasObject.porcentaje,
          buyIvaAmount: product.ivaCompra,
          saleIvaAmount: product.ivaVenta,
          providerData: product.proveedores ? product.proveedores : [],
        };
        this.productsDescription.push(objectForProductsDescription);
      });

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

    getPaymentPlans(paymentMethod) {
      console.log(paymentMethod.planPago);
      this.databaseItems.planes = paymentMethod.planPago;
    },

    selectPresupuesto(presupuesto) {
      presupuesto.productos.forEach(el => {
        el.total = el.precioTotal;
        el.editable = true;
      })
      this.getComercialDocuments(presupuesto.cliente.condicionIva.documentos, this.loguedUser.sucursal.condicionIva.documentos);
      this.getPaymentPlans(presupuesto.mediosPago[0]);
      this.object = presupuesto;
      this.object.mediosPago = presupuesto.mediosPago[0];
      this.object.planPago = presupuesto.planesPago[0];
      this.products = presupuesto.productos;
      console.log(this.object)
    },

    /******************************************************************************************************/
    /* ALL FUNCTIONS FOR PROCESS SALE DATA ---------------------------------------------------------------*/
    /******************************************************************************************************/
    updateTotal(id) {
      this.products.forEach((el) => {
        this.productsDescription.forEach((e) => {
          if (el.codigoBarra == e.barCode) {
            e.quantity = el.cantUnidades;
          }
        });
      });
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
        editable,
      } = producto;
      let object = {
        id: id,
        nombre: nombre,
        codigoBarra: codigoBarra,
        cantUnidades: cantUnidades,
        precioUnitario: parseFloat(precioTotal).toFixed(2),
        ivaVentas: ivaVentasObject.porcentaje,
        precioTotal: parseFloat(total).toFixed(2),
        editable: editable,
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
            editable: false,
          };
          this.products.push(obj);
          this.descuentoGlobal = obj.precioTotal * -1;
          this.porcentajeDescuentoGlobal = Number(priceModificationPorcent);
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
            editable: false,
          };
          this.products.push(obj);
          this.recargoGlobal = obj.precioTotal;
          this.porcentajeRecargoGlobal = Number(priceModificationPorcent);
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
          editable: false,
        };
        this.productsDescription.filter(
          (el) => el.barCode === this.renglon.codigoBarra
        )[0].discountPercent = Number(percent) * -1;
        this.productsDescription.filter(
          (el) => el.barCode === this.renglon.codigoBarra
        )[0].discountAmount = Number(object.precioTotal) * -1;
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
          editable: false,
        };
        this.productsDescription.filter(
          (el) => el.barCode === this.renglon.codigoBarra
        )[0].surchargePercent = Number(percent);
        this.productsDescription.filter(
          (el) => el.barCode === this.renglon.codigoBarra
        )[0].surchargeAmount = Number(object.precioTotal);
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
      // const clientIp = this.loguedUser.puntoVenta.ipLocal;
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
        name: this.object.cliente.nombre,
        socialReason: this.object.cliente.razonSocial,
        cuit: this.object.cliente.cuit,
        direction: this.object.cliente.direccion,
      };
      return formattedObject;
    },

    getTotalSurcharges(letter) {
      let total = this.products.reduce((acc, el) => {
        if (el.nombre.includes("RECARGO")) {
          acc += Number(el.precioTotal * 1);
        }
        return Math.ceil(acc * 100) / 100;
      }, 0);
      if (letter === "A") {
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
      if (letter === "A") {
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
            el.precioTotal / (1 + decimalPercent(el.ivaVentas))
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
            el.precioTotal / (1 + decimalPercent(el.ivaVentas))
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
          if(documento.presupuesto === true){
            this.savePresupuesto();
          }else{
            this.saveNoFiscal();
          }
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
      const productsDetail = this.productsDetail;
      const productsDescription = this.productsDescription;
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
      let planPercentDiscount;
      let planPercentSurcharge;
      let planAmountDiscount = 0;
      let planAmountSurcharge = 0;
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
              checkChangesInPrice();

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

                  productsDescription.forEach((product) => {
                    if (!product.surchargeAmount) {
                      product.surchargeAmount = 0;
                      product.surchargePercent = 0;
                    }
                    if (!product.discountAmount) {
                      product.discountAmount = 0;
                      product.discountPercent = 0;
                    }
                  });

                  if (planesPago.porcentaje > 0) {
                    planPercentDiscount = 0;
                    planPercentSurcharge = planesPago.porcentaje;
                    const totalSumOfProductPrices = productsDescription.reduce(
                      (acc, product) => acc + product.salePrice,
                      0
                    );
                    planAmountSurcharge =
                      calculateAmountPlusPercentaje(
                        totalSumOfProductPrices,
                        planPercentSurcharge
                      ) - totalSumOfProductPrices;
                  } else {
                    planPercentDiscount = transformPositive(
                      planesPago.porcentaje
                    );
                    planPercentSurcharge = 0;
                    const totalSumOfProductPrices = productsDescription.reduce(
                      (acc, product) => acc + product.salePrice,
                      0
                    );
                    planAmountDiscount =
                      totalSumOfProductPrices -
                      calculateAmountMinusPercentaje(
                        totalSumOfProductPrices,
                        planPercentDiscount
                      );
                  }

                  const productsWithIva21 = productsDescription.filter(
                    (el) => el.saleIvaPercent === 21
                  );
                  const productsWithIva10 = productsDescription.filter(
                    (el) => el.saleIvaPercent === 10.5
                  );
                  const productsWithIva27 = productsDescription.filter(
                    (el) => el.saleIvaPercent === 27
                  );

                  const amountOfIva21 = productsWithIva21.reduce(
                    (acc, product) => {
                      const salePriceWithPlanDiscountAndSurcharge =
                        calculateAmountPlusPercentaje(
                          product.salePrice,
                          planPercentSurcharge
                        ) -
                        (product.salePrice -
                        calculateAmountMinusPercentaje(
                          product.salePrice,
                          planPercentDiscount
                        ));
                      const salePriceWithLineDiscountAndSurcharge =
                        salePriceWithPlanDiscountAndSurcharge +
                        product.surchargeAmount -
                        product.discountAmount;
                      const salePriceWithDiscountAndSurcharge =
                        calculateAmountMinusPercentaje(
                          salePriceWithLineDiscountAndSurcharge,
                          this.porcentajeRecargoGlobal
                        ) -
                        (salePriceWithLineDiscountAndSurcharge -
                          calculateAmountMinusPercentaje(
                            salePriceWithLineDiscountAndSurcharge,
                            this.porcentajeDescuentoGlobal
                          ));
                      acc +=
                        salePriceWithDiscountAndSurcharge -
                        calculatePercentReductionInAmount(
                          salePriceWithDiscountAndSurcharge,
                          21
                        );
                      return roundTwoDecimals(acc);
                    },
                    0
                  );
                  const amountOfIva10 = productsWithIva10.reduce(
                    (acc, product) => {
                      const salePriceWithPlanDiscountAndSurcharge =
                        calculateAmountPlusPercentaje(
                          product.salePrice,
                          planPercentSurcharge
                        ) -
                        (product.salePrice -
                        calculateAmountMinusPercentaje(
                          product.salePrice,
                          planPercentDiscount
                        ));
                      const salePriceWithLineDiscountAndSurcharge =
                        salePriceWithPlanDiscountAndSurcharge +
                        product.surchargeAmount -
                        product.discountAmount;
                      const salePriceWithDiscountAndSurcharge =
                        calculateAmountMinusPercentaje(
                          salePriceWithLineDiscountAndSurcharge,
                          this.porcentajeRecargoGlobal
                        ) -
                        (salePriceWithLineDiscountAndSurcharge -
                          calculateAmountMinusPercentaje(
                            salePriceWithLineDiscountAndSurcharge,
                            this.porcentajeDescuentoGlobal
                          ));
                      acc +=
                        salePriceWithDiscountAndSurcharge -
                        calculatePercentReductionInAmount(
                          salePriceWithDiscountAndSurcharge,
                          10.5
                        );
                      return roundTwoDecimals(acc);
                    },
                    0
                  );
                  const amountOfIva27 = productsWithIva27.reduce(
                    (acc, product) => {
                      const salePriceWithPlanDiscountAndSurcharge =
                        calculateAmountPlusPercentaje(
                          product.salePrice,
                          planPercentSurcharge
                        ) -
                        (product.salePrice -
                        calculateAmountMinusPercentaje(
                          product.salePrice,
                          planPercentDiscount
                        ));
                      const salePriceWithLineDiscountAndSurcharge =
                        salePriceWithPlanDiscountAndSurcharge +
                        product.surchargeAmount -
                        product.discountAmount;
                      const salePriceWithDiscountAndSurcharge =
                        calculateAmountMinusPercentaje(
                          salePriceWithLineDiscountAndSurcharge,
                          this.porcentajeRecargoGlobal
                        ) -
                        (salePriceWithLineDiscountAndSurcharge -
                          calculateAmountMinusPercentaje(
                            salePriceWithLineDiscountAndSurcharge,
                            this.porcentajeDescuentoGlobal
                          ));
                      acc +=
                        salePriceWithDiscountAndSurcharge -
                        calculatePercentReductionInAmount(
                          salePriceWithDiscountAndSurcharge,
                          27
                        );
                      return roundTwoDecimals(acc);
                    },
                    0
                  );

                  const totalIvas = amountOfIva21 + amountOfIva10 + amountOfIva27;
                  const totalDiscounts = this.descuentoGlobal + planAmountDiscount;
                  const totalSurcharges = this.recargoGlobal + planAmountSurcharge;
                  const sumOfProductPrices = productsDescription.reduce((acc, product) => acc + product.salePrice, 0);
                  const subTotal = sumOfProductPrices + totalSurcharges - totalIvas - totalDiscounts;

                  // Create receipt
                  comprobante = {
                    letra: documento.letra,
                    numeroCbte:
                      addZerosInString("04", ptoVenta.idFiscal) +
                      "-" +
                      addZerosInString("08", numberOfReceipt),
                    fechaEmision: formatDate(getCurrentDate()),
                    fechaVto: formatDate(dateOfCaeExpiration),
                    condicionVenta: condVenta,
                    productos: products,
                    productosDetalle: productsDetail,
                    productoDescription: productsDescription,
                    barCode: barCode,
                    cae: cae,
                    logoUrl: this.loguedUser.sucursal.logo,
                    puntoVenta: ptoVenta,
                    sucursal: sucursal,
                    documentoComercial: documento,
                    empresa: empresa,
                    cliente: cliente,
                    totalVenta: totalVenta,
                    subTotal: subTotal,
                    totalDescuentoGlobal: this.descuentoGlobal,
                    totalRecargoGlobal: this.recargoGlobal,
                    porcentajeDescuentoGlobal: this.porcentajeDescuentoGlobal,
                    porcentajeRecargoGlobal: this.porcentajeRecargoGlobal,
                    totalIva21: amountOfIva21,
                    totalIva10: amountOfIva10,
                    totalIva27: amountOfIva27,
                    porcentajeRecargoPlan: planPercentSurcharge,
                    porcentajeDescuentoPlan: planPercentDiscount,
                    totalDescuentoPlan: roundTwoDecimals(planAmountDiscount),
                    totalRecargoPlan: roundTwoDecimals(planAmountSurcharge),
                    mediosPago: [mediosPago],
                    planesPago: [planesPago],
                    nombreDocumento: documento.nombre,
                  };
                  if(this.object.id){
                    comprobante.id = this.object.id;
                  }

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

      const checkChangesInPrice = () => {
        productsDescription.forEach((productDescription) => {
          if (planesPago.porcentaje < 0) {
            const paymentPlanVariationPercent = transformPositive(
              planesPago.porcentaje
            );
            productDescription.discountAmount =
              productDescription.discountAmount +
              (productDescription.salePrice -
                calculateAmountMinusPercentaje(
                  productDescription.salePrice,
                  paymentPlanVariationPercent
                ));
            productDescription.discountPercent = sumarNumeros([
              productDescription.discountPercent,
              paymentPlanVariationPercent,
            ]);
          } else if (planesPago.porcentaje > 0) {
            const paymentPlanVariationPercent = transformPositive(
              planesPago.porcentaje
            );
            productDescription.surchargeAmount =
              productDescription.surchargeAmount +
              (calculateAmountPlusPercentaje(
                productDescription.salePrice,
                paymentPlanVariationPercent
              ) -
                productDescription.salePrice);
            productDescription.surchargePercent = sumarNumeros([
              productDescription.surchargePercent,
              paymentPlanVariationPercent,
            ]);
          } else {
            console.log("Not price modifications detected");
          }
        });
      };
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
      const productsDetail = this.productsDetail;
      const productsDescription = this.productsDescription;
      const fecha = this.fecha;
      const tenant = this.tenant;
      const token = this.token;
      const service = this.service;
      const condVenta = this.checkSaleCondition(planesPago);
      let file;
      let fileURL;
      let comprobante;
      let planPercentDiscount;
      let planPercentSurcharge;
      let planAmountDiscount = 0;
      let planAmountSurcharge = 0;
      const checkChangesInPrice = () => {
        productsDescription.forEach((productDescription) => {
          if (planesPago.porcentaje < 0) {
            const paymentPlanVariationPercent = transformPositive(
              planesPago.porcentaje
            );
            productDescription.discountAmount =
              productDescription.discountAmount +
              (productDescription.salePrice -
                calculateAmountMinusPercentaje(
                  productDescription.salePrice,
                  paymentPlanVariationPercent
                ));
            productDescription.discountPercent = sumarNumeros([
              productDescription.discountPercent,
              paymentPlanVariationPercent,
            ]);
          } else if (planesPago.porcentaje > 0) {
            const paymentPlanVariationPercent = transformPositive(
              planesPago.porcentaje
            );
            productDescription.surchargeAmount =
              productDescription.surchargeAmount +
              (calculateAmountPlusPercentaje(
                productDescription.salePrice,
                paymentPlanVariationPercent
              ) -
                productDescription.salePrice);
            productDescription.surchargePercent = sumarNumeros([
              productDescription.surchargePercent,
              paymentPlanVariationPercent,
            ]);
          } else {
            console.log("Not price modifications detected");
          }
        });
      };
      checkChangesInPrice();

      productsDescription.forEach((product) => {
        if (!product.surchargeAmount) {
          product.surchargeAmount = 0;
          product.surchargePercent = 0;
        }
        if (!product.discountAmount) {
          product.discountAmount = 0;
          product.discountPercent = 0;
        }
      });

      if (planesPago.porcentaje > 0) {
        planPercentDiscount = 0;
        planPercentSurcharge = planesPago.porcentaje;
        const totalSumOfProductPrices = productsDescription.reduce(
          (acc, product) => acc + product.salePrice,
          0
        );
        planAmountSurcharge =
          calculateAmountPlusPercentaje(
            totalSumOfProductPrices,
            planPercentSurcharge
          ) - totalSumOfProductPrices;
      } else {
        planPercentDiscount = transformPositive(
          planesPago.porcentaje
        );
        planPercentSurcharge = 0;
        const totalSumOfProductPrices = productsDescription.reduce(
          (acc, product) => acc + product.salePrice,
          0
        );
        planAmountDiscount =
          totalSumOfProductPrices -
          calculateAmountMinusPercentaje(
            totalSumOfProductPrices,
            planPercentDiscount
          );
      }

      const productsWithIva21 = productsDescription.filter(
        (el) => el.saleIvaPercent === 21
      );
      const productsWithIva10 = productsDescription.filter(
        (el) => el.saleIvaPercent === 10.5
      );
      const productsWithIva27 = productsDescription.filter(
        (el) => el.saleIvaPercent === 27
      );

      const amountOfIva21 = productsWithIva21.reduce(
        (acc, product) => {
          const salePriceWithPlanDiscountAndSurcharge =
            calculateAmountPlusPercentaje(
              product.salePrice,
              planPercentSurcharge
            ) -
            (product.salePrice -
            calculateAmountMinusPercentaje(
              product.salePrice,
              planPercentDiscount
            ));
          const salePriceWithLineDiscountAndSurcharge =
            salePriceWithPlanDiscountAndSurcharge +
            product.surchargeAmount -
            product.discountAmount;
          const salePriceWithDiscountAndSurcharge =
            calculateAmountMinusPercentaje(
              salePriceWithLineDiscountAndSurcharge,
              this.porcentajeRecargoGlobal
            ) -
            (salePriceWithLineDiscountAndSurcharge -
              calculateAmountMinusPercentaje(
                salePriceWithLineDiscountAndSurcharge,
                this.porcentajeDescuentoGlobal
              ));
          acc +=
            salePriceWithDiscountAndSurcharge -
            calculatePercentReductionInAmount(
              salePriceWithDiscountAndSurcharge,
              21
            );
          return roundTwoDecimals(acc);
        },
        0
      );
      const amountOfIva10 = productsWithIva10.reduce(
        (acc, product) => {
          const salePriceWithPlanDiscountAndSurcharge =
            calculateAmountPlusPercentaje(
              product.salePrice,
              planPercentSurcharge
            ) -
            (product.salePrice -
            calculateAmountMinusPercentaje(
              product.salePrice,
              planPercentDiscount
            ));
          const salePriceWithLineDiscountAndSurcharge =
            salePriceWithPlanDiscountAndSurcharge +
            product.surchargeAmount -
            product.discountAmount;
          const salePriceWithDiscountAndSurcharge =
            calculateAmountMinusPercentaje(
              salePriceWithLineDiscountAndSurcharge,
              this.porcentajeRecargoGlobal
            ) -
            (salePriceWithLineDiscountAndSurcharge -
              calculateAmountMinusPercentaje(
                salePriceWithLineDiscountAndSurcharge,
                this.porcentajeDescuentoGlobal
              ));
          acc +=
            salePriceWithDiscountAndSurcharge -
            calculatePercentReductionInAmount(
              salePriceWithDiscountAndSurcharge,
              10.5
            );
          return roundTwoDecimals(acc);
        },
        0
      );
      const amountOfIva27 = productsWithIva27.reduce(
        (acc, product) => {
          const salePriceWithPlanDiscountAndSurcharge =
            calculateAmountPlusPercentaje(
              product.salePrice,
              planPercentSurcharge
            ) -
            (product.salePrice -
            calculateAmountMinusPercentaje(
              product.salePrice,
              planPercentDiscount
            ));
          const salePriceWithLineDiscountAndSurcharge =
            salePriceWithPlanDiscountAndSurcharge +
            product.surchargeAmount -
            product.discountAmount;
          const salePriceWithDiscountAndSurcharge =
            calculateAmountMinusPercentaje(
              salePriceWithLineDiscountAndSurcharge,
              this.porcentajeRecargoGlobal
            ) -
            (salePriceWithLineDiscountAndSurcharge -
              calculateAmountMinusPercentaje(
                salePriceWithLineDiscountAndSurcharge,
                this.porcentajeDescuentoGlobal
              ));
          acc +=
            salePriceWithDiscountAndSurcharge -
            calculatePercentReductionInAmount(
              salePriceWithDiscountAndSurcharge,
              27
            );
          return roundTwoDecimals(acc);
        },
        0
      );

      const totalIvas = amountOfIva21 + amountOfIva10 + amountOfIva27;
      const totalDiscounts = this.descuentoGlobal + planAmountDiscount;
      const totalSurcharges = this.recargoGlobal + planAmountSurcharge;
      const sumOfProductPrices = productsDescription.reduce((acc, product) => acc + product.salePrice, 0);
      const subTotal = sumOfProductPrices + totalSurcharges - totalIvas - totalDiscounts;

      comprobante = {
        letra: "X",
        numeroCbte: generateFiveDecimalCode(),
        fechaEmision: formatDate(fecha),
        fechaVto: formatDate(fecha),
        condicionVenta: condVenta,
        productos: products,
        productosDetalle: productsDetail,
        productoDescription: productsDescription,
        barCode: generateBarCode(),
        cae: "",
        logoUrl: this.loguedUser.sucursal.logo,
        puntoVenta: ptoVenta,
        sucursal: sucursal,
        documentoComercial: documento,
        empresa: empresa,
        cliente: cliente,
        totalVenta: totalVenta,
        subTotal: subTotal,
        totalDescuentoGlobal: this.descuentoGlobal,
        totalRecargoGlobal: this.recargoGlobal,
        porcentajeDescuentoGlobal: this.porcentajeDescuentoGlobal,
        porcentajeRecargoGlobal: this.porcentajeRecargoGlobal,
        totalIva21: amountOfIva21,
        totalIva10: amountOfIva10,
        totalIva27: amountOfIva27,
        porcentajeRecargoPlan: planPercentSurcharge,
        porcentajeDescuentoPlan: planPercentDiscount,
        totalDescuentoPlan: roundTwoDecimals(planAmountDiscount),
        totalRecargoPlan: roundTwoDecimals(planAmountSurcharge),
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

    savePresupuesto(){
      const mediosPago = this.object.mediosPago;
      const planesPago = this.object.planPago;
      const totalVenta = this.totalVenta;
      const cliente = this.object.cliente;
      const empresa = this.loguedUser.empresa;
      const documento = this.object.documento;
      const sucursal = this.loguedUser.sucursal;
      const ptoVenta = this.loguedUser.puntoVenta;
      const products = this.products;
      const productsDetail = this.productsDetail;
      const productsDescription = this.productsDescription;
      const fecha = this.fecha;
      const tenant = this.tenant;
      const token = this.token;
      const service = this.service;
      const condVenta = this.checkSaleCondition(planesPago);
      const fechaVencimiento = this.object.fechaVencimiento;
      let file;
      let fileURL;
      let comprobante;
      let planPercentDiscount;
      let planPercentSurcharge;
      let planAmountDiscount = 0;
      let planAmountSurcharge = 0;
      const checkChangesInPrice = () => {
        productsDescription.forEach((productDescription) => {
          if (planesPago.porcentaje < 0) {
            const paymentPlanVariationPercent = transformPositive(
              planesPago.porcentaje
            );
            productDescription.discountAmount =
              productDescription.discountAmount +
              (productDescription.salePrice -
                calculateAmountMinusPercentaje(
                  productDescription.salePrice,
                  paymentPlanVariationPercent
                ));
            productDescription.discountPercent = sumarNumeros([
              productDescription.discountPercent,
              paymentPlanVariationPercent,
            ]);
          } else if (planesPago.porcentaje > 0) {
            const paymentPlanVariationPercent = transformPositive(
              planesPago.porcentaje
            );
            productDescription.surchargeAmount =
              productDescription.surchargeAmount +
              (calculateAmountPlusPercentaje(
                productDescription.salePrice,
                paymentPlanVariationPercent
              ) -
                productDescription.salePrice);
            productDescription.surchargePercent = sumarNumeros([
              productDescription.surchargePercent,
              paymentPlanVariationPercent,
            ]);
          } else {
            console.log("Not price modifications detected");
          }
        });
      };
      checkChangesInPrice();

      productsDescription.forEach((product) => {
        if (!product.surchargeAmount) {
          product.surchargeAmount = 0;
          product.surchargePercent = 0;
        }
        if (!product.discountAmount) {
          product.discountAmount = 0;
          product.discountPercent = 0;
        }
      });

      if (planesPago.porcentaje > 0) {
        planPercentDiscount = 0;
        planPercentSurcharge = planesPago.porcentaje;
        const totalSumOfProductPrices = productsDescription.reduce(
          (acc, product) => acc + product.salePrice,
          0
        );
        planAmountSurcharge =
          calculateAmountPlusPercentaje(
            totalSumOfProductPrices,
            planPercentSurcharge
          ) - totalSumOfProductPrices;
      } else {
        planPercentDiscount = transformPositive(
          planesPago.porcentaje
        );
        planPercentSurcharge = 0;
        const totalSumOfProductPrices = productsDescription.reduce(
          (acc, product) => acc + product.salePrice,
          0
        );
        planAmountDiscount =
          totalSumOfProductPrices -
          calculateAmountMinusPercentaje(
            totalSumOfProductPrices,
            planPercentDiscount
          );
      }

      const productsWithIva21 = productsDescription.filter(
        (el) => el.saleIvaPercent === 21
      );
      const productsWithIva10 = productsDescription.filter(
        (el) => el.saleIvaPercent === 10.5
      );
      const productsWithIva27 = productsDescription.filter(
        (el) => el.saleIvaPercent === 27
      );

      const amountOfIva21 = productsWithIva21.reduce(
        (acc, product) => {
          const salePriceWithPlanDiscountAndSurcharge =
            calculateAmountPlusPercentaje(
              product.salePrice,
              planPercentSurcharge
            ) -
            (product.salePrice -
            calculateAmountMinusPercentaje(
              product.salePrice,
              planPercentDiscount
            ));
          const salePriceWithLineDiscountAndSurcharge =
            salePriceWithPlanDiscountAndSurcharge +
            product.surchargeAmount -
            product.discountAmount;
          const salePriceWithDiscountAndSurcharge =
            calculateAmountMinusPercentaje(
              salePriceWithLineDiscountAndSurcharge,
              this.porcentajeRecargoGlobal
            ) -
            (salePriceWithLineDiscountAndSurcharge -
              calculateAmountMinusPercentaje(
                salePriceWithLineDiscountAndSurcharge,
                this.porcentajeDescuentoGlobal
              ));
          acc +=
            salePriceWithDiscountAndSurcharge -
            calculatePercentReductionInAmount(
              salePriceWithDiscountAndSurcharge,
              21
            );
          return roundTwoDecimals(acc);
        },
        0
      );
      const amountOfIva10 = productsWithIva10.reduce(
        (acc, product) => {
          const salePriceWithPlanDiscountAndSurcharge =
            calculateAmountPlusPercentaje(
              product.salePrice,
              planPercentSurcharge
            ) -
            (product.salePrice -
            calculateAmountMinusPercentaje(
              product.salePrice,
              planPercentDiscount
            ));
          const salePriceWithLineDiscountAndSurcharge =
            salePriceWithPlanDiscountAndSurcharge +
            product.surchargeAmount -
            product.discountAmount;
          const salePriceWithDiscountAndSurcharge =
            calculateAmountMinusPercentaje(
              salePriceWithLineDiscountAndSurcharge,
              this.porcentajeRecargoGlobal
            ) -
            (salePriceWithLineDiscountAndSurcharge -
              calculateAmountMinusPercentaje(
                salePriceWithLineDiscountAndSurcharge,
                this.porcentajeDescuentoGlobal
              ));
          acc +=
            salePriceWithDiscountAndSurcharge -
            calculatePercentReductionInAmount(
              salePriceWithDiscountAndSurcharge,
              10.5
            );
          return roundTwoDecimals(acc);
        },
        0
      );
      const amountOfIva27 = productsWithIva27.reduce(
        (acc, product) => {
          const salePriceWithPlanDiscountAndSurcharge =
            calculateAmountPlusPercentaje(
              product.salePrice,
              planPercentSurcharge
            ) -
            (product.salePrice -
            calculateAmountMinusPercentaje(
              product.salePrice,
              planPercentDiscount
            ));
          const salePriceWithLineDiscountAndSurcharge =
            salePriceWithPlanDiscountAndSurcharge +
            product.surchargeAmount -
            product.discountAmount;
          const salePriceWithDiscountAndSurcharge =
            calculateAmountMinusPercentaje(
              salePriceWithLineDiscountAndSurcharge,
              this.porcentajeRecargoGlobal
            ) -
            (salePriceWithLineDiscountAndSurcharge -
              calculateAmountMinusPercentaje(
                salePriceWithLineDiscountAndSurcharge,
                this.porcentajeDescuentoGlobal
              ));
          acc +=
            salePriceWithDiscountAndSurcharge -
            calculatePercentReductionInAmount(
              salePriceWithDiscountAndSurcharge,
              27
            );
          return roundTwoDecimals(acc);
        },
        0
      );

      const totalIvas = amountOfIva21 + amountOfIva10 + amountOfIva27;
      const totalDiscounts = this.descuentoGlobal + planAmountDiscount;
      const totalSurcharges = this.recargoGlobal + planAmountSurcharge;
      const sumOfProductPrices = productsDescription.reduce((acc, product) => acc + product.salePrice, 0);
      const subTotal = sumOfProductPrices + totalSurcharges - totalIvas - totalDiscounts;

      comprobante = {
        letra: "P",
        numeroCbte: generateFiveDecimalCode(),
        fechaEmision: formatDate(fecha),
        fechaVto: formatDate(fecha),
        fechaVencimiento,
        condicionVenta: condVenta,
        vencido: 'vigente',
        productos: products,
        productosDetalle: productsDetail,
        productoDescription: productsDescription,
        barCode: generateBarCode(),
        cae: "",
        logoUrl: this.loguedUser.sucursal.logo,
        puntoVenta: ptoVenta,
        sucursal: sucursal,
        documentoComercial: documento,
        empresa: empresa,
        cliente: cliente,
        totalVenta: totalVenta,
        subTotal: subTotal,
        totalDescuentoGlobal: this.descuentoGlobal,
        totalRecargoGlobal: this.recargoGlobal,
        porcentajeDescuentoGlobal: this.porcentajeDescuentoGlobal,
        porcentajeRecargoGlobal: this.porcentajeRecargoGlobal,
        totalIva21: amountOfIva21,
        totalIva10: amountOfIva10,
        totalIva27: amountOfIva27,
        porcentajeRecargoPlan: planPercentSurcharge,
        porcentajeDescuentoPlan: planPercentDiscount,
        totalDescuentoPlan: roundTwoDecimals(planAmountDiscount),
        totalRecargoPlan: roundTwoDecimals(planAmountSurcharge),
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
                  this.$successAlert("Presupuesto generado")
                  .then(()=>{
                    this.clear();
                    this.loaded = true;
                  })
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
                      parseFloat(stock.cantidad) -
                      parseFloat(productInReceipt.cantUnidades);
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
                      parseFloat(stock.cantidad) -
                      parseFloat(productInReceipt.cantUnidades);
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
      this.resetPresupuestSearch = true;
      this.$store.commit("productos/resetStates");
    },

    /******************************************************************************************************/
    /* FUNCITON FOR TEST AFIP CERT -----------------------------------------------------------------------*/
    /******************************************************************************************************/
    testCert() {
      const cuit = "27149046785";
      const idFiscal = "5";
      const codigoDocumento = "001";
      axios
        .get(
          `${process.env.VUE_APP_API_AFIP}/rest_api_afip/obtenerUltimoNumeroAutorizado/${cuit}/${idFiscal}/${codigoDocumento}`
        )
        .then((data) => {
          console.log(data);
        });
    },
  },
};
</script>