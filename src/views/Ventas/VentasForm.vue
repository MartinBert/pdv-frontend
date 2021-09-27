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
                        :roles="clienteRules"
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
                        :roles="comprobantesRules"
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
                        :roles="medioPagoRules"
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
                        required
                        :roles="plandePagoRules"
                      ></v-autocomplete>
                    </v-col>
                    <v-col
                      cols="6"
                      v-if="
                        object.documento &&
                          object.documento.nombre === 'Presupuesto'
                      "
                    >
                      <label for="date_input"
                        >Fecha de vencimiento de presupuesto</label
                      >
                      <v-text-field
                        id="date_input"
                        type="date"
                        outlined
                        filled
                        dense
                        v-model="object.fechaVencimiento"
                        required
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
                    <!-- <v-row>
                      <v-col class="text-right">
                        <label class="mr-3 align-center">TOTAL DE DESCUENTOS Y RECARGOS POR LÍNEA</label>
                        <input
                          disabled
                          class="totalInput mr-1"
                          type="text"
                          v-model="totalLineDiscounts"
                        />
                        <input
                          disabled
                          class="totalInput"
                          type="text"
                          v-model="totalLineSurchages"
                        />
                      </v-col>
                    </v-row> -->
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
                              <input
                                type="number"
                                v-model="p.precioTotal"
                                @input="detectPriceEdition(p)"
                              />
                            </div>
                          </td>

                          <td>
                            <button type="button">
                              <img
                                src="/../../images/icons/delete.svg"
                                @click="deleteLine(p)"
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
    <SearchPresupuestoDialog
      v-on:selectPresupuesto="selectPresupuesto"
      :resetPresupuestSearch="resetPresupuestSearch"
    />
    <v-dialog v-model="dialogIndividualPercent" width="600">
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
import StocksService from "../../services/StocksService";
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
  roundTwoDecimals,
  transformPositive,
  sumarNumeros,
  calculatePositivePercentajeCoefficient,
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
    comprobantesRules: [(v) => !!v || "Comprobante es requerido"],
    medioPagoRules: [(v) => !!v || "medios de pago es requerido"],
    plandePagoRules: [(v) => !!v || "Plan de pago es requerido"],
    clienteRules: [(v) => !!v || "Cliente es requerido"],
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
    resetPresupuestSearch: false,
    processStockResult: [],
    productsWithoutStock: [],
    productsInOtherDeposits: [],
    lowStock: [],
    perfil: null,
    processPresupuesto: false,
  }),

  components: {
    Calculator,
    ProductDialog,
    Spinner,
    SearchPresupuestoDialog,
  },

  created() {
    this.$barcodeScanner.init((barcode) => this.onBarcodeScanned(barcode));
  },

  destroyed() {
    this.$barcodeScanner.destroy();
  },

  computed: {
    totalVenta() {
      let planDiscountPercent = 0;
      let planSurchagePercent = 0;
      if (this.object.planPago) {
        planDiscountPercent =
          this.object.planPago.porcentaje < 0
            ? this.object.planPago.porcentaje
            : 0;
        planSurchagePercent =
          this.object.planPago.porcentaje > 0
            ? this.object.planPago.porcentaje
            : 0;
      }
      const sumOfProductPrices = this.products.reduce((acc, el) => {
        if (
          !el.nombre.includes("DESCUENTO") &&
          !el.nombre.includes("RECARGO")
        ) {
          acc += Number(el.precioTotal);
        }
        return acc;
      }, 0);
      const totalOfPlanDiscount =
        sumOfProductPrices * decimalPercent(planDiscountPercent);
      const totalOfPlanSurcharge =
        sumOfProductPrices * decimalPercent(planSurchagePercent);
      const globalDiscount =
        sumOfProductPrices *
        decimalPercent(this.porcentajeDescuentoGlobal) *
        -1;
      const globalSurcharge =
        sumOfProductPrices * decimalPercent(this.porcentajeRecargoGlobal);
      const total =
        sumOfProductPrices +
        totalOfPlanDiscount +
        totalOfPlanSurcharge +
        globalDiscount +
        globalSurcharge;
      return roundTwoDecimals(total);
    },

    totalItems() {
      const totItems = this.products.reduce(
        (acc, el) => acc + Number(el.cantUnidades),
        0
      );
      return totItems;
    },

    totalLineDiscounts() {
      const total = this.products.reduce((acc, el) => {
        if (el.nombre.includes("DESCUENTO - ")) {
          acc += el.precioTotal;
        }
        return acc;
      }, 0);
      return total;
    },

    totalLineSurchages() {
      const total = this.products.reduce((acc, el) => {
        if (el.nombre.includes("RECARGO - ")) {
          acc += el.precioTotal;
        }
        return acc;
      }, 0);
      return total;
    },
  },

  mounted() {
    this.perfil = this.loguedUser.perfil;
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

    addProduct(data) {
      let existe = false;
      data = [...new Set(data)];
      this.productsDetail = data;
      data.forEach((product) => {
        existe = false;
        this.productsDescription.forEach((product2) => {
          if (product.codigoBarra === product2.barCode) {
            existe = true;
          }
        });
        if (!existe) {
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
        }
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
      this.databaseItems.planes = paymentMethod.planPago;
    },

    selectPresupuesto(presupuesto) {
      presupuesto.productos.forEach((el) => {
        el.total = el.precioTotal;
        el.editable = true;
      });
      this.getComercialDocuments(
        presupuesto.cliente.condicionIva.documentos,
        this.loguedUser.sucursal.condicionIva.documentos
      );
      this.getPaymentPlans(presupuesto.mediosPago[0]);
      this.object = presupuesto;
      this.object.mediosPago = presupuesto.mediosPago[0];
      this.object.planPago = presupuesto.planesPago[0];
      presupuesto.productos.forEach((product, index) => {
        product.id = index;
      })
      this.products = presupuesto.productos;
      this.porcentajeDescuentoGlobal = this.object.porcentajeDescuentoGlobal;
      this.porcentajeRecargoGlobal = this.object.porcentajeRecargoGlobal;
      this.processPresupuesto = true;
      this.object.productoDescription.forEach((product) => {
        product.salePrice = product.salePrice + product.discountAmount - product.surchargeAmount;
        product.discountPercent = 0;
        product.discountAmount = 0;
      })
      this.object.porcentajeDescuentoGlobal = 0;
      this.object.porcentajeRecargoGlobal = 0;
      this.object.totalDescuentoGlobal = 0;
      this.object.totalRecargoGlobal = 0;
      this.productsDescription = this.object.productoDescription;
      console.log(this.object);
    },

    /******************************************************************************************************/
    /* ALL FUNCTIONS FOR PROCESS SALE DATA ---------------------------------------------------------------*/
    /******************************************************************************************************/
    detectPriceEdition(p) {
      this.productsDescription.filter(
        (el) => el.barCode === p.codigoBarra
      )[0].salePrice = Number(p.precioTotal);
    },

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
          el.precioTotal = roundTwoDecimals(
            parseFloat(el.precioUnitario) * el.cantUnidades
          );
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
        precioUnitario: parseFloat(precioTotal),
        ivaVentas: ivaVentasObject.porcentaje,
        precioTotal: parseFloat(total),
        editable: editable,
      };
      return object;
    },

    deleteLine(product) {
      const { id, codigoBarra } = product;
      const filter = this.products.filter((el) => el.id !== id);
      const filterForStore = this.products.filter((el) => el.id === id)[0].id;
      const filterForProductsDescription = this.productsDescription.filter(
        (el) => el.barCode !== codigoBarra
      );
      const filterForProductsDetail = this.productsDetail.filter(
        (el) => el.id !== id
      );

      if (product.nombre === "DESCUENTO") {
        this.descuentoGlobal = 0;
        this.porcentajeDescuentoGlobal = 0;
      }

      if (product.nombre === "RECARGO") {
        this.recargoGlobal = 0;
        this.porcentajeRecargoGlobal = 0;
      }

      this.products = filter;
      this.productsDescription = filterForProductsDescription;
      this.productsDetail = filterForProductsDetail;
      this.$store.commit("productos/removeProductsToList", filterForStore);
      this.listennerOfListChange = id;
    },

    applyModification(modificator, priceModificationPorcent) {
      if (this.totalVenta > 0) {
        const total = this.productsDescription.reduce(
          (acc, el) => acc + el.salePrice * Number(el.quantity),
          0
        );
        let percent = calculatePercentaje(total, priceModificationPorcent);
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
          this.porcentajeDescuentoGlobal += Number(priceModificationPorcent);
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
          this.porcentajeRecargoGlobal += Number(priceModificationPorcent);
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
      if (
        documento !== undefined &&
        this.object.mediosPago !== undefined &&
        this.object.planPago !== undefined
      ) {
        if (documento.tipo === true) {
          if (documento.ticket === true) {
            this.saveTicket(documento.nombre);
          } else {
            this.save();
          }
        } else if (documento.presupuesto === true) {
          if (this.object.fechaVencimiento) {
            this.savePresupuesto();
          } else {
            this.$errorAlert(
              "Debe indicar una fecha de vencimiento en el presupuesto"
            ).then((result) => {
              if (result.isDismissed) {
                this.loaded = true;
              }
            });
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
      const productsDetail = this.productsDetail;
      const documento = this.object.documento;
      const empresa = this.loguedUser.empresa;
      const cliente = this.object.cliente;
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
                  axios.post(
                    `http://192.168.1.100:3500/api/impresora/factura`,
                    comprobante
                  );
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

    saveNoFiscal() {
      const mediosPago = this.object.mediosPago;
      const planesPago = this.object.planPago;
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
      const condVenta = this.checkSaleCondition(planesPago);
      const service = this.service;
      let file;
      let fileURL;
      let comprobante;

      VentasService(tenant, "ventas", token)
        .getPreviousCorrelativeDocumentNumber(
          sucursal.id,
          documento.codigoDocumento
        )
        .then((data) => {
          const numeroCorrelativoDeComprobante = parseInt(data.data) + 1;
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
              if (total && subTotal && amountOfIva21) {
                comprobante = {
                  letra: "X",
                  numeroCbte:
                    addZerosInString("04", ptoVenta.idFiscal) +
                    "-" +
                    addZerosInString("08", numeroCorrelativoDeComprobante),
                  correlativoComprobante: numeroCorrelativoDeComprobante,
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
                  totalDescuentoGlobal: this.descuentoGlobal,
                  totalRecargoGlobal: this.recargoGlobal,
                  porcentajeDescuentoGlobal: this.porcentajeDescuentoGlobal,
                  porcentajeRecargoGlobal: this.porcentajeRecargoGlobal,
                  totalVenta: total,
                  subTotal: subTotal,
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
                  planesPago: [planesPago],
                  nombreDocumento: documento.nombre,
                };
              } else {
                comprobante = this.object;
                comprobante.letra = documento.letra;
                comprobante.numeroCbte =
                  addZerosInString("04", ptoVenta.idFiscal) +
                  "-" +
                  addZerosInString("08", numeroCorrelativoDeComprobante);
                comprobante.fechaEmision = formatDate(getCurrentDate());
                comprobante.fechaVto = formatDate(fecha);
                comprobante.correlativoComprobante = numeroCorrelativoDeComprobante;
                comprobante.condicionVenta = condVenta;
                comprobante.barCode = generateBarCode();
                comprobante.mediosPago = [this.object.mediosPago];
                comprobante.planesPago = this.object.planesPago;
                comprobante.nombreDocumento = documento.nombre;
                comprobante.documentoComercial = documento;
              }

              console.log(comprobante);
              axios.post(
                `http://192.168.1.100:3500/api/impresora/factura`,
                comprobante
              );
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
                      this.applyStockModifications(comprobante);
                    });
                });
            }
          );
        });
    },

    savePresupuesto() {
      const mediosPago = this.object.mediosPago;
      const planesPago = this.object.planPago;
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

      VentasService(tenant, "ventas", token)
        .getPreviousCorrelativeDocumentNumber(
          sucursal.id,
          documento.codigoDocumento
        )
        .then((data) => {
          const numeroCorrelativoDeComprobante = parseInt(data.data) + 1;

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
              comprobante = {
                letra: "P",
                numeroCbte:
                  addZerosInString("04", ptoVenta.idFiscal) +
                  "-" +
                  addZerosInString("08", numeroCorrelativoDeComprobante),
                correlativoComprobante: numeroCorrelativoDeComprobante,
                fechaEmision: formatDate(fecha),
                fechaVto: formatDate(fecha),
                fechaVencimiento,
                condicionVenta: condVenta,
                vencido: "vigente",
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
                totalDescuentoGlobal: this.descuentoGlobal,
                totalRecargoGlobal: this.recargoGlobal,
                porcentajeDescuentoGlobal: this.porcentajeDescuentoGlobal,
                porcentajeRecargoGlobal: this.porcentajeRecargoGlobal,
                totalVenta: total,
                subTotal: subTotal,
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
                planesPago: [planesPago],
                nombreDocumento: documento.nombre,
              };

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
                      this.$successAlert("Presupuesto generado").then(() => {
                        this.clear();
                        this.loaded = true;
                      });
                    });
                });
            }
          );
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
      const planPago = this.object.planPago;
      console.log(this.porcentajeDescuentoGlobal);

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
        prodDescription.discountAmount =
          prodDescription.salePrice *
          Number(prodDescription.quantity) *
          decimalPercent(prodDescription.discountPercent);
        prodDescription.surchargeAmount =
          prodDescription.salePrice *
          Number(prodDescription.quantity) *
          decimalPercent(prodDescription.surchargePercent);
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
      const total = productsDescription.reduce(
        (acc, el) => acc + el.salePrice * Number(el.quantity),
        0
      );
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
