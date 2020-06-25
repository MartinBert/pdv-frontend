<template>
  <v-card width="100%">
    <v-snackbar v-model="snackError" :color="'#E53935'" :timeout="3000" :top="true">{{errorMessage}}</v-snackbar>
    <div v-if="loaded">
      <v-form ref="form" v-model="valid" :lazy-validation="false" class="mt-5">
        <v-row class="ma-5">
          <v-col cols="9">
            <v-card>
              <v-data-table :headers="headers" :items="object" calculate-widths></v-data-table>
            </v-card>
          </v-col>
          <v-col cols="3">
            <Calculator/>
          </v-col>
        </v-row>
      </v-form>
    </div>
    <div v-if="!loaded">
      <v-row class="ma-1">
        <v-col class="col-12" style="text-align:center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script>
import GenericService from "../../services/GenericService";
import Calculator from "../../components/Calculator.vue"

export default {
  data: () => ({
    valid: true,
    object: [],
    loaded: false,
    tenant: "",
    service: "productos",
    token: localStorage.getItem("token"),
    snackError: false,
    headers: [
      { text: "Producto", value: "prod" },
      { text: "Cantidad", value: "cantidad" },
      { text: "Precio", value: "precio" }
    ],
    errorMessage: ""
  }),

  components:{

    Calculator
    
  },

  created() {
    // Add barcode scan listener and pass the callback function
    this.$barcodeScanner.init(this.onBarcodeScanned);
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    if (this.$route.params.id && this.$route.params.id > 0) {
      this.getObject(this.$route.params.id);
    } else {
      this.loaded = true;
    }
  },

  methods: {
    onBarcodeScanned(barcode) {
      GenericService(this.tenant, this.service, this.token)
        .getForBarCode(barcode)
        .then(data => {
          this.object = data.data;
          this.loaded = true;
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