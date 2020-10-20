<template>
  <v-container>

    <!-- Body -->
    <v-col cols="12">
      <v-row>
        <v-col cols="3">
          <v-btn color="primary" @click="$store.commit('ventas/dialogProductosMutation')">BUSCAR PRODUCTO</v-btn>
        </v-col>
        <v-col cols="3"></v-col>
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
          <v-btn class="success ml-3" @click="applyModification(modificator, priceModificationPorcent)">Aplicar<v-icon>mdi-check-bold</v-icon></v-btn>
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
                      placeholder="Seleccione un tipo de comprobante"
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
                      placeholder="Seleccione un medio de pago"
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
                        <td @click="applyIndividualPercent(p)" style="cursor:pointer">{{ p.nombre }}</td>
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
                        <td><button type="button"><img src="/../../images/icons/ico_11.svg" @click="deleteLine(p.id)" width="40" height="40"/></button></td>
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

    <!-- Add products dialog -->
    <ProductDialog v-on:productList="addProduct"/>

    <!-- Individual percent dialog -->
    <v-dialog
      v-model="dialogIndividualPercent"
      width="500"
    >
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
          <v-btn class="success ml-3" @click="applyToLine(individualPercent)">Aplicar<v-icon>mdi-check-bold</v-icon></v-btn>
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
import {
  calculateAlicIvaBaseImpVentas,
  calculateAlicIvaImporteVentas,
  generateBarCode,
  calculatePercentaje,
  sumarNumeros
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
    afipModuleAuthorization: {},
    modificator: "",
    priceModificationPorcent: 0,
    dialogIndividualPercent: false,
    renglon: {},
    individualPercent: "" 
  }),

  components: {
    Calculator,
    ProductDialog
  },

  created() {
    this.$barcodeScanner.init(this.onBarcodeScanned);
  },

  computed: {
    totalVenta(){
      let tot = 0;
      let porcentajePlan = 0;
      if(this.object.planPago){
        porcentajePlan = this.object.planPago.porcentaje
      }
      this.products.forEach((el) => {
        tot = this.acumularRecargo(porcentajePlan, el.precioTotal, tot);
      });
      return parseFloat(tot).toFixed(2);
    },

    totalItems(){
      let totItems = 0
      this.products.forEach(el => {
        totItems = sumarNumeros([totItems, el.cantUnidades])
      })
      return totItems
    }
  },
  
  mounted() {
    this.$store.commit('ventas/resetStates');
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

    deleteLine(id){
      const filter = this.products.filter(el => el.id !== id);
      this.products = filter;
    },

    applyModification(modificator, priceModificationPorcent){
      const percent = calculatePercentaje(this.totalVenta, priceModificationPorcent);
      if(modificator === "descuento"){
        let obj = {
          nombre: "DESCUENTO",
          codigoBarra: 1111111111,
          cantUnidades: 0,
          precioUnitario: -percent,
          precioTotal: -percent,
        }
        this.products.push(obj);
      }else{
        let obj = {
          nombre: "RECARGO",
          codigoBarra: 2222222222,
          cantUnidades: 0,
          precioUnitario: percent,
          precioTotal: percent,
        }
        this.products.push(obj);
      }
    },

    applyIndividualPercent(p){
      this.dialogIndividualPercent = true;
      this.renglon = p;
    },

    addProduct(data){
      let processObjects = [];
      data.forEach(el => {
        processObjects.push(this.processProductsObject(el));
      })
      this.products = processObjects;
    },

    acumularRecargo(porcentaje, precioProducto, acumulado){
      let cleanPorcent = parseFloat(porcentaje / 100).toFixed(2);
      let impPorcent = (precioProducto * cleanPorcent).toFixed(2);
      let total = sumarNumeros([Number(acumulado), Number(precioProducto), Number(impPorcent)]);

      return total;
    },

    applyToLine(percent){
      const type = percent.search("-");
      let object = {}
      if(type === 0){
        object = {
          nombre: "DESCUENTO EN RENGLÓN "+this.renglon.id,
          codigoBarra: 3333333333,
          cantUnidades: 0,
          precioUnitario: -calculatePercentaje(this.renglon.precioTotal, percent),
          precioTotal: -calculatePercentaje(this.renglon.precioTotal, percent),
        }
      }else{
        object = {
          nombre: "RECARGO EN RENGLÓN "+this.renglon.id,
          codigoBarra: 4444444444,
          cantUnidades: 0,
          precioUnitario: calculatePercentaje(this.renglon.precioTotal, percent),
          precioTotal: calculatePercentaje(this.renglon.precioTotal, percent),
        }
      }
      
      this.products.push(object);
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
                totalVenta: this.totalVenta,
                mediosPago: [this.object.mediosPago],
                planesPago: [this.object.planPago]
              };

              GenericService(
                this.tenant,
                "comprobantesFiscales",
                this.token
              ).save(comprobante);

              comprobante.fechaEmision = formatDate(comprobante.fechaEmision);
              comprobante.fechaVto = formatDate(comprobante.fechaVto);

              ReportsService(this.tenant, this.service, this.token)
                .onCloseSaleReport(comprobante, this.totalVenta)
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
        totalVenta: this.totalVenta,
        mediosPago: this.object.mediosPago
      };

      GenericService(this.tenant, "comprobantesFiscales",this.token).save(comprobante);

      ReportsService(this.tenant, this.service, this.token)
        .onCloseSaleReport(comprobante, this.totalVenta)
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

.select-ventas-import{
    font-family: Century Gothic, CenturyGothic, AppleGothic, sans-serif;
    font-weight: bold;
    font-style: italic;
    border-bottom: solid 1px rgb(63, 81, 181);
    color: rgb(172, 171, 171);
    text-align: right;
    padding: 5px 10px 5px 10px;
}

.horizontalSeparator {
  width: 100%;
  height: 2px;
  margin-right: 10px;
  background-color: black;
}
</style>