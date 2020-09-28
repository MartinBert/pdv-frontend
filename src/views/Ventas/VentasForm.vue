<template>
  <v-container>
    <v-snackbar v-model="snackError" :color="'#E53935'" :timeout="3000" :top="true">{{errorMessage}}</v-snackbar>
    <v-col cols="12">
      <v-row>
          <v-col cols="10">
            <v-form ref="form" v-model="valid" :lazy-validation="false">
              <v-row>
                <v-col cols="6">
                  <v-autocomplete
                    @change="getComercialDocuments(object.cliente.condicionIva.documentos, user.empresa.condicionIva.documentos)"
                    v-model="object.cliente"
                    :items="objects.clientes"
                    item-text="razonSocial"
                    :return-object="true"
                    :rules="[v => !!v || 'Campo requerido...']"
                    placeholder="Seleccione un cliente..."
                  ></v-autocomplete>
                </v-col>
                <v-col cols="6">
                  <v-autocomplete
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
                    v-model="object.planPago"
                    :items="objects.planes"
                    item-text="nombre"
                    :return-object="true"
                    :rules="[v => !!v || 'Campo requerido...']"
                    placeholder="Seleccione un plan de pago..."
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
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
                    <v-row>
                      <v-col cols="1"></v-col>
                      <v-col>TOTAL: ${{(totalVenta)}}</v-col>
                    </v-row>
                </v-col>
              </v-row>
              <v-btn class="primary" @click="save()">Finalizar venta</v-btn>
              <v-btn class="primary ml-5" @click="info()">INFO BUTTON</v-btn>
            </v-form>
          </v-col>
          <v-col cols="2">
            <Calculator/>
          </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import GenericService from "../../services/GenericService";
import VentasService from "../../services/VentasService";
import Calculator from "../../components/Calculator";
import axios from "axios";

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
    products: [],
    tenant: "",
    service: "ventas",
    token: localStorage.getItem("token"),
    snackError: false,
    errorMessage: "",
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
    //Mark product || change <cant>
    onBarcodeScanned(barcode) {
      VentasService(this.tenant, "productos", this.token)
        .getForBarCode(barcode)
        .then((data) => {
          if (this.products.length == 0) {
            console.log("A -------->");
            data.data.cant = 1;
            data.data.total = data.data.precioTotal;
            this.products.push(data.data);
          } else {
            console.log("B -------->");
            var count = 0;
            for (var i = 0; i < this.products.length; i++) {
              if (this.products[i].id == data.data.id) {
                console.log("B1 ------->");
                this.products[i].cant = parseInt(this.products[i].cant) + 1;
                this.products[i].total =
                  this.products[i].precioTotal * this.products[i].cant;
                break;
              } else if (
                this.products[i].id != data.data.id &&
                count == this.products.length - 1
              ) {
                console.log("B2 ------->");
                data.data.cant = 1;
                data.data.total = data.data.precioTotal;
                this.products.push(data.data);
                break;
              } else {
                console.log("B3 ------->");
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
    //-->

    //Call <autocomplete> inputs objects
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
    //-->

    

    //Save sale on database and print comercial document
    save() {
      var tipoDoc;
      if (this.object.documento.ivaCat == 1) {
        tipoDoc = 80;
      } else {
        tipoDoc = 94;
      }

      var cuit = this.user.empresa.cuit;
      var razonSocial = this.user.empresa.razonSocial;
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
              console.log(respCabAfip)
              console.log(respDetAfip)

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

              console.log(comprobante);

              GenericService(this.tenant, "comprobantesFiscales", this.token)
                .save(comprobante)
            });
        });
    },
    //-->

    //Info
    info() {
      console.log(`${process.env.VUE_APP_API_AFIP}/asdf`);
    },
    //-->
  },
};
</script>