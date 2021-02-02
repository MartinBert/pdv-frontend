`<template>
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
              >AGREGAR PRODUCTOS</v-btn
            >
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
                    <th class="text-left">Precio</th>
                    <th class="text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="p in object.productosEntrantes" :key="p.id">
                    <td>{{ p.nombre }}</td>
                    <td>
                      <input type="number" v-model="p.cantUnidades" />
                    </td>
                    <td>${{p.precioTotal}}</td>
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
          <v-col class="d-flex justify-center"
            ><div class="verticalSeparator"></div
          ></v-col>
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
                    <th class="text-left">Precio</th>
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
                    <td>${{p.precioTotal}}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="ml-5 mr-5">
            <v-text-field
              required
              placeholder="Ingrese una descripción de la operación"
              v-model="object.descripcion"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8" class="d-flex justify-center">
            <v-btn
              class="mr-4"
              color="primary"
              @click="$store.commit('receipt/receiptDialogMutation')"
              :disabled="!valid"
              v-if="!receiptDialogData"
              >AGREGAR COMPROBANTE</v-btn
            >
            <v-btn
              v-if="receiptDialogData"
              icon
              @click="$store.commit('receipt/receiptDialogMutation')"
              ><img
                src="/../../images/icons/success.svg"
                width="40"
                height="40"
            /></v-btn>
          </v-col>
          <v-col cols="4">
              <div class="flex-column" style="color: grey" v-if="montoRecomendado >= 0">Monto recomendado: ${{montoRecomendado}}</div>
              <div class="flex-column" style="color: grey" v-if="montoRecomendado < 0">Monto recomendado: ${{(montoRecomendado * (-1))}}</div>
              <div class="flex-column" style="color: grey" v-if="montoRecomendado >= 0">Nota de crédito</div>
              <div class="flex-column" style="color: grey" v-if="montoRecomendado < 0">Nota de débito</div>
          </v-col>
        </v-row>
        <v-row class="ml-3 mr-3 mb-5">
          <v-col class="col-6">
            <v-btn
              class="mr-4"
              color="primary"
              @click="save()"
              :disabled="!valid"
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

    <!-- Dialog Components -->
    <ProductDialog v-on:productList="addProduct" v-on:resetListStatus="resetListOfDialog" :refreshListStatus="listennerOfListChange"/>
    <ReceiptDialog
      v-on:receipt="receiptDialogData = $store.state.receipt.receipt"
    />
  </v-card>
</template>

<script>
import axios from "axios";
import GenericService from "../../services/GenericService";
import ReportsService from "../../services/ReportsService";
import VentasService from "../../services/VentasService";
import { getCurrentDate, formatDate } from "../../helpers/dateHelper";
import { processDetailReceipt } from "../../helpers/processObjectsHelper";
import { successAlert, errorAlert, questionAlert } from "../../helpers/alerts";
import {
  calculateAlicIvaBaseImpVentas,
  calculateAlicIvaImporteVentas,
  generateBarCode,
  generateFiveDecimalCode,
  restarNumeros
} from "../../helpers/mathHelper";
import ProductDialog from "../../components/ProductDialog";
import ReceiptDialog from "../../components/ReceiptDialog";

export default {
  data: () => ({
    tiposOperacion: [
      { id: 1, text: "Devolución" },
      { id: 2, text: "Cambio de artículo" },
    ],
    tipoOperacion: null,
    productos: [],
    depositos: [],
    defaultDeposit: {},
    object: {
      fecha: getCurrentDate(),
      productosEntrantes: [],
      productosSalientes: [],
      descripcion: "",
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
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    radioGroup: "",
    filterString: "",
    checked: false,
    saveDialog: false,
    receiptDialogData: null,
    listennerOfListChange: 0
  }),

  components: {
    ProductDialog,
    ReceiptDialog,
  },

  computed: {
    montoRecomendado(){
      if(this.object.productosEntrantes || this.object.productosSalientes){
        const receivedProducts = this.object.productosEntrantes.reduce((acc, el) => acc + Number(el.precioTotal), 0);
        const cededProducts = this.object.productosSalientes.reduce((acc, el) => acc + Number(el.precioTotal), 0);
  
        return restarNumeros([receivedProducts, cededProducts]);
      }else{
        return 0;
      }
    }
  },

  mounted() {
    this.$store.commit("receipt/resetStates");
    this.tenant = this.$route.params.tenant;
    if (this.$route.params.id && this.$route.params.id > 0) {
      this.getObject(this.$route.params.id);
    } else {
      this.loaded = true;
    }
    this.getAfipAuthorization();
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

    getAfipAuthorization() {
      VentasService(this.tenant, "ventas", this.token)
      .getAfipModuleAuthorization()
      .then((data) => {
        this.afipModuleAuthorization = data.data;
      });
    },

    deleteLine(id, status) {
      if (status === "entrante") {
        const filter = this.object.productosEntrantes.filter(
          (el) => el.id !== id
        );
        this.object.productosEntrantes = filter;
        this.listennerOfListChange = id;
        this.$store.commit('productos/removeProductsToList', id);
      } else {
        const filter = this.object.productosSalientes.filter(
          (el) => el.id !== id
        );
        this.object.productosSalientes = filter;
        this.listennerOfListChange = id;
        this.$store.commit('productos/removeProductsToList', id);
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
      data.forEach((el) => {
        this.object.productosEntrantes = this.object.productosEntrantes.filter(
          (e) => e.id !== el.id
        );
        this.object.productosEntrantes.push(el);
      });

      this.object.productosEntrantes = [
        ...new Set(this.object.productosEntrantes),
      ];

      this.object.productosSalientes.filter(el => {
        this.object.productosEntrantes = this.object.productosEntrantes.filter(e => e.id !== el.id);
      });
    },

    resetListOfDialog(){
      this.listennerOfListChange = 0;
    },

    save() {
      if (this.object.productosEntrantes.length === 0) {
        errorAlert("Debe seleccionar al menos un producto devuelto");
      } else {
        if (!this.receiptDialogData) {
          questionAlert(
            "Atención, no agregó un comprobante",
            "Desea continuar de todos modos"
          ).then((result) => {
            if (result.isConfirmed) {
              this.saveWithoutReceipt();
            } else {
              this.$store.commit("receipt/receiptDialogMutation");
            }
          });
        } else {
          if (this.receiptDialogData.documento.tipo === true) {
            this.processAndSaveFiscal();
          } else {
            this.processAndSaveNoFiscal();
          }
        }
      }
    },

    back() {
      this.$router.push({ name: "devoluciones" });
    },

    changeStatus(product, status) {
      if (status === "entrante") {
        this.object.productosEntrantes = this.object.productosEntrantes.filter(
          (el) => el.id !== product.id
        );
        this.object.productosSalientes.push(product);
      } else {
        this.object.productosSalientes = this.object.productosSalientes.filter(
          (el) => el.id !== product.id
        );
        this.object.productosEntrantes.push(product);
      }
    },

    processAndSaveFiscal() {
      /* Constants */
      const sucursal = this.loguedUser.sucursal;
      const ptoVenta = this.loguedUser.puntoVenta;
      const documento = this.receiptDialogData.documento;
      const productosEntrantes = this.object.productosEntrantes;
      const productosSalientes = this.object.productosSalientes;
      const empresa = this.loguedUser.empresa;
      const cliente = this.receiptDialogData.cliente;
      const mediosPago = this.receiptDialogData.mediosPago;
      const planesPago = this.receiptDialogData.planPago;
      const fecha = getCurrentDate();
      const totalVenta = this.receiptDialogData.totalVenta;
      const tenant = this.tenant;
      const token = this.token;
      const service = "ventas";
      const afipAuthorization = this.afipModuleAuthorization;
      const comprobanteAsociado = this.receiptDialogData.comprobanteAsociado;
      const detail = processDetailReceipt(
        documento.codigoDocumento,
        totalVenta
      );
      const filterParam = { idPerfil: this.loguedUser.perfil, idSucursal: sucursal.id, stringParam: "", page: 0, size: 100000 }

      const comprobanteAsociadoDetalle = {
        nro: comprobanteAsociado.numeroCbte,
        ptoVta: comprobanteAsociado.puntoVenta.idFiscal,
        tipo: documento.codigoDocumento,
      };

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
      let devolucion = {
        fecha: formatDate(fecha),
        descripcion: this.object.descripcion,
        productos: productosEntrantes,
        productosSalientes: productosSalientes,
        empresa: empresa,
        sucursal: sucursal,
      };

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

      GenericService(tenant, "depositos", token)
        .filter(filterParam)
        .then((data) => {
          this.depositos = data.data.content;
          this.defaultDeposit = data.data.content.filter(el => el.defaultDeposit === '1')[0];
        });

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
        asociados: [comprobanteAsociadoDetalle],
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
                productos: [detail],
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
                GenericService(tenant, "comprobantesFiscales", token)
                  .save(comprobante)
                  .then((data) => {
                    let comprobanteGenerado = data.data;

                    GenericService(tenant, "stock", token)
                      .filter(filterParam)
                      .then((data) => {
                        productos = data.data.content;
                        productos.forEach((el) => {
                          productosEntrantes.forEach((e) => {
                            if (
                              el.producto.id === e.id &&
                              el.deposito.id == this.defaultDeposit.id
                            ) {
                              el.cantidad =
                                parseInt(el.cantidad) +
                                parseInt(e.cantUnidades);
                              GenericService(tenant, "stock", token).save(el);
                            }
                          });

                          if (productosSalientes.length > 0) {
                            productosSalientes.forEach((e) => {
                              if (
                                el.producto.id === e.id &&
                                el.deposito.id == this.defaultDeposit.id
                              ) {
                                el.cantidad =
                                  parseInt(el.cantidad) -
                                  parseInt(e.cantUnidades);
                                GenericService(tenant, "stock", token).save(el);
                              }
                            });
                          }
                        });
                      })
                      .then(() => {
                        devolucion.comprobante = comprobanteGenerado;
                        devolucion.totalDevolucion =
                          comprobanteGenerado.totalVenta;
                        GenericService(tenant, this.service, token).save(
                          devolucion
                        );
                      })
                      .then(() => {
                        successAlert("Devolución realizada").then((result) => {
                          if (result.dismiss) {
                            this.$router.push({ name: "devoluciones" });
                          }
                        });
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
                  });

                this.object = {};
                this.$store.commit("productos/resetStates");
              } else {
                if (detalleAfip[0].observaciones) {
                  errorAlert(detalleAfip[0].observaciones[0].msg);
                } else {
                  errorAlert("Tipo de comprobante no disponible");
                }
              }
            });
        });
    },

    processAndSaveNoFiscal() {
      /* Constants */
      const mediosPago = this.receiptDialogData.mediosPago;
      const planesPago = this.receiptDialogData.planPago;
      const totalVenta = this.receiptDialogData.totalVenta;
      const cliente = this.receiptDialogData.cliente;
      const empresa = this.loguedUser.empresa;
      const documento = this.receiptDialogData.documento;
      const sucursal = this.loguedUser.sucursal;
      const ptoVenta = this.loguedUser.puntoVenta;
      const productosEntrantes = this.object.productosEntrantes;
      const productosSalientes = this.object.productosSalientes;
      const tenant = this.tenant;
      const token = this.token;
      const service = "ventas";
      const fecha = getCurrentDate();
      const detail = processDetailReceipt(
        documento.codigoDocumento,
        totalVenta
      );
      const filterParam = { idPerfil: this.loguedUser.perfil, idSucursal: sucursal.id, stringParam: "", page: 0, size: 100000 }

      /* Mutable vars */
      let file;
      let fileURL;
      let productos;
      let comprobante;
      let condVenta;
      let devolucion = {
        fecha: formatDate(fecha),
        descripcion: this.object.descripcion,
        productos: productosEntrantes,
        productosSalientes: productosSalientes,
        empresa: empresa,
        sucursal: sucursal,
      };

      GenericService(tenant, "depositos", token)
        .filter(filterParam)
        .then((data) => {
          this.depositos = data.data.content;
          this.defaultDeposit = data.data.content.filter(el => el.defaultDeposit === '1')[0];
        });

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
        letra: documento.letra,
        numeroCbte: generateFiveDecimalCode(),
        fechaEmision: formatDate(fecha),
        fechaVto: formatDate(fecha),
        condicionVenta: condVenta,
        productos: [detail],
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

      GenericService(tenant, "comprobantesFiscales", token)
        .save(comprobante)
        .then((data) => {
          let comprobanteGenerado = data.data;

          GenericService(tenant, "stock", token)
            .filter(filterParam)
            .then((data) => {
              productos = data.data.content;
              productos.forEach((el) => {
                productosEntrantes.forEach((e) => {
                  if (
                    el.producto.id === e.id &&
                    el.deposito.id == this.defaultDeposit.id
                  ) {
                    el.cantidad =
                      parseInt(el.cantidad) + parseInt(e.cantUnidades);
                    GenericService(tenant, "stock", token).save(el);
                  }
                });

                if (productosSalientes.length > 0) {
                  productosSalientes.forEach((e) => {
                    if (
                      el.producto.id === e.id &&
                      el.deposito.id == this.defaultDeposit.id
                    ) {
                      el.cantidad =
                        parseInt(el.cantidad) - parseInt(e.cantUnidades);
                      GenericService(tenant, "stock", token).save(el);
                    }
                  });
                }
              });
            })
            .then(() => {
              devolucion.comprobante = comprobanteGenerado;
              devolucion.totalDevolucion = comprobanteGenerado.totalVenta;
              GenericService(tenant, this.service, token).save(devolucion);
            })
            .then(() => {
              successAlert("Devolución realizada").then((result) => {
                if (result.dismiss) {
                  this.$router.push({ name: "devoluciones" });
                }
              });
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
        });

      this.object = {};
      this.$store.commit("productos/resetStates");
    },

    saveWithoutReceipt() {
      const sucursal = this.loguedUser.sucursal;
      const empresa = this.loguedUser.empresa;
      const productosEntrantes = this.object.productosEntrantes;
      const productosSalientes = this.object.productosSalientes;
      const tenant = this.tenant;
      const token = this.token;
      const filterParam = { idPerfil: this.loguedUser.perfil, idSucursal: sucursal.id, stringParam: "", page: 0, size: 10000}

      let productos;
      let devolucion = {
        fecha: formatDate(getCurrentDate()),
        descripcion: this.object.descripcion,
        productos: productosEntrantes,
        productosSalientes: productosSalientes,
        empresa: empresa,
        sucursal: sucursal,
      };

      GenericService(tenant, "depositos", token)
        .filter(filterParam)
        .then((data) => {
          this.depositos = data.data.content;
          this.defaultDeposit = data.data.content.filter(el => el.defaultDeposit === '1')[0];
        });

      GenericService(tenant, "stock", token)
        .filter(filterParam)
        .then((data) => {
          productos = data.data.content;
          productos.forEach((el) => {
            productosEntrantes.forEach((e) => {
              if (
                el.producto.id === e.id &&
                el.deposito.id == this.defaultDeposit.id
              ) {
                el.cantidad = parseInt(el.cantidad) + parseInt(e.cantUnidades);
                GenericService(tenant, "stock", token).save(el);
              }
            });

            if (productosSalientes.length > 0) {
              productosSalientes.forEach((e) => {
                if (
                  el.producto.id === e.id &&
                  el.deposito.id == this.defaultDeposit.id
                ) {
                  el.cantidad =
                    parseInt(el.cantidad) - parseInt(e.cantUnidades);
                  GenericService(tenant, "stock", token).save(el);
                }
              });
            }
          });
        })
        .then(() => {
          GenericService(tenant, this.service, token).save(devolucion);
        })
        .then(() => {
          successAlert("Devolución realizada").then((result) => {
            if (result.dismiss) {
              this.$router.push({ name: "devoluciones" });
            }
          });
        });
    },
  },
};
</script>