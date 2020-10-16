<template>
  <v-container>
    <!-- Body -->
    <v-snackbar
      v-model="snackError"
      :color="'#E53935'"
      :timeout="3000"
      :top="true"
      >{{ errorMessage }}</v-snackbar
    >
    <v-col cols="12">
      <v-row>
        <v-col>
          <v-btn color="primary" @click="getProducts()">BUSCAR PRODUCTO</v-btn>
        </v-col>
      </v-row>
      <div class="horizontalSeparator"></div>
      <v-row>
        <v-col cols="9">
          <v-form ref="form" v-model="valid" :lazy-validation="false">
            <v-row>
              <v-col cols="8">
                <v-row>
                  <v-col cols="6">
                    <v-autocomplete
                      @change="
                        getComercialDocuments(
                          object.cliente.condicionIva.documentos,
                          user.empresa.condicionIva.documentos
                        )
                      "
                      v-model="object.cliente"
                      :items="databaseItems.clientes"
                      item-text="razonSocial"
                      :return-object="true"
                      placeholder="Seleccione un cliente"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="6">
                    <v-autocomplete
                      class="button-ventas comprobante"
                      v-model="object.documento"
                      :items="databaseItems.documentos"
                      item-text="nombre"
                      :return-object="true"
                      :rules="[(v) => !!v || 'Campo requerido...']"
                      placeholder="Seleccione un tipo de comprobante..."
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
                      :rules="[(v) => !!v || 'Campo requerido...']"
                      placeholder="Seleccione un medio de pago..."
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="6">
                    <v-autocomplete
                      class="button-ventas plan-pago"
                      v-model="object.planPago"
                      :items="databaseItems.planes"
                      item-text="nombre"
                      :return-object="true"
                      :rules="[(v) => !!v || 'Campo requerido...']"
                      placeholder="Seleccione un plan de pago..."
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
                        class="totalInput"
                        v-model="totalVenta"
                        type="text"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="text-right">
                      <label class="mr-3">ITEMS:</label>
                      <input class="totalInput" type="text" />
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
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="p in products" :key="p.id">
                        <td>{{ p.nombre }}</td>
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
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="text-right">
                <v-btn class="primary" @click="saveSale(object.documento.tipo)">Finalizar venta</v-btn>
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
              <div class="mt-3">
                <div
                  class="cleanslate w24tz-current-time w24tz-middle"
                  style="
                    display: inline-block !important;
                    visibility: hidden !important;
                    min-width: 300px !important;
                    min-height: 145px !important;
                  "
                >
                  <p>
                    <a
                      href="//24timezones.com/Argentina/hora"
                      style="text-decoration: none"
                      class="clock24"
                      id="tz24-1600967960-cc10022-eyJob3VydHlwZSI6IjI0Iiwic2hvd2RhdGUiOiIxIiwic2hvd3NlY29uZHMiOiIxIiwiY29udGFpbmVyX2lkIjoiY2xvY2tfYmxvY2tfY2I1ZjZjZDUxOGU0MTE2IiwidHlwZSI6ImRiIiwibGFuZyI6ImVzIn0="
                      title="Hora Mundial - Argentina"
                      target="_blank"
                      rel="nofollow"
                      >Hora actual en Argentina</a
                    >
                  </p>
                  <div id="clock_block_cb5f6cd518e4116"></div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <!-- End Body -->

    <!-- Dialog -->
    <v-dialog v-model="dialog" scrollable max-width="700px">
      <v-card>
        <v-card-title
          >Seleccione un parámetro para realizar la búsqueda</v-card-title
        >
        <v-radio-group class="ml-5 mr-5" v-model="radioGroup">
          <v-row>
            <v-col>
              <v-radio label="Nombre" value="nombre"></v-radio>
            </v-col>
            <v-col>
              <v-radio
                label="Código de barras"
                value="codigodebarras"
              ></v-radio>
            </v-col>
            <v-col>
              <v-radio
                label="Código de producto"
                value="codigodeproducto"
              ></v-radio>
            </v-col>
          </v-row>
        </v-radio-group>
        <v-text-field
          v-if="radioGroup"
          v-model="filterString"
          v-on:input="filterObjects(filterString, radioGroup)"
          dense
          outlined
          rounded
          class="text-left ml-5 mr-5"
          placeholder="Búsqueda"
          append-icon="mdi-magnify"
        ></v-text-field>
        <v-divider></v-divider>
        <v-card-text style="height: 300px">
          <v-container fluid>
            <v-row>
              <v-col>
                <v-simple-table style="background-color: transparent">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th>Elegir</th>
                        <th>Producto</th>
                        <th>Código de barras</th>
                        <th>Código de producto</th>
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
                        <td>{{ producto.codigoBarra }}</td>
                        <td>{{ producto.codigoProducto }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End Dialog -->
  </v-container>
</template>

<script>
import GenericService from "../../services/GenericService";
import VentasService from "../../services/VentasService";
import Calculator from "../../components/Calculator";
import { formatDate, getCurrentDate } from "../../helpers/dateHelper";
import {
  calculateAlicIvaBaseImpVentas,
  calculateAlicIvaImporteVentas,
  generateBarCode
} from "../../helpers/mathHelper";
import axios from "axios";
import ReportsService from "../../services/ReportsService";
import StocksService from '../../services/StocksService';
import DepositosService from '../../services/DepositosService';


export default {
  data: () => ({
    user: "",
    fecha: getCurrentDate(),
    valid: true,
    barcode: "",
    page: 0,
    size: 1000,
    object: {},
    databaseItems: {
      clientes: [],
      medios_de_pago: [],
      empresa: [],
    },
    productos: [],
    products: [],
    depositos: [],
    tenant: "",
    service: "ventas",
    token: localStorage.getItem("token"),
    snackError: false,
    errorMessage: "",
    dialog: false,
    filterString: "",
    radioGroup: "",
    afipModuleAuthorization: {}
  }),

  components: {
    Calculator,
  },

  created() {
    this.$barcodeScanner.init(this.onBarcodeScanned);
  },

  computed: {
    totalVenta() {
      var tot = 0;
      this.products.forEach((el) => {
        tot += parseFloat(el.precioTotal);
      });
      return tot;
    },
  },

  mounted() {
    this.tenant = this.$route.params.tenant;

    GenericService(this.tenant, "clientes", this.token)
      .getAll(this.page, this.size)
      .then(data => {
        this.databaseItems.clientes = data.data.content;
      });

    GenericService(this.tenant, "mediosPago", this.token)
      .getAll(this.page, this.size)
      .then(data => {
        this.databaseItems.medios_de_pago = data.data.content;
      });

    GenericService(this.tenant, "empresas", this.token)
      .getAll(this.page, this.size)
      .then(data => {
        this.databaseItems.empresa = data.data.content;
      });

    VentasService(this.tenant, this.service, this.token)
      .getUser()
      .then(data => {
        this.user = data.data;
      });

    VentasService(this.tenant, this.service, this.token)
      .getAfipModuleAuthorization()
      .then(data => {
        this.afipModuleAuthorization = data.data
      });
  },

  methods: {
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
      VentasService(this.tenant, "productos", this.token)
        .getForBarCode(barcode)
        .then((data) => {
          if (this.products.length == 0) {
            data.data.cantUnidades = 1;
            data.data.total = data.data.precioTotal;
            this.products.push(this.processProductsObject(data.data));
          } else {
            var count = 0;
            for (var i = 0; i < this.products.length; i++) {
              if (this.products[i].id == data.data.id) {
                this.products[i].cantUnidades =
                  parseInt(this.products[i].cantUnidades) + 1;
                this.products[i].precioTotal =
                  this.products[i].precioUnitario *
                  this.products[i].cantUnidades;
                break;
              } else if (
                this.products[i].id != data.data.id &&
                count == this.products.length - 1
              ) {
                data.data.cantUnidades = 1;
                data.data.total = data.data.precioTotal;
                this.products.push(this.processProductsObject(data.data));
                break;
              } else {
                count += 1;
              }
            }
          }
        })
        .catch((error) => {
          if (error.response.status == 500) {
            this.snackError = true;
            this.errorMessage = "Ocurrio un error";
          }
        });
    },

    updateTotal(id) {
      this.products.forEach((el) => {
        if (el.id == id) {
          el.precioTotal = 0;
          el.precioTotal = parseFloat(el.precioUnitario) * el.cantUnidades;
        }
      });
    },

    getComercialDocuments(clientCond, businessCond) {
      this.databaseItems.documentos = [];
      for (var i = 0; i < clientCond.length; i++) {
        businessCond.forEach((el) => {
          if (clientCond[i].id == el.id) {
            this.databaseItems.documentos.push(el);
          }
        });
      }
    },

    getPaymentPlans(id) {
      this.databaseItems.planes = id.planPago;
    },

    getProducts() {
      this.dialog = !this.dialog;
      GenericService(this.tenant, "productos", this.token)
        .getAll(this.page, this.size)
        .then((data) => {
          this.productos = data.data.content;
        });
    },

    filterObjects(filter, radio) {
      var filt = {};
      switch (radio) {
        case "nombre":
          filt = { nombre: filter };
          break;
        case "codigodebarras":
          filt = { codigoBarra: filter };
          break;
        default:
          filt = { codigoProducto: filter };
          break;
      }

      GenericService(this.tenant, "productos", this.token)
        .filter(filt)
        .then((data) => {
          this.productos = data.data.content;
        });
    },

    checkProduct(id) {
      const productosFiltrados = this.productos.filter((el) => el.id === id)[0];
      if (productosFiltrados.selected) {
        productosFiltrados.cantUnidades = 1;
        productosFiltrados.total = productosFiltrados.precioTotal;
        this.products.push(this.processProductsObject(productosFiltrados));
      } else {
        const object = this.products.filter(
          (el) => el.id !== productosFiltrados.id
        );
        this.products = object;
      }
    },

    save() {
      let idSucursal = this.user.sucursal.id;
      DepositosService(this.tenant, "depositos", this.token)
      .getDepositosForSucursal(idSucursal)
      .then(data => {
        this.depositos = data.data.content;  
      })

      var tipoDoc;
      if (this.object.documento.ivaCat == 1) {
        tipoDoc = 80;
      } else {
        tipoDoc = 94;
      }

      var cuit = this.user.sucursal.cuit;
      var razonSocial = this.user.sucursal.razonSocial;
      var ptoVenta = this.user.puntoVenta.idFiscal;

      var alicIva = {
        baseImp: 0,
        id: 5,
        importe: 0,
      };
      if (
        this.object.documento.ivaCat == 2 ||
        this.object.documento.ivaCat == 1
      ) {
        var impNeto;
        alicIva.baseImp = calculateAlicIvaBaseImpVentas(this.totalVenta);
        alicIva.importe = calculateAlicIvaImporteVentas(
          this.totalVenta,
          alicIva.baseImp
        );
        impNeto = alicIva.baseImp;
      } else {
        alicIva = [];
      }

      //Instance body from AFIP ws-services
      var body = {
        alicIva: [alicIva],
        asociados: [],
        cbteTipo: this.object.documento.codigoDocumento,
        concepto: 1,
        cotizMoneda: 1,
        cuit: cuit,
        fecha: this.fecha,
        fechaServicioHasta: this.fecha,
        fechaServicioVenc: this.fecha,
        fechaServiciodesde: this.fecha,
        fechaVencimientoPago: "0",
        idMoneda: "PES",
        impNeto: impNeto,
        name: razonSocial,
        nroDesde: "",
        nroDoc: this.object.cliente.cuit,
        nroHasta: "",
        opcionales: [],
        ptoVenta: ptoVenta,
        tipoDoc: tipoDoc,
        tributos: [],
      };

      //Get authorized voucher number
      axios
        .get(
          `${process.env.VUE_APP_API_AFIP}/rest/api/facturas/obtenerUltimoNumeroAutorizado/${razonSocial}/${cuit}/${ptoVenta}/${body.cbteTipo}`,
          {
            headers: this.afipModuleAuthorization
          }
        )
        .then((data) => {
          // Assign nroDesde & nroHasta
          body.nroDesde = data.data + 1;
          body.nroHasta = body.nroDesde;

          //Post data & recive CAE from AFIP
          axios
            .post(
              `${process.env.VUE_APP_API_AFIP}/rest/api/facturas/generarComprobante/${razonSocial}`,
              body,
              {
                headers: this.afipModuleAuthorization
              }
            )
            .then((data) => {
              var respCabAfip = data.data.feCabResp;
              var respDetAfip = data.data.feDetResp;

              var comprobante = {
                letra: this.object.documento.letra,
                numeroCbte: body.nroDesde,
                fechaEmision: respCabAfip.fchProceso,
                fechaVto: respDetAfip[0].caefchVto,
                condicionVenta: true,
                productos: this.products,
                barCode: respDetAfip[0].barcode,
                cae: respDetAfip[0].cae,
                puntoVenta: this.user.puntoVenta,
                sucursal: this.user.sucursal,
                documentoComercial: this.object.documento,
                empresa: this.user.empresa,
                cliente: this.object.cliente,
              };

              GenericService(
                this.tenant,
                "comprobantesFiscales",
                this.token
              ).save(comprobante);

              comprobante.fechaEmision = formatDate(comprobante.fechaEmision);
              comprobante.fechaVto = formatDate(comprobante.fechaVto);

              ReportsService(this.tenant, this.service, this.token)
                .onCloseSaleReport(comprobante)
                .then((res) => {
                  var file = new Blob([res["data"]], {
                    type: "application/pdf",
                  });
                  var fileURL = URL.createObjectURL(file);
                  window.open(fileURL, "_blank");
                });
              let sucursalId = {
                sucursal: {
                  id: this.user.sucursal.id
                }
              }
              StocksService(this.tenant, "stock", this.token)
                .getForSucursal(sucursalId)
                .then(data => {
                  const productos = data.data.content;
                  productos.forEach(el => {
                    comprobante.productos.forEach(e => {
                      if(el.producto.id === e.id && el.deposito.id == this.depositos[0].id){
                        el.cantidad = parseInt(el.cantidad) - parseInt(e.cantUnidades);
                        GenericService(this.tenant, "stock", this.token)
                        .save(el);
                      }
                    })
                  })
                });
            });
        });
    },

    saveNoFiscal(){
      let idSucursal = this.user.sucursal.id;
      DepositosService(this.tenant, "depositos", this.token)
      .getDepositosForSucursal(idSucursal)
      .then(data => {
        this.depositos = data.data.content;  
      })

      var comprobante = {
        letra: "X",
        numeroCbte: 0,
        fechaEmision: formatDate(this.fecha),
        fechaVto: formatDate(this.fecha),
        condicionVenta: true,
        productos: this.products,
        barCode: generateBarCode(),
        cae: "",
        puntoVenta: this.user.puntoVenta,
        sucursal: this.user.sucursal,
        documentoComercial: this.object.documento,
        empresa: this.user.empresa,
        cliente: this.object.cliente,
      };

      GenericService(this.tenant, "comprobantesFiscales",this.token).save(comprobante);

      ReportsService(this.tenant, this.service, this.token)
        .onCloseSaleReport(comprobante)
        .then((res) => {
          var file = new Blob([res["data"]], {
            type: "application/pdf",
          });
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL, "_blank");
        });
      let sucursalId = {
        sucursal: {
          id: this.user.sucursal.id
        }
      }
      StocksService(this.tenant, "stock", this.token)
        .getForSucursal(sucursalId)
        .then(data => {
          const productos = data.data.content;
          productos.forEach(el => {
            comprobante.productos.forEach(e => {
              if(el.producto.id === e.id && el.deposito.id == this.depositos[0].id){
                el.cantidad = parseInt(el.cantidad) - parseInt(e.cantUnidades);
                GenericService(this.tenant, "stock", this.token)
                .save(el);
              }
            })
          })
        });
    },

    saveSale(bool){
      if(bool === true){
        this.save();
      }else{
        this.saveNoFiscal();
      }
    }
  },
};
</script>
<style scoped>
.button_cliente_class {
  background-image: url("/images/buttons/btn_cliente.svg");
  width: 100%;
  height: 100%;
}

.verticalSeparator {
  float: left;
  background-color: black;
  height: 100%;
  width: 2px;
}

.totalInput {
  font-family: Century Gothic, CenturyGothic, AppleGothic, sans-serif;
  border: solid 1px rgb(63, 81, 181);
  background-color: #fff;
  color: black;
  text-align: right;
  padding: 5px;
}

.horizontalSeparator {
  width: 100%;
  height: 2px;
  margin-right: 10px;
  background-color: black;
}
</style>