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
        <v-btn class="primary">Finalizar venta</v-btn>
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
    totalVenta: "",
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
    //-->

  },

  methods: {

    //Mark product
    onBarcodeScanned(barcode) {
      VentasService(this.tenant, "productos", this.token)
        .getForBarCode(barcode)
        .then((data) => {
          if(this.products.length > 0){ //Check that objects exist in the array
            var count = 0;
            var o = this.products.length;
              console.log("B ----- >")
              for(var i = 0; i < this.products.length; i++){
                count += 1;
                if(this.products[i].id == data.data.id){
                  console.log("1 -> b")
                  this.products[i].cant = parseInt(this.products[i].cant) + 1;
                  this.products[i].total = (this.products[i].precioTotal*this.products[i].cant);
                  this.totalVenta += this.products[i].total;
                  break;
                }
                if(this.products[i].id != data.data.id && count == o){
                  console.log("2 -> b")
                  console.log(data.data);
                  data.data.cant = 1
                  data.data.total = (data.data.precioTotal*data.data.cant)
                  this.products.push(data.data);
                  this.totalVenta += data.data.total;
                  break
                }
              }

            // this.products.forEach(el => {
            //   count += 1;
            //   console.log(o)
            //   console.log(count);
            //   if(data.data.id == el.id){
            //     console.log("1 -> b")
            //     el.cant = parseInt(el.cant) + 1;
            //     el.total = (el.precioTotal*el.cant);
            //     this.totalVenta += el.total;
            //   }
            //   if(data.data.id != el.id && count == o){
            //     console.log("2 -> b")
            //     console.log(data.data);
            //     data.data.cant = 1
            //     data.data.total = (data.data.precioTotal*data.data.cant)
            //     this.products.push(data.data);
            //     this.totalVenta += data.data.total;
            //   }
            // })

          }else{
            console.log("A ----- >")
            data.data.cant = 1
            data.data.total = (data.data.precioTotal*data.data.cant)
            this.totalVenta = data.data.total;
            this.products.push(data.data);
          }
        })
        .catch((error) => {
          if (error.response.status == 500) {
            this.snackError = true;
            this.errorMessage = "Ocurrio un error";
          }
        });
    },
    //-->

    //Call <autocomplete> inputs objects
    getComercialDocuments(id) {
      this.objects.documentos = id.documentos;
    },

    getPaymentPlans(id) {
      this.objects.planes = id.planPago;
    },
    //-->

    //Save sale on database and print comercial document
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
    //-->

    // -- Price Modification cases

    //When the quantity of units change
    updateTotal(id){
      this.products.forEach(el =>{
        if(el.id == id){
          this.totalVenta -= el.total;
          el.total = (el.precioTotal*el.cant);
          this.totalVenta += el.total;       
        }
      })
    }
    //-->

    // --- >>

  },
};
</script>