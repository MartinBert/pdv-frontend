<template>
  <v-card min-width="100%">
    <v-card-title v-if="loaded">
      <div class="text-center" style="width: 100%">Alterar precios</div>
    </v-card-title>
    <v-card-text v-if="loaded">
      <v-select
        filled
        dense
        :items="alterations"
        v-model="alterationType"
        item-text="text"
        item-value="id"
        placeholder="Seleccione el tipo de alteración"
      />
      <form @submit.prevent="updatePrices()" v-if="alterationType !== null">
        <v-text-field
          v-if="alterationType === 1"
          type="number"
          label="Ingrese el porcentaje de variación en los precios"
          v-model="object.percent"
          required
        />
        <v-text-field
          v-if="alterationType === 2"
          type="number"
          label="Ingrese el monto de variación en los precios"
          v-model="object.amount"
          required
        />
        <v-select
          :items="distribuidores"
          item-text="razonSocial"
          :return-object="true"
          v-model="object.distribuidor"
          label="Seleccione un distribuidor"
          required
        />
        <v-btn type="submit" class="primary">PROCESAR</v-btn>
      </form>
      <div class="text-end" style="width: 100%">
        <v-btn @click="back()">VOLVER</v-btn>
      </div>
    </v-card-text>

    <div class="text-center" style="margin-top: 15px" v-if="!loaded">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
  </v-card>
</template>

<script>
import { errorAlert, questionAlert, successAlert } from "../../helpers/alerts";
import {
  calculateAmountPlusPercentaje,
  calculateAmountMinusPercentaje,
  restarNumeros,
  sumarNumeros,
} from "../../helpers/mathHelper";
import GenericService from "../../services/GenericService";
export default {
  data: () => ({
    loaded: false,
    alterations: [
      { id: 1, text: "Porcentual" },
      { id: 2, text: "Aumento o reducción de monto fijo" },
    ],
    alterationType: null,
    object: {
      percent: 0,
      amount: 0,
      distribuidor: { id: 999999999, razonSocial: "Aplicar a todos" },
    },
    distribuidores: [],
    tenant: "",
    service: "productos",
    filterParams: {
      productoName: "",
      productoCodigo: "",
      productoCodigoBarras: "",
      productoMarcaName: "",
      productoPrimerAtributoName: "",
      productoSegundoAtributoName: "",
      productoTercerAtributoName: "",
      productoEstado: "",
      page: 1,
      size: 100000
    },
    token: localStorage.getItem("token"),
  }),

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.getObjects();
  },

  methods: {
    updatePrices() {
      if (this.object.percent && this.object.percent !== 0) {
        this.applyPorcentualModification();
      } else if (this.object.amount && this.object.amount !== 0) {
        this.applyModificationWithAmount();
      } else {
        errorAlert("Debe indicar un valor porcentual o fijo distinto a cero");
      }
    },

    getObjects() {
      GenericService(this.tenant, "distribuidores", this.token)
        .getAll()
        .then((data) => {
          this.distribuidores = data.data.content;
          this.distribuidores.push({
            id: 999999999,
            razonSocial: "Aplicar a todos",
          });
          this.loaded = true;
        });
    },

    applyPorcentualModification() {
      questionAlert(
        "Atención, esta acción cambiará los precios en los productos",
        "Desea continuar"
      ).then((result) => {
        if (result.isConfirmed) {
          this.loaded = false;
          GenericService(this.tenant, this.service, this.token)
            .filter(this.filterParams)
            .then((data) => {
              const products = data.data.content;
              const alterProducts = products.map((el) => {
                el = this.processModification(el, "percent");
                return el;
              });

              GenericService(this.tenant, this.service, this.token)
                .saveAll(alterProducts)
                .then(() => {
                  successAlert("Procesado con éxito");
                  this.back();
                });
            });
        }
      });
    },

    applyModificationWithAmount() {
      questionAlert(
        "Atención, esta acción cambiará los precios en los productos",
        "Desea continuar"
      ).then((result) => {
        if (result.isConfirmed) {
          this.loaded = false;
          GenericService(this.tenant, this.service, this.token)
            .filter(this.filterParams)
            .then((data) => {
              const products = data.data.content;
              const alterProducts = products.map((el) => {
                el = this.processModification(el, "amount");
                return el;
              });

              GenericService(this.tenant, this.service, this.token)
                .saveAll(alterProducts)
                .then(() => {
                  successAlert("Procesado con éxito");
                  this.back();
                });
            });
        }
      });
    },

    processModification(product, type) {
      if (type === "percent") {
        product.costoBruto = calculateAmountPlusPercentaje(
          product.costoBruto,
          this.object.percent
        );
      } else {
        product.costoBruto = sumarNumeros([
          product.costoBruto,
          this.object.amount,
        ]);
      }
      product.costoNeto = calculateAmountMinusPercentaje(
        product.costoBruto,
        product.ivaComprasObject.porcentaje
      );
      product.precioCosto = product.costoNeto;
      product.ivaCompra = restarNumeros([
        product.costoBruto,
        product.costoNeto,
      ]);
      product.precioSinIva = calculateAmountPlusPercentaje(
        product.costoBruto,
        product.ganancia
      );
      product.precioTotal = calculateAmountPlusPercentaje(
        product.precioSinIva,
        product.ivaVentasObject.porcentaje
      );
      product.ivaVenta = restarNumeros([
        product.precioTotal,
        product.precioSinIva,
      ]);

      return product;
    },

    back() {
      this.$router.push({ name: "productos" });
    },
  },
};
</script>