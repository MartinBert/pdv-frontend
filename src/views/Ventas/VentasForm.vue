<template>
  <v-card width="100%">
    <v-snackbar v-model="snackError" :color="'#E53935'" :timeout="3000" :top="true">{{errorMessage}}</v-snackbar>
    <v-col cols="12">
      <v-form ref="form" v-model="valid" :lazy-validation="false" class="mt-5">
        <v-row class="ma-5">
          <v-col cols="5">
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
          <v-col cols="4">
            <v-autocomplete
              v-model="object.documento"
              :items="objects.documentos"
              item-text="nombre"
              :return-object="true"
              :rules="[v => !!v || 'Campo requerido...']"
              placeholder="Seleccione un tipo de comprobante..."
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row class="ma-5">
          <v-col cols="9">
            <v-card>
              <v-simple-table>
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
            </v-card>
          </v-col>
        </v-row>
        <v-row class="ma-5">
          <v-col cols="5">
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
          <v-col cols="4">
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
        <v-btn class="primary" @click="save()">Finalizar venta</v-btn>
        <v-btn class="primary ml-5" @click="getUser">INFO BUTTON</v-btn>
      </v-form>
    </v-col>
  </v-card>
</template>

<script>
import GenericService from "../../services/GenericService";
import VentasService from "../../services/VentasService";
import verify from "jsonwebtoken";
import axios from "axios";

export default {
  data: () => ({
    user: "",
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

  created() {
    this.$barcodeScanner.init(this.onBarcodeScanned);
  },

  computed: {
    totalVenta() {
      var tot = 0;
      this.products.forEach(el => {
        tot += parseFloat(el.total);
      })
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
    
    this.getUser();
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

    updateTotal(id){
      this.products.forEach(el =>{
        if(el.id == id){
          el.total = 0;
          el.total = parseFloat(el.precioTotal)*el.cant;
        }
      })
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

    getUser() {
      axios
        .get(
          `${process.env.VUE_APP_SERVER}/${this.tenant}/api/usuarios/getLogued`,
          {
            headers: { Authorization: "Bearer " + this.token }
          }
        )
        .then(response => {
          this.user = response.data;
        })
    },

    //Save sale on database and print comercial document
    save() {
      //Instance date of body document
      var fecha = new Date();
      var generatedFecha =
        fecha.getFullYear().toString() +
        ("0" + (fecha.getMonth() + 1)).toString() +
        fecha.getDate().toString();

      //Instance empresa & ptoVenta of body document
      var tipoDoc;
      var cuit =  this.user.empresa.cuit;
      var razonSocial = this.user.empresa.razonSocial;
      var ptoVenta = this.user.puntoVenta.idFiscal;
      if(this.object.documento.ivaCat == 1){
         tipoDoc = 80;
      }else{
        tipoDoc = 94;
      }
      
      //Instance alicIva  & impNeto of body document
      var alicIva = [{
        baseImp: 0,
        id: 5,
        importe: 0,
      }]
      if(this.object.documento.ivaCat == 2 || this.object.documento.ivaCat == 1){
        var impNeto;
        alicIva[0].baseImp = Math.round((this.totalVenta / 1.21)*100)/ 100;
        alicIva[0].importe = Math.round((this.totalVenta - alicIva[0].baseImp)*100) / 100;
        impNeto = alicIva[0].baseImp;
      }else{
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
        fecha: generatedFecha,
        fechaServicioHasta: generatedFecha,
        fechaServicioVenc: generatedFecha,
        fechaServiciodesde: generatedFecha,
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
          `http://localhost:8080/rest/api/facturas/obtenerUltimoNumeroAutorizado/${razonSocial}/${cuit}/${ptoVenta}/${body.cbteTipo}`,
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
              `http://localhost:8080/rest/api/facturas/generarComprobante/${razonSocial}`,
              body,
              {
                headers: {
                  Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYXJjZWxvIiwiQ0xBSU1fVE9LRU4iOiJST0xFX0FETUlOIiwiaWF0IjoxNTk3MTY2MDIxLCJpc3MiOiJJU1NVRVIifQ.ywGMiq5eLNRp_xVfRgTAm3ZTnpZPWgVG0K45NJQWz1M",
                },
              }
            )
            .then((data) => {
              console.log(data);
            });
        });
    },
    //-->

    //Info
    info() {
      var decodeUser = verify.decode(this.token.replace("Bearer ", ""));
      var user = decodeUser.sub.slice(0, decodeUser.sub.indexOf("/"))
      console.log(user);
    },
    //-->
  },
};
</script>