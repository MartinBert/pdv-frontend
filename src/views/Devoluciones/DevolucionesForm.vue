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
                            src="/../../images/icons/delete.svg"
                            @click="deleteLine(p.id, 'entrante')"
                            width="30"
                            height="30"
                          />
                        </button>
                        <button type="button">
                          <img
                            src="/../../images/icons/next.svg"
                            @click="changeStatus(p, 'entrante')"
                            width="30"
                            height="30"
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
                            src="/../../images/icons/delete.svg"
                            @click="deleteLine(p.id, 'saliente')"
                            width="30"
                            height="30"
                          />
                        </button>
                        <button type="button">
                          <img
                            src="/../../images/icons/previous.svg"
                            @click="changeStatus(p, 'saliente')"
                            width="30"
                            height="30"
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
                width="30"
                height="30"
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
import { getCurrentDate, formatDate, getInternationalDate, formatDateWithoutSlash } from "../../helpers/dateHelper";
import { processDetailReceipt } from "../../helpers/processObjectsHelper";
import { successAlert, errorAlert, questionAlert } from "../../helpers/alerts";
import {
  generateBarCode,
  generateFiveDecimalCode,
  restarNumeros
} from "../../helpers/mathHelper";
import { formatFiscalInvoice } from '../../helpers/receiptFormatHelper';
import { addZerosInString } from '../../helpers/stringHelper';
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
    this.getDeposits();
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

    getDeposits(){
      GenericService(this.tenant, 'depositos', this.token)
      .filter({idPerfil: this.loguedUser.perfil, idSucursal: this.loguedUser.sucursal.id, stringParam: '', page: 0, size: 100000})
      .then(data => {
        this.depositos = data.data.content;
        this.defaultDeposit = this.depositos.filter(el => el.defaultDeposit === '1')[0];
      })
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
      /*** Constants ***/
      const sucursal = this.loguedUser.sucursal;
      const ptoVenta = this.loguedUser.puntoVenta;
      const productosEntrantes = this.object.productosEntrantes;
      const productosSalientes = this.object.productosSalientes;
      const documento = this.receiptDialogData.documento;
      const empresa = this.loguedUser.empresa;
      const cliente = this.receiptDialogData.cliente;
      const mediosPago = this.receiptDialogData.mediosPago;
      const planesPago = this.receiptDialogData.planPago;
      const totalVenta = this.receiptDialogData.totalVenta;
      const comprobanteAsociado = this.receiptDialogData.comprobanteAsociado;
      const tenant = this.tenant;
      const token = this.token;
      const service = "ventas";
      const filterParam = {idPerfil: this.loguedUser.perfil, idSucursal: sucursal.id, stringParam: "", thirdStringParam: "", page: 1, size: 100000}
      const comprobanteAsociadoDetalle = [{
        Tipo: comprobanteAsociado.documentoComercial.codigoDocumento,
        PtoVta: comprobanteAsociado.puntoVenta.idFiscal,
        Nro: comprobanteAsociado.numeroCbte
      }];
      const detail = processDetailReceipt(
        documento.codigoDocumento,
        totalVenta
      );

      /*** Mutable vars ***/
      let comprobante;
      let file;
      let fileURL;
      let productos;
      let condVenta;
      let invoice;
      let devolucion = {
        fecha: formatDate(getCurrentDate()),
        descripcion: this.object.descripcion,
        productos: productosEntrantes,
        productosSalientes: productosSalientes,
        empresa: empresa,
        sucursal: sucursal,
      };
  
      /*** Get last invoice emmited number ***/
      axios
      .get(`${process.env.VUE_APP_API_AFIP}/rest_api_afip/obtenerUltimoNumeroAutorizado/${sucursal.cuit}/${ptoVenta.idFiscal}/${documento.codigoDocumento}`)
      .then(data => {
        const numberOfReceipt = parseInt(data.data.responseOfAfip) + 1;
        const dataForCreateInvoice = {
            ptoVentaId: ptoVenta.idFiscal,
            receiptCode: documento.codigoDocumento,
            clientCuit: cliente.cuit,
            numberOfReceipt: numberOfReceipt,
            date: getInternationalDate(),
            products: [detail],
            totalVenta: totalVenta,
            asociatedReceipt: comprobanteAsociadoDetalle
        };

        /*** Format invoice according to type ***/
        invoice = formatFiscalInvoice(documento.letra, dataForCreateInvoice)
      
        /*** Evaluate required sales form data ***/
        if (mediosPago !== undefined) {
          if (productosEntrantes.length > 0) {
            /*** Send invoice to AFIP ***/
              axios
              .post(`${process.env.VUE_APP_API_AFIP}/rest_api_afip/generarComprobante/${sucursal.cuit}`, invoice)
              .then(data => {
                const cae = data.data.CAE;
                const dateOfCaeExpiration = data.data.CAEFchVto;
                const barCode = sucursal.cuit + addZerosInString("02", documento.codigoDocumento) + addZerosInString("04", ptoVenta.idFiscal) + cae + formatDateWithoutSlash(dateOfCaeExpiration);
                
                if(planesPago.cuotas > 1){condVenta = false;}else{condVenta = true;}

                comprobante = {
                  letra: documento.letra,
                  numeroCbte: numberOfReceipt,
                  fechaEmision: formatDate(getCurrentDate()),
                  fechaVto: formatDate(dateOfCaeExpiration),
                  condicionVenta: condVenta,
                  productos: [detail],
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
                
                /*** Save receipt in database ***/
                if (comprobante.cae) {
                  GenericService(tenant, "comprobantesFiscales", token)
                  .save(comprobante)
                  .then((data) => {
                    let comprobanteGenerado = data.data;
                    GenericService(tenant, "stock", token)
                      .filter(filterParam)
                      .then((data) => {
                        productos = data.data.content;
                        console.log(productos);
                        productos.forEach((el) => {
                          productosEntrantes.forEach((e) => {
                            if (el.producto.id === e.id) {
                              el.cantidad =
                                parseInt(el.cantidad) +
                                parseInt(e.cantUnidades);
                              GenericService(tenant, "stock", token).save(el);
                            }
                          });

                          if (productosSalientes.length > 0) {
                            productosSalientes.forEach((e) => {
                              if (el.producto.id === e.id) {
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

                } else {
                  errorAlert("Tipo de comprobante no disponible");
                }
              })
              .catch((err) => {
                console.log('---------------- ERROR IN AFIP RESPONSE ----------------');
                console.log(err);
              })
          } else {
            errorAlert("No hay productos seleccionados en la venta");
          }
        } else {
          errorAlert("Debe seleccionar un medio de pago");
        }
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
      const filterParam = { idPerfil: this.loguedUser.perfil, idSucursal: sucursal.id, stringParam: "", thirdStringParam: "", page: 1, size: 100000 }

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
      const filterParam = { idPerfil: this.loguedUser.perfil, idSucursal: sucursal.id, stringParam: "", thirdStringParam: "", page: 1, size: 10000}

      let productos;
      let devolucion = {
        fecha: formatDate(getCurrentDate()),
        descripcion: this.object.descripcion,
        productos: productosEntrantes,
        productosSalientes: productosSalientes,
        empresa: empresa,
        sucursal: sucursal,
      };

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