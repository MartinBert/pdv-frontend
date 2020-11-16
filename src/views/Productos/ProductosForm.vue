<template>
  <v-card min-width="100%">
    <v-snackbar v-model="snackError" :color="'#E53935'" :timeout="3000" :top="true">{{errorMessage}}</v-snackbar>
    <div v-if="loaded">
      <v-form ref="form" v-model="valid" :lazy-validation="false" class="mt-5">
        <v-row class="ma-1">
          <v-col>
            <v-text-field
              type="text"
              v-model="object.nombre"
              :counter="50"
              label="Nombre"
              required
              :rules="[v => !!v || 'Campo requerido...']"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              type="text"
              v-model="object.codigoProducto"
              :counter="50"
              label="Código de producto"
              required
              :rules="[v => !!v || 'Campo requerido...']"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              type="text"
              v-model="object.codigoBarra"
              :counter="50"
              label="Código de barras"
              required
              :rules="[v => !!v || 'Campo requerido...']"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="ma-1">          
          <v-col>
            <v-autocomplete
              :items="distribuidores"
              v-model="object.distribuidores"
              multiple
              item-text="razonSocial"
              label="Distribuidores"
              :return-object="true"
              :rules="[v => !!v || 'Campo requerido...']"
            ></v-autocomplete>
          </v-col> 
          <v-col>
            <v-autocomplete
              :items="depositos"
              v-model="object.depositos"
              multiple
              item-text="nombre"
              label="Depositos"
              :return-object="true"
              :rules="[v => !!v || 'Campo requerido...']"
            ></v-autocomplete>
          </v-col>
          <v-col v-for="o in object.depositos" :key="o.id" style="display: inline-block;">
            <v-text-field
            v-bind:id="`deposito${o.id}`"
            type="number"
            :counter="50"
            v-bind:label="`Cantidad de unidades en ${o.nombre}`"
            required
            :rules="[v => !!v || 'Campo requerido...']"
            ></v-text-field>
            <v-btn @click="Apply(o.id)">Aplicar</v-btn>
          </v-col>
        </v-row>
        <v-row class="ma-1">
          <v-col>
            <v-autocomplete
              :items="marcas"
              v-model="object.marca"
              item-text="nombre"
              :return-object="true"
              label="Marca"
              :rules="[v => !!v || 'Campo requerido...']"
            ></v-autocomplete>
          </v-col>
          <v-col>
            <v-autocomplete
              :items="rubros"
              v-model="object.rubro"
              item-text="nombre"
              :return-object="true"
              label="Rubro"
              :rules="[v => !!v || 'Campo requerido...']"
            ></v-autocomplete>
          </v-col>
          <v-col>
            <v-autocomplete
              :items="propiedades"
              v-model="object.propiedad"
              item-text="texto"
              item-value="id"
              label="Propiedad"
              :rules="[v => !!v || 'Campo requerido...']"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row class="ma-1">
          <v-col>
            <v-text-field
              type="number"
              v-model="object.costoBruto"
              :counter="10"
              label="Costo bruto"
              required
              class="mr-3"
              v-on:input="calculations"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              type="number"
              v-model="object.precioCosto"
              :counter="10"
              label="Precio de costo"
              required
              class="mr-3"
              disabled
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              type="number"
              v-model="object.costoNeto"
              :counter="10"
              label="Costo neto"
              required
              class="mr-3"
              disabled
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              type="number"
              v-model="object.ivaCompra"
              :counter="10"
              label="Iva compras"
              required
              class="mr-3"
              disabled
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              type="number"
              v-model="object.ganancia"
              :counter="10"
              label="Ganancia"
              required
              class="mr-3"
              v-on:input="calculations"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              type="number"
              v-model="object.precioSinIva"
              :counter="10"
              label="Precio sin IVA"
              required
              class="mr-3"
              disabled
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              type="number"
              v-model="object.ivaVenta"
              :counter="10"
              label="Iva ventas"
              required
              class="mr-3"
              disabled
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              type="number"
              v-model="object.precioTotal"
              :counter="10"
              label="Precio total"
              required
              @input="gainCalculations"
            ></v-text-field>
          </v-col>
        </v-row>
        <div class="ma-1">
          <v-col class="col-6">
            <v-btn class="mr-4" color="primary" @click="save" :disabled="!valid">Guardar</v-btn>
            <v-btn color="default" @click="back()">Cancelar</v-btn>
          </v-col>
        </div>
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

export default {
  data: () => ({
    propiedades: [
      { id: 1, texto: "Kilos" },
      { id: 2, texto: "Gramos" },
      { id: 3, texto: "Unidades" }
    ],
    valid: true,
    object: {
      estado: 1
    },
    cantidad: [],
    loaded: false,
    tenant: "",
    service: "productos",
    token: localStorage.getItem("token"),
    snackError: false,
    errorMessage: "",

    marcas: [],
    distribuidores: [],
    depositos: [],
    rubros: []
  }),
  mounted() {
    this.tenant = this.$route.params.tenant;
    if (this.$route.params.id && this.$route.params.id > 0) {
      this.getObject(this.$route.params.id);
    } else {
      this.loaded = true;
    }
    this.getOtherModels(0, 20000);
  },

  methods: {
    getObject(id) {
      GenericService(this.tenant, this.service, this.token)
        .get(id)
        .then(data => {
          this.object = data.data;
          this.loaded = true;
        });
    },

    getOtherModels(page, size) {
      GenericService(this.tenant, "marcas", this.token)
        .getAll(page, size)
        .then(data => {
          this.marcas = data.data.content;
        });

      GenericService(this.tenant, "distribuidores", this.token)
        .getAll(page, size)
        .then(data => {
          this.distribuidores = data.data.content;
        });

      GenericService(this.tenant, "depositos", this.token)
        .getAll(page, size)
        .then(data => {
          this.depositos = data.data.content;
        });

      GenericService(this.tenant, "rubros", this.token)
        .getAll(page, size)
        .then(data => {
          this.rubros = data.data.content;
        });
    },

    Apply(id){
      this.cantidad.push(document.getElementById(`deposito${id}`).value);
      document.getElementById(`deposito${id}`).setAttribute("disabled", true);
    },
   
    calculations: function() {
      this.object.costoNeto = (this.object.costoBruto * (1 - 0.21)).toFixed(2);
      this.object.ivaCompra = (
        this.object.costoBruto - this.object.costoNeto
      ).toFixed(2);
      this.object.precioSinIva = (
        this.object.costoBruto *
        (1 + this.object.ganancia / 100)
      ).toFixed(2);
      this.object.precioTotal = (
        this.object.costoBruto *
        (1 + this.object.ganancia / 100) *
        1.21
      ).toFixed(2);
      this.object.ivaVenta = (
        this.object.precioTotal - this.object.precioSinIva
      ).toFixed(2);
      this.object.precioCosto = this.object.costoBruto;
    },

    gainCalculations: function() {
      this.object.ganancia = (
        this.object.precioTotal / 1.21 -
        this.object.costoBruto
      ).toFixed(2);
      this.object.precioSinIva = (this.object.precioTotal / 1.21).toFixed(2);
      this.object.ivaVenta = (
        this.object.precioTotal - this.object.precioSinIva
      ).toFixed(2);
    },

    save() {
      var depositos = this.object.depositos;
      var cantidad = this.cantidad;
      var tenant = this.tenant;
      var token = this.token;
      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(
          function(data){
            depositos.forEach((el, index)=>{
              var stock = {
              producto: data.data,
              deposito: el,
              cantidad:cantidad[index]
              }
              GenericService(tenant, "stock",token)
              .save(stock)
            });
          })
        .catch(error => {
          if (error.response.status == 500) {
            this.snackError = true;
            this.errorMessage = "Ocurrio un error";
          }
        });
      this.$router.push({ name: "productos" })
    },

    back() {
      this.$router.push({ name: "productos" });
    }
  }
};
</script>