<template>
  <v-container>
    <!-- Body -->
    <v-snackbar v-model="snackError" :color="'#E53935'" :timeout="3000" :top="true">{{errorMessage}}</v-snackbar>
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
                      @change="getComercialDocuments(object.cliente.condicionIva.documentos, user.empresa.condicionIva.documentos)"
                      v-model="object.cliente"
                      :items="objects.clientes"
                      item-text="razonSocial"
                      :return-object="true"
                      placeholder="Seleccione un cliente"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                      <v-autocomplete
                        class="button-ventas comprobante"
                        v-model="object.documento"
                        :items="objects.documentos"
                        item-text="nombre"
                        :return-object="true"
                        :rules="[v => !!v || 'Campo requerido...']"
                        placeholder="Seleccione un tipo de comprobante..."
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                      <v-autocomplete
                        class="button-ventas medio-pago"
                        @change="getPaymentPlans(object.mediosPago)"
                        v-model="object.mediosPago"
                        :items="objects.medios_de_pago"
                        item-text="nombre"
                        :return-object="true"
                        :rules="[v => !!v || 'Campo requerido...']"
                        placeholder="Seleccione un medio de pago..."
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                      <v-autocomplete
                        class="button-ventas plan-pago"
                        v-model="object.planPago"
                        :items="objects.planes"
                        item-text="nombre"
                        :return-object="true"
                        :rules="[v => !!v || 'Campo requerido...']"
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
                        <input class="totalInput" v-model="totalVenta" type="text">
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col class="text-right">
                        <label class="mr-3">ITEMS:</label>
                        <input class="totalInput" type="text">
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
              </v-row>
              <v-row>
                <div class="horizontalSeparator"></div>
                <v-col cols="12">
                    <v-simple-table style="background-color: transparent;">
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left">Producto</th>
                            <th class="text-left">Codigo de barras</th>
                            <th class="text-left">Cantidad</th>
                            <th class="text-left">Precion unitario</th>
                            <th class="text-left">Precion total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="p in products" :key="p.id">
                            <td>{{ p.nombre }}</td>
                            <td>{{ p.codigoBarra }}</td>
                            <td>
                              <input type="number" @input="updateTotal(p.id)" v-model="p.cant" />
                            </td>
                            <td>${{ p.precioTotal }}</td>
                            <td>${{ p.total }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="text-right">
                  <v-btn class="primary" @click="save()">Finalizar venta</v-btn>
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
                <Calculator/>
                <div class="mt-3">
                  <div class="cleanslate w24tz-current-time w24tz-middle" style="display: inline-block !important; visibility: hidden !important; min-width:300px !important; min-height:145px !important;">
                    <p>
                    <a href="//24timezones.com/Argentina/hora" style="text-decoration: none;" class="clock24" id="tz24-1600967960-cc10022-eyJob3VydHlwZSI6IjI0Iiwic2hvd2RhdGUiOiIxIiwic2hvd3NlY29uZHMiOiIxIiwiY29udGFpbmVyX2lkIjoiY2xvY2tfYmxvY2tfY2I1ZjZjZDUxOGU0MTE2IiwidHlwZSI6ImRiIiwibGFuZyI6ImVzIn0=" title="Hora Mundial - Argentina" target="_blank" rel="nofollow">Hora actual en Argentina</a>
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
        <v-card-title>Seleccione un parámetro para realizar la búsqueda</v-card-title>
        <v-radio-group class="ml-5 mr-5" v-model="radioGroup">
          <v-row>
            <v-col>
              <v-radio
              label="Nombre"
              value="nombre"
              ></v-radio>
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
        <v-card-text style="height: 300px;">
          <v-container fluid>
            <v-row>
              <v-col>
                <v-simple-table style="background-color: transparent;">
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
                        <td><v-checkbox 
                          @change="selectedProducts(producto)"
                        ></v-checkbox></td>
                        <td>{{producto.nombre}}</td>
                        <td>{{producto.codigoBarra}}</td>
                        <td>{{producto.codigoProducto}}</td>
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
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
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
import axios from "axios";
import ReportsService from '../../services/ReportsService';

export default {
  data: () => ({
    user: "",
    fecha: "",
    valid: true,
    barcode: "",
    page: 0,
    size: 1000,
    object: {},
    objects: {
      clientes: [],
      empresa: [],
      medios_de_pago: [],
      documentos: [],
    },
    productos: [],
    products: [],
    tenant: "",
    service: "ventas",
    token: localStorage.getItem("token"),
    snackError: false,
    errorMessage: "",
    dialog: false,
    filterString: "",
    radioGroup: "",
  }),

  components:{
    Calculator
  },

  created() {
    this.$barcodeScanner.init(this.onBarcodeScanned);
  },

  computed: {
    totalVenta() {
      var tot = 0;
      this.products.forEach((el) => {
        tot += parseFloat(el.total);
      });
      return tot;
    },
  },

  mounted() {
    //Validate tenant
    this.tenant = this.$route.params.tenant;
    //-->

    //Call objects for database
    GenericService(this.tenant, "clientes", this.token)
      .getAll(this.page, this.size)
      .then((data) => {
        this.objects.clientes = data.data.content;
      });

    GenericService(this.tenant, "mediosPago", this.token)
      .getAll(this.page, this.size)
      .then((data) => {
        this.objects.medios_de_pago = data.data.content;
      });

    GenericService(this.tenant, "empresas", this.token)
      .getAll(this.page, this.size)
      .then((data) => {
        this.objects.empresa = data.data.content;
      });

    VentasService(this.tenant, this.service, this.token)
    .getUser()
    .then((data)=>{
      this.user = data.data;
    });

    this.fecha = VentasService(this.tenant,this.service,this.token).getDate();
    
    //-->
  },

  methods: {
    onBarcodeScanned(barcode) {
      VentasService(this.tenant, "productos", this.token)
        .getForBarCode(barcode)
        .then((data) => {
          if (this.products.length == 0) {
            data.data.cant = 1;
            data.data.total = data.data.precioTotal;
            this.products.push(data.data);
          } else {
            var count = 0;
            for (var i = 0; i < this.products.length; i++) {
              if (this.products[i].id == data.data.id) {
                this.products[i].cant = parseInt(this.products[i].cant) + 1;
                this.products[i].total =
                  this.products[i].precioTotal * this.products[i].cant;
                break;
              } else if (
                this.products[i].id != data.data.id &&
                count == this.products.length - 1
              ) {
                data.data.cant = 1;
                data.data.total = data.data.precioTotal;
                this.products.push(data.data);
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
          el.total = 0;
          el.total = parseFloat(el.precioTotal) * el.cant;
        }
      });
    },

    getComercialDocuments(clientCond, businessCond) {
      this.objects.documentos = [];
      for (var i = 0; i < clientCond.length; i++) {
        businessCond.forEach((el) => {
          if (clientCond[i].id == el.id) {
            this.objects.documentos.push(el);
          }
        });
      }
    },

    getPaymentPlans(id) {
      this.objects.planes = id.planPago;
    },

    getProducts(){
      this.dialog = !this.dialog;
      GenericService(this.tenant, "productos", this.token)
      .getAll(this.page, this.size)
      .then((data) => {
        this.productos = data.data.content;
      });
    },

    filterObjects(filter,radio){
      var filt = {};
      switch (radio) {
        case "nombre":
            filt = {nombre: filter}
          break;
        case "codigodebarras":
            filt = {codigoBarra: filter}
          break;
        default:
          filt = {codigoProducto: filter}
          break;
      }      


      GenericService(this.tenant, "productos", this.token)
        .filter(filt)
        .then(data => {
          this.productos = data.data.content;
        });
    },

    selectedProducts(producto){
        producto.cant = 1;
        producto.total = producto.precioTotal;
        this.products.push(producto);
    },

    save() {
      var tipoDoc;
      if (this.object.documento.ivaCat == 1) {
        tipoDoc = 80;
      } else {
        tipoDoc = 94;
      }
      
      var cuit = this.user.sucursal.cuit;
      var razonSocial = this.user.sucursal.razonSocial;
      var ptoVenta = this.user.puntoVenta.idFiscal;
      
      var alicIva = [
        {
          baseImp: 0,
          id: 5,
          importe: 0,
        },
      ];

      if (
        this.object.documento.ivaCat == 2 ||
        this.object.documento.ivaCat == 1
      ) {
        var impNeto;
        alicIva[0].baseImp = Math.round((this.totalVenta / 1.21) * 100) / 100;
        alicIva[0].importe =
          Math.round((this.totalVenta - alicIva[0].baseImp) * 100) / 100;
        impNeto = alicIva[0].baseImp;
      } else {
        alicIva = [];
      }

      //Instance body from AFIP ws-services
      var body = {
        alicIva: alicIva,
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
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYXJjZWxvIiwiQ0xBSU1fVE9LRU4iOiJST0xFX0FETUlOIiwiaWF0IjoxNTk3MTY2MDIxLCJpc3MiOiJJU1NVRVIifQ.ywGMiq5eLNRp_xVfRgTAm3ZTnpZPWgVG0K45NJQWz1M",
            },
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
                headers: {
                  Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYXJjZWxvIiwiQ0xBSU1fVE9LRU4iOiJST0xFX0FETUlOIiwiaWF0IjoxNTk3MTY2MDIxLCJpc3MiOiJJU1NVRVIifQ.ywGMiq5eLNRp_xVfRgTAm3ZTnpZPWgVG0K45NJQWz1M",
                },
              }
            )
            .then((data) => {

              var respCabAfip = data.data.feCabResp;
              var respDetAfip = data.data.feDetResp;

              var comprobante = {
                letra:this.object.documento.letra,
                numeroCbte:body.nroDesde,
                fechaEmision:respCabAfip.fchProceso,
                fechaVto:respDetAfip[0].caefchVto,
                condicionVenta:true,
                productos:this.products,
                barCode:respDetAfip[0].barcode,
                cae:respDetAfip[0].cae,
                puntoVenta:this.user.puntoVenta,
                sucursal:this.user.sucursal,
                documentoComercial: this.object.documento,
                empresa:this.user.empresa,
                cliente:this.object.cliente
              }

              GenericService(this.tenant, "comprobantesFiscales", this.token)
                .save(comprobante);

              ReportsService(this.tenant, this.service, this.token)
              .onCloseSaleReport(comprobante);
            });
        });
    },
  },
};
</script>
<style scoped>
  .button_cliente_class{
    background-image: url('/images/buttons/btn_cliente.svg');
    width: 100%;
    height: 100%;
  }

  .verticalSeparator{
    float: left;
    background-color: black;
    height: 100%;
    width: 2px;
  }

  .totalInput{
    font-family: Century Gothic, CenturyGothic, AppleGothic, sans-serif;
    border: solid 1px rgb(63, 81, 181);
    background-color: #fff;
    color: black;
    text-align: right;
    padding: 5px;
  }

  .horizontalSeparator{
    width: 100%;
    height: 2px;
    margin-right: 10px;
    background-color: black;
  }
</style>