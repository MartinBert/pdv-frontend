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
                        <input class="" />
                        {{ p.cant }}</td>
                      <td>${{ p.precioTotal }}</td>
                      <td>${{ p.total }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
                <v-row>
                  <v-col cols="1"></v-col>
                  <v-col cols="5">TOTAL</v-col>
                  <v-col cols="2"></v-col>
              </v-row>
            </v-card>
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

export default {
  data: () => ({
    valid: true,
    barcode: "",
    page: 0,
    size: 1000,
    object: {},
    objects: {
      clientes: [],
      medios_de_pago: [],
    },
    products: [],
    tenant: "",
    service: "productos",
    token: localStorage.getItem("token"),
    snackError: false,
    errorMessage: "",
  }),

  created() {
    this.$barcodeScanner.init(this.onBarcodeScanned);
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
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
  },

  methods: {
    asd() {
      console.log(2);
    },

    onBarcodeScanned(barcode) {
      VentasService(this.tenant, "productos", this.token)
        .getForBarCode(barcode)
        .then((data) => {
          if(this.products.length > 0){
            this.products.forEach(el =>{
              if(el.id == data.data.id){
                el.cant += 1;
                el.total = (el.precioTotal*el.cant);
              }else{
                data.data.cant = 1
                data.data.total = (data.data.precioTotal*data.data.cant)
                this.products.push(data.data);
              }
            })
          }else{
            data.data.cant = 1
            data.data.total = (data.data.precioTotal*data.data.cant)
            this.products.push(data.data);
            console.log(this.products);
          }
        })
        .catch((error) => {
          if (error.response.status == 500) {
            this.snackError = true;
            this.errorMessage = "Ocurrio un error";
          }
        });
    },

    getComercialDocuments(id) {
      this.objects.documentos = id.documentos;
    },

    getPaymentPlans(id) {
      this.objects.planes = id.planPago;
    },

    save() {
      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(() => {
          this.$router.push({ name: "ventas/form" });
        })
        .catch((error) => {
          if (error.response.status == 500) {
            this.snackError = true;
            this.errorMessage = "Ocurrio un error";
          }
        });
    },
  },
};
</script>