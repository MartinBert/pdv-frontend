<template>
  <v-card width="100%">
    <v-snackbar v-model="snackError" :color="'#E53935'" :timeout="3000" :top="true">{{errorMessage}}</v-snackbar>
    <v-col cols="12">
      <v-form ref="form" v-model="valid" :lazy-validation="false" class="mt-5">
        <v-row class="ma-5">
          <v-col cols="5">
              <v-autocomplete
              @change="getComercialDocuments(object.cliente_id.condicionIva)"
              v-model="object.cliente_id"
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
              <v-data-table :headers="headers" calculate-widths></v-data-table>
            </v-card>
          </v-col>
          <v-col cols="3">
          <Calculator/>
        </v-col>
        </v-row>
        <v-row>
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
            <v-col cols="5">
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
      </v-form>
    </v-col>
  </v-card>
</template>

<script>
import GenericService from "../../services/GenericService";
import VentasService from "../../services/VentasService";
import Calculator from "../../components/Calculator.vue"

export default {
  data: () => ({
    valid: true,
    barcode: "",
    page: 0,
    size: 1000,
    object:{},
    objects: {
      clientes: [],
      medios_de_pago: []
    },
    tenant: "",
    service: "productos",
    token: localStorage.getItem("token"),
    snackError: false,
    headers: [
      { text: "Producto", value: "prod" },
      { text: "Código de barras", value: "prod" },
      { text: "Código de producto", value: "prod" },
      { text: "Cantidad", value: "cantidad" },
      { text: "Precio", value: "precio" }
    ],
    errorMessage: ""
  }),

  components:{
    Calculator
  },

  created () {
    this.$barcodeScanner.init(this.onBarcodeScanned)
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
      GenericService(this.tenant, "clientes", this.token)
        .getAll(this.page, this.size)
        .then(data => {
          this.objects.clientes = data.data.content;
        });
      GenericService(this.tenant, "mediosPago", this.token)
        .getAll(this.page, this.size)
        .then(data => {
          this.objects.medios_de_pago = data.data.content;
          console.log(this.objects.medios_de_pago);
        });
  },

  methods: {

    onBarcodeScanned (barcode) {
        VentasService(this.tenant, "productos", this.token)
        .getForBarCode(barcode)
        .then(data => {
          this.products = data.data;
          console.log(this.products);
        })
        .catch(error => {
          if (error.response.status == 500) {
            this.snackError = true;
            this.errorMessage = "Ocurrio un error";
          }
        });
      },

    getComercialDocuments(id){
      this.objects.documentos = id.documentos
    },

    getPaymentPlans(id){
      this.objects.planes = id.planPago
      console.log(this.objects.planes);
    },

    save() {
      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(() => {
          this.$router.push({ name: "ventas/form" });
        })
        .catch(error => {
          if (error.response.status == 500) {
            this.snackError = true;
            this.errorMessage = "Ocurrio un error";
          }
        });
    },

  }
};
</script>