<template>
  <v-card width="100%">
    <v-snackbar v-model="snackError" :color="'#E53935'" :timeout="3000" :top="true">{{errorMessage}}</v-snackbar>
    <div>
      <v-form ref="form" v-model="valid" :lazy-validation="false" class="mt-5">
        <v-row class="ma-5">
          <v-col>
              <v-autocomplete
              multiple
              :items="objects"
              item-text="razonSocial"
              :return-object="true"
              :rules="[v => !!v || 'Campo requerido...']"
              placeholder="Seleccione un cliente..."
            ></v-autocomplete>
            </v-col>
            <v-col>
              <v-autocomplete
              multiple
              item-text="razonSocial"
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
      </v-form>
    </div>
  </v-card>
</template>

<script>
import GenericService from "../../services/GenericService";
import Calculator from "../../components/Calculator.vue"

export default {
  data: () => ({
    valid: true,
    barcode: "",
    page: 0,
    size: 1000,
    objects: {},
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
      // Add barcode scan listener and pass the callback function
      this.$barcodeScanner.init(this.onBarcodeScanned)
    },

  mounted() {
      this.tenant = this.$route.params.tenant;
      GenericService(this.tenant, "clientes", this.token)
        .getAll(this.page, this.size)
        .then(data => {
          this.objects = data.data.content;
        });
  },

  methods: {

   onBarcodeScanned (barcode) {
        GenericService(this.tenant, "productos", this.token)
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

    save() {
      GenericService(this.tenant, this.service, this.token)
        .save(this.pr)
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