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
        <v-row class="ml-1">
          <v-col cols="3">
            <v-autocomplete
              :items="ivas"
              item-text="nombre"
              v-model="object.iva"
              :return-object="true"
            />
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
              v-on:input="calculations()"
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
              v-on:input="calculations()"
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
              @input="gainCalculations()"
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
import { calculateAmountPlusPercentaje, calculateAmountMinusPercentaje, restarNumeros, roundTwoDecimals, calculatePercentReductionInAmount } from '../../helpers/mathHelper';
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
      estado: 1,
      ganancia: 0,
      iva: {id:1, nombre:"Iva 21%", porcentaje: 21}
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
    rubros: [],
    ivas: [],
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

      GenericService(this.tenant, "rubros", this.token)
        .getAll(page, size)
        .then(data => {
          this.rubros = data.data.content;
        });

      GenericService(this.tenant, "ivas", this.token)
        .getAll(page, size)
        .then(data => {
          this.ivas = data.data.content;
        });
    },

    calculations() {
      this.object.costoNeto = calculateAmountMinusPercentaje(this.object.costoBruto, this.object.iva.porcentaje);
      this.object.precioCosto = this.object.costoNeto;
      this.object.ivaCompra = restarNumeros([this.object.costoBruto, this.object.costoNeto]);
      this.object.precioSinIva = calculateAmountPlusPercentaje(this.object.costoBruto, this.object.ganancia);
      this.object.precioTotal = calculateAmountPlusPercentaje(this.object.precioSinIva, this.object.iva.porcentaje);
      this.object.ivaVenta = restarNumeros([this.object.precioTotal, this.object.precioSinIva]);
    },

    gainCalculations() {
      this.object.ganancia = roundTwoDecimals(calculatePercentReductionInAmount(this.object.precioTotal, this.object.iva.porcentaje) - this.object.costoBruto);
      this.object.precioSinIva = calculatePercentReductionInAmount(this.object.precioTotal, this.object.iva.porcentaje);
      this.object.ivaVenta = roundTwoDecimals(restarNumeros([this.object.precioTotal, this.object.precioSinIva]));
    },

    save() {
      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
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