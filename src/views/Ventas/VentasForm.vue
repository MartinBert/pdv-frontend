<template>
  <v-container>
    <!-- Body -->
    <v-col cols="12">
      <form @submit.prevent="applyChangesInLoguedUserData()" v-if="loguedUser.perfil === 2">
        <v-row>
          <v-col cols="2" class="mt-2">
            <span >
              Sucursal de facturación:
            </span>
          </v-col>
          <v-col cols="2">
            <v-autocomplete
            filled
            dense
              v-model="loguedUser.sucursal"
              :items="loguedUser.empresa.sucursales"
              :return-object="true"
              item-text="nombre"
            />
          </v-col>
          <v-col cols="1" class="mt-2 text-end">
            <span>
              Punto Vta:
            </span>
          </v-col>
          <v-col cols="2">
            <v-autocomplete
            filled
            dense
              v-model="loguedUser.puntoVenta"
              :items="loguedUser.sucursal.puntosVenta"
              :return-object="true"
              item-text="nombre"
            />
          </v-col>
          <v-col>
            <v-btn type="submit" class="success">Aplicar cambios</v-btn>
          </v-col>
        </v-row>
      </form>
      
      <v-row>
        <v-col cols="6">
          <div class="d-flex text-left">
            <v-btn
              color="primary"
              @click="$store.commit('productos/dialogProductosMutation')"
            >BUSCAR PRODUCTOS</v-btn>
            <h5 class="mt-2 ml-2">Depósito predeterminado: {{defaultDeposit.nombre}}</h5>
          </div>
          
          <!-- <v-btn
            class="ml-1"
            color="primary"
            @click="testcert()"
            >TEST CERTIFICADO</v-btn
          > -->
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
            <v-row>
              <div class="horizontalSeparator"></div>
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
                        <td>${{ p.precioTotal }}</td>
                        <td>
                          <button type="button">
                            <img
                              src="/../../images/icons/ico_11.svg"
                              @click="deleteLine(p.id)"
                              width="40"
                              height="40"
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
                <v-btn type="submit" class="success">Finalizar venta</v-btn>
                <v-btn type="button" class="error ml-1" @click="cancelSale()">Cancelar</v-btn>
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
              <Calculator />
              <div style="text-align:center;padding:1em 0;"> 
                <h3><a style="text-decoration:none;" href="https://www.zeitverschiebung.net/es/city/3435910"><span style="color:gray;">Hora actual en</span><br />Argentina</a></h3> <iframe src="https://www.zeitverschiebung.net/clock-widget-iframe-v2?language=es&size=medium&timezone=America%2FArgentina%2FBuenos_Aires" width="100%" height="115" frameborder="0" seamless></iframe> </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>

    <!-- Add products dialog -->
    <ProductDialog v-on:productList="addProduct" v-on:resetListStatus="resetListOfDialog" :refreshListStatus="listennerOfListChange" />

    <!-- Individual percent dialog -->
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
  </v-container>
</template>

<script>
import GenericService from "../../services/GenericService";
import VentasService from "../../services/VentasService";
import Calculator from "../../components/Calculator";
import ProductDialog from "../../components/ProductDialog";
import { formatDate, getCurrentDate } from "../../helpers/dateHelper";
import { checkIfInvoice } from "../../helpers/processObjectsHelper";
import {
  calculateAlicIvaBaseImpVentas,
  calculateAlicIvaImporteVentas,
  generateBarCode,
  calculatePercentaje,
  decimalPercent,
  generateFiveDecimalCode
} from "../../helpers/mathHelper";
import { errorAlert, successAlert } from '../../helpers/alerts';
import axios from "axios";
import ReportsService from "../../services/ReportsService";

export default {
  data: () => ({
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    fecha: getCurrentDate(),
    valid: true,
    barcode: "",
    page: 0,
    size: 1000,
    object: {},
    databaseItems: {
      clientes: [],
      medios_de_pago: [],
      documentos: []
    },
    productos: [],
    products: [],
    depositos: [],
    defaultDeposit: {},
    tenant: "",
    service: "ventas",
    token: localStorage.getItem("token"),
    snackError: false,
    errorMessage: "",
    afipModuleAuthorization: {},
    modificator: "",
    priceModificationPorcent: 0,
    dialogIndividualPercent: false,
    renglon: {},
    individualPercent: "",
    listennerOfListChange: 0
  }),

  components: {
    Calculator,
    ProductDialog,
  },

  created() {
    // this.$barcodeScanner.init(this.onBarcodeScanned);
  },

  destroyed () {
      this.$barcodeScanner.destroy()
  },

  computed: {
    totalVenta() {
      const total = this.products.reduce((acc, el) => {
        if(this.object.planPago){
          const cleanPorcent = decimalPercent(this.object.planPago.porcentaje);
          const impPorcent = el.precioTotal * cleanPorcent;
          const totalValue = Math.round((acc + Number(el.precioTotal) + Number(impPorcent)) * 100) / 100;
          return totalValue;
        }else{
          return acc + Number(el.precioTotal);
        }
      }, 0);

      return total;
    },

    totalItems() {
      const totItems = this.products.reduce((acc, el) => acc + Number(el.cantUnidades), 0);
      return totItems;
    },
  },

  mounted() {
    this.$store.commit("productos/resetStates");
    this.tenant = this.$route.params.tenant;
    this.getObjects();
  },

  methods: {

    getObjects() {
      let id;
      if(this.loguedUser.perfil < 3){
        id = ""
      }else{
        id = this.loguedUser.sucursal.id;
      }
      
      const filterParam = { id, param: "", page: 0, size: 100000};
      
      GenericService(this.tenant, "clientes", this.token)
        .filter(filterParam)
        .then((data) => {
          this.databaseItems.clientes = data.data.content;
        });

      GenericService(this.tenant, "mediosPago", this.token)
        .filter(filterParam)
        .then((data) => {
          this.databaseItems.medios_de_pago = data.data.content;
        });

      GenericService(this.tenant, "depositos", this.token)
        .filter(filterParam)
        .then((data) => {
          this.depositos = data.data.content;
          this.defaultDeposit = data.data.content.filter(el => el.defaultDeposit === '1')[0];
        });

      VentasService(this.tenant, this.service, this.token)
        .getAfipModuleAuthorization()
        .then((data) => {
          this.afipModuleAuthorization = data.data;
        });
    },

    processProductsObject(producto) {
      const {
        id,
        nombre,
        codigoBarra,
        cantUnidades,
        precioTotal,
        total,
      } = producto;
      let object = {
        id: id,
        nombre: nombre,
        codigoBarra: codigoBarra,
        cantUnidades: cantUnidades,
        precioUnitario: parseFloat(precioTotal).toFixed(2),
        precioTotal: parseFloat(total).toFixed(2),
      };
      return object;
    },

    onBarcodeScanned(barcode) {
      let id;
      if(this.loguedUser.perfil < 3){
        id = '';
      }else{
        id = this.loguedUser.sucursal.id;
      }

      GenericService(this.tenant, "productos", this.token)
        .filter({id, param: barcode, page: 0, size: 1})
        .then((data) => {
          let databaseItem = data.data.content[0];
          if (this.products.length == 0) {
            databaseItem.cantUnidades = 1;
            databaseItem.total = databaseItem.precioTotal;
            this.products.push(this.processProductsObject(databaseItem));
          } else {
            if(this.products.filter(el => el.id === databaseItem.id).length > 0){
              this.products.filter(el => el.id === databaseItem.id)[0].cantUnidades++;
              this.products.filter(el => el.id === databaseItem.id)[0].precioTotal = 
              this.products.filter(el => el.id === databaseItem.id)[0].precioUnitario *
              this.products.filter(el => el.id === databaseItem.id)[0].cantUnidades;
            }else{
              databaseItem.cantUnidades = 1;
              databaseItem.total = databaseItem.precioTotal;
              this.products.push(this.processProductsObject(databaseItem));
            }
          }
        })
        .catch(() => {
          errorAlert("No existe un producto con ese código de barras");
        });
    },

    updateTotal(id) {
      return this.products.reduce((acc, el) => {
        if (el.id == id) {
          el.precioTotal = acc;
          el.precioTotal = parseFloat(el.precioUnitario) * el.cantUnidades;
        }
      }, 0);
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
          if(Math.sign(percent) === 1){
            percent = percent * -1;
          }
          let obj = {
            id:this.products.length + 1,
            nombre: "DESCUENTO",
            codigoBarra: 1111111111,
            cantUnidades: 0,
            precioUnitario: percent,
            precioTotal: percent,
          };
          this.products.push(obj);
        } else {
          if(Math.sign(percent) === -1){
            percent = percent * -1;
          }
          let obj = {
            id:this.products.length + 1,
            nombre: "RECARGO",
            codigoBarra: 2222222222,
            cantUnidades: 0,
            precioUnitario: percent,
            precioTotal: percent,
          };
          this.products.push(obj);
        }
      } else {
        errorAlert("No hay productos seleccionados en la venta");
      }
    },

    applyIndividualPercent(p) {
      this.dialogIndividualPercent = true;
      this.renglon = p;
    },

    addProduct(data) {
      data = [...new Set(data)];
      let processObjects = [];
      data.forEach((el) => { 
        processObjects.push(this.processProductsObject(el));
      });

      this.products = processObjects;
    },

    applyToLine(percent) {
      let object = {};
      if (Math.sign(percent) === -1) {
        object = {
          id: this.products.length + 1,
          nombre: "DESCUENTO - " + this.renglon.nombre,
          codigoBarra: generateBarCode(),
          cantUnidades: 0,
          precioUnitario: calculatePercentaje(
            this.renglon.precioTotal,
            percent
          ),
          precioTotal: calculatePercentaje(this.renglon.precioTotal, percent),
        };
      } else {
        object = {
          id: this.products.length + 1,
          nombre: "RECARGO - " + this.renglon.nombre,
          codigoBarra: generateBarCode(),
          cantUnidades: 0,
          precioUnitario: calculatePercentaje(
            this.renglon.precioTotal,
            percent
          ),
          precioTotal: calculatePercentaje(this.renglon.precioTotal, percent),
        };
      }
      this.products.push(object);
      this.dialogIndividualPercent = false;
    },

    resetListOfDialog(){
      this.listennerOfListChange = 0;
    },

    save() {
      /* Constants */
      const sucursal = this.loguedUser.sucursal;
      const ptoVenta = this.loguedUser.puntoVenta;
      const products = this.products;
      const documento = this.object.documento;
      const empresa = this.loguedUser.empresa;
      const cliente = this.object.cliente;
      const mediosPago = this.object.mediosPago;
      const planesPago = this.object.planPago;
      const fecha = this.fecha;
      const totalVenta = this.totalVenta;
      const tenant = this.tenant;
      const token = this.token;
      const service = this.service;
      const afipAuthorization = this.afipModuleAuthorization;
      const filterParam = {id: sucursal.id, param: "", page: 0, size: 100000}

      /* Mutable vars */
      let tipoDoc;
      let alicIva = { baseImp: 0, id: 5, importe: 0 };
      let impNeto;
      let comprobante;
      let cabeceraAfip;
      let detalleAfip;
      let file;
      let fileURL;
      let productos;
      let condVenta;
      let productsBelowMinimumStock = [];
      let productsOutOfStockAndDeposits = [];
      let productsWithoutStockOnDefaultDeposit = [];

      if (planesPago) {
        if (planesPago.length < 2) {
          if (planesPago[0].cuotas > 1) {
            condVenta = true;
          } else {
            condVenta = false;
          }
        } else {
          condVenta = false;
        }
      } else {
        condVenta = true;
      }

      if (documento.ivaCat == 1) {
        tipoDoc = 80;
      } else {
        tipoDoc = 94;
      }

      if (documento.ivaCat == 2 || documento.ivaCat == 1) {
        alicIva.baseImp = calculateAlicIvaBaseImpVentas(totalVenta);
        alicIva.importe = calculateAlicIvaImporteVentas(
          totalVenta,
          alicIva.baseImp
        );
        impNeto = alicIva.baseImp;
      } else {
        alicIva = [];
      }

      //Instance body from AFIP ws-services
      let body = {
        alicIva: [alicIva],
        asociados: [],
        cbteTipo: documento.codigoDocumento,
        concepto: 1,
        cotizMoneda: 1,
        cuit: sucursal.cuit,
        fecha: fecha,
        fechaServicioHasta: fecha,
        fechaServicioVenc: fecha,
        fechaServiciodesde: fecha,
        fechaVencimientoPago: "0",
        idMoneda: "PES",
        impNeto: impNeto,
        name: sucursal.razonSocial,
        nroDesde: "",
        nroDoc: cliente.cuit,
        nroHasta: "",
        opcionales: [],
        ptoVenta: ptoVenta.idFiscal,
        tipoDoc: tipoDoc,
        tributos: [],
      };
  
      //Get authorized voucher number
      axios
        .get(
          `${process.env.VUE_APP_API_AFIP}/rest/api/facturas/obtenerUltimoNumeroAutorizado/${body.name}/${body.cuit}/${body.ptoVenta}/${body.cbteTipo}`,
          {
            headers: afipAuthorization,
          }
        )
        .then((data) => {
          body.nroDesde = data.data + 1;
          body.nroHasta = body.nroDesde;
          if (mediosPago !== undefined) {
            if (body.impNeto !== 0) {
              axios
                .post(
                  `${process.env.VUE_APP_API_AFIP}/rest/api/facturas/generarComprobante/${sucursal.razonSocial}`,
                  body,
                  {
                    headers: afipAuthorization,
                  }
                )
                .then((data) => {
                  cabeceraAfip = data.data.feCabResp;
                  detalleAfip = data.data.feDetResp;

                  comprobante = {
                    letra: documento.letra,
                    numeroCbte: body.nroDesde,
                    fechaEmision: formatDate(cabeceraAfip.fchProceso),
                    fechaVto: formatDate(detalleAfip[0].caefchVto),
                    condicionVenta: condVenta,
                    productos: products,
                    barCode: detalleAfip[0].barcode,
                    cae: detalleAfip[0].cae,
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

                  if (comprobante.cae) {
                    GenericService(tenant, "comprobantesFiscales", token).save(
                      comprobante
                    );

                    GenericService(tenant, "stock", token)
                      .filter(filterParam)
                      .then((data) => {
                        productos = data.data.content;

                        productos.forEach((el) => {
                          comprobante.productos.forEach((e) => {
                            if (el.producto.id === e.id) {
                              e.checked = true
                              switch (el.deposito.id) {
                                case this.defaultDeposit.id:
                                    el.cantidad = parseInt(el.cantidad) - parseInt(e.cantUnidades);

                                    if(el.cantidadMinima && el.cantidad < Number(el.cantidadMinima)){
                                      productsBelowMinimumStock.push(el);
                                    }
                                    GenericService(tenant, "stock", token).save(el);
                                  break;
                              
                                default:
                                    el.cantidad = parseInt(el.cantidad) - parseInt(e.cantUnidades);
                                    if(el.cantidadMinima && el.cantidad < Number(el.cantidadMinima)){
                                      productsBelowMinimumStock.push(el);
                                    }
                                    GenericService(tenant, "stock", token).save(el);
                                    productsWithoutStockOnDefaultDeposit.push(el);
                                  break;
                              }
                            }
                          });
                        });

                        const viewCheckedProductsInReceipt = comprobante.productos.filter(el => !el.checked);
                        if(viewCheckedProductsInReceipt.length > 0){
                          productsOutOfStockAndDeposits = viewCheckedProductsInReceipt;
                        }
                      })
                      .then(() => {
                        successAlert("Venta realizada")
                        .then(()=>{
                          VentasService(this.tenant, this.service, this.token)
                          .checkProductsAndDepositsStatus(productsBelowMinimumStock, productsWithoutStockOnDefaultDeposit, productsOutOfStockAndDeposits);
                        })
                      })
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
                      });

                    this.object = {};
                    this.products = [];
                    this.modificator = "";
                    this.priceModificationPorcent = 0;
                    this.individualPercent = "";
                    this.listennerOfListChange = 999999999;
                    this.$store.commit("productos/resetStates");
                  } else {
                    if(detalleAfip[0].observaciones){
                      errorAlert(detalleAfip[0].observaciones[0].msg)
                    }else{
                      errorAlert("Tipo de comprobante no disponible");
                    }
                  }
                });
            } else {
              errorAlert("No hay productos seleccionados en la venta");
            }
          } else {
            errorAlert("Debe seleccionar un medio de pago");
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
      const filterParam = {id: sucursal.id, param: "", page: 0, size: 100000}

      //Mutable vars
      let file;
      let fileURL;
      let productos;
      let comprobante;
      let condVenta;
      let productsBelowMinimumStock = [];
      let productsOutOfStockAndDeposits = [];
      let productsWithoutStockOnDefaultDeposit = [];

      if (planesPago) {
        if (planesPago.length < 2) {
          if (planesPago[0].cuotas > 1) {
            condVenta = true;
          } else {
            condVenta = false;
          }
        } else {
          condVenta = false;
        }
      } else {
        condVenta = true;
      }

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

      if (comprobante.mediosPago[0] !== undefined) {
        if (Number(comprobante.totalVenta) !== 0) {
          GenericService(tenant, "comprobantesFiscales", token).save(
            comprobante
          );

          GenericService(tenant, "stock", token)
            .filter(filterParam)
            .then((data) => {
              productos = data.data.content;

              productos.forEach((el) => {
                comprobante.productos.forEach((e) => {
                  if (el.producto.id === e.id) {
                    e.checked = true
                    switch (el.deposito.id) {
                      case this.defaultDeposit.id:
                          el.cantidad = parseInt(el.cantidad) - parseInt(e.cantUnidades);

                          if(el.cantidadMinima && el.cantidad < Number(el.cantidadMinima)){
                            productsBelowMinimumStock.push(el);
                          }
                          GenericService(tenant, "stock", token).save(el);
                        break;
                    
                      default:
                          el.cantidad = parseInt(el.cantidad) - parseInt(e.cantUnidades);
                          if(el.cantidadMinima && el.cantidad < Number(el.cantidadMinima)){
                            productsBelowMinimumStock.push(el);
                          }
                          GenericService(tenant, "stock", token).save(el);
                          productsWithoutStockOnDefaultDeposit.push(el);
                        break;
                    }
                    
                  }
                });
              });

              const viewCheckedProductsInReceipt = comprobante.productos.filter(el => !el.checked);
              if(viewCheckedProductsInReceipt.length > 0){
                productsOutOfStockAndDeposits = viewCheckedProductsInReceipt;
              }
            })
            .then(() => {
              successAlert("Venta realizada")
              .then(()=>{
                VentasService(this.tenant, this.service, this.token)
                .checkProductsAndDepositsStatus(productsBelowMinimumStock, productsWithoutStockOnDefaultDeposit, productsOutOfStockAndDeposits);
              })
            })
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
            });

          this.object = {};
          this.products = [];
          this.modificator = "";
          this.priceModificationPorcent = 0;
          this.individualPercent = "";
          this.listennerOfListChange = 999999999;
          this.$store.commit("productos/resetStates");
        } else {
          errorAlert("No hay productos seleccionados en la venta");
        }
      } else {
        errorAlert("Debe seleccionar un medio de pago");
      }
    },

    saveSale() {
      const documento = this.object.documento;

      if (documento !== undefined) {
        if (documento.tipo === true) {
          this.save();
        } else {
          this.saveNoFiscal();
        }
      } else {
        errorAlert(
          "Debe seleccionar un cliente, comprobante y medio de pago para realizar la operación"
        );
      }
    },

    cancelSale(){
      this.object = {};
      this.products = [];
      this.modificator = "";
      this.priceModificationPorcent = 0;
      this.individualPercent = "";
      this.listennerOfListChange = 999999999;
      this.$store.commit("productos/resetStates");
    },

    // testcert(){
    //   /* Constants */
    //   const afipAuthorization = this.afipModuleAuthorization;
    //   const sucursal = this.loguedUser.sucursal;
    //   const ptoVenta = this.loguedUser.puntoVenta;
      
    //   //Get authorized voucher number
    //   axios
    //     .get(
    //       `${process.env.VUE_APP_API_AFIP}/rest/api/facturas/obtenerUltimoNumeroAutorizado/${sucursal.razonSocial}/${sucursal.cuit}/${ptoVenta.idFiscal}/006`,
    //       {
    //         headers: afipAuthorization
    //       }
    //     )
    //     .then((data) => {
    //       console.log(data);
    //     });
    // }

    applyChangesInLoguedUserData(){
      const tenant = this.tenant;
      const service = 'usuarios';
      const token = this.token;

      GenericService(tenant, service, token)
      .get(this.loguedUser.id)
      .then(data => {
        data.data.sucursal = this.loguedUser.sucursal;
        data.data.puntoVenta = this.loguedUser.puntoVenta;

        console.log(data);
        GenericService(tenant, service, token)
        .save(data)
        .then(()=>{
          localStorage.setItem("userData", JSON.stringify(this.loguedUser));
          successAlert("Proceso exitoso");
        })
      })
    }
  },
};
</script>