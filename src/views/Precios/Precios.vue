<template>
  <v-container>
    <v-card min-width="100%" v-if="loaded">
      <v-card-title>
        <div class="text-center" style="width: 100%">Alterar precios</div>
      </v-card-title>
      <v-card-text>
        <v-select
          filled
          dense
          :items="alterationFilters"
          v-model="alterationFilter"
          item-text="text"
          item-value="id"
          placeholder="Seleccione un concepto de filtrado"
        />
        <v-radio-group v-model="salePriceModification" label="Aplicar modificación">
          <v-radio
            label="Sobre el precio de costo"
            :value="false"
          ></v-radio>
          <v-radio
            label="Sobre el precio de venta"
            :value="true"
          ></v-radio>
        </v-radio-group>
        <v-select
          filled
          dense
          :items="alterations"
          v-model="alterationType"
          item-text="text"
          item-value="id"
          placeholder="Seleccione el tipo de alteración"
        />
        <form @submit.prevent="updatePrices()" v-if="alterationType">
          <div v-if="alterationFilter !== 1">
            <v-autocomplete
              v-if="alterationFilter === 2"
              :items="marcas"
              item-text="nombre"
              :return-object="true"
              v-model="selectedMarcas"
              label="Seleccione las marcas que sufrirán la alteración de precios"
              multiple
            />
            <v-autocomplete
              v-if="alterationFilter === 3"
              :items="rubros"
              item-text="nombre"
              :return-object="true"
              v-model="selectedRubros"
              label="Seleccione los rubros que sufrirán la alteración de precios"
              multiple
            />
            <v-autocomplete
              v-if="alterationFilter === 4"
              :items="distribuidores"
              item-text="razonSocial"
              :return-object="true"
              label="Seleccione los distribuidores que sufrirán la alteración de precios"
              v-model="selectedDistribuidores"
              multiple
            />
            <v-text-field
              v-if="alterationFilter === 5"
              :items="marcas"
              item-text="nombre"
              :return-object="true"
              label="Escriba el código de producto para alterar precios donde se encuentre asignado"
              v-model="codigoDeProducto"
              multiple
            />
          </div>
          <v-text-field
            v-if="alterationType === 1"
            type="number"
            label="Ingrese la variación porcentual en los precios"
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
          <v-btn type="submit" class="primary">PROCESAR</v-btn>
        </form>
        <div class="text-end" style="width: 100%">
          <v-btn @click="back()">VOLVER</v-btn>
        </div>
      </v-card-text>
    </v-card>
    <Spinner v-if="!loaded"/>
  </v-container>
</template>
<script>
import {
  calculateAmountPlusPercentaje,
  calculateAmountMinusPercentaje,
  roundTwoDecimals,
  calculatePercentReductionInAmount,
  restarNumeros,
  sumarNumeros,
} from "../../helpers/mathHelper";
import GenericService from "../../services/GenericService";
import Spinner from '../../components/Graphics/Spinner';
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
      amount: 0
    },
    alterationFilters: [
      {id: 1, text: "Aplicar modificación de precios a todos los productos"},
      {id: 2, text: "Aplicar modificación de precios por marcas"},
      {id: 3, text: "Aplicar modificación de precios por rubros"},
      {id: 4, text: "Aplicar modificación de precios por distribuidores"},
      {id: 5, text: "Aplicar modificación de precios por código de producto"},
    ],
    alterationFilter:{
      id: 1, text: "Aplicar modificación de precios a todos los productos"
    },
    distribuidores: [],
    selectedDistribuidores: [],
    marcas: [],
    selectedMarcas: [],
    rubros: [],
    selectedRubros: [],
    codigoDeProducto: "",
    tenant: "",
    service: "productos",
    products: [],
    salePriceModification: false,
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

  components:{
    Spinner
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.getObjects();
  },

  methods: {
    getObjects() {
      GenericService(this.tenant, "distribuidores", this.token)
        .getAll()
        .then((data) => {
          this.distribuidores = data.data.content;
        });
      GenericService(this.tenant, "marcas", this.token)
        .getAll()
        .then((data) => {
          this.marcas = data.data.content;
        });
      GenericService(this.tenant, "rubros", this.token)
        .getAll()
        .then((data) => {
          this.rubros = data.data.content;
        });
        this.loaded = true;
    },

    updatePrices() {
      if (this.object.percent && this.object.percent !== 0) {
        this.applyModification("percent");
      } else if (this.object.amount && this.object.amount !== 0) {
        this.applyModification("amount");
      } else {
        this.$errorAlert("Debe indicar un valor porcentual o fijo distinto a cero");
      }
    },

    applyModification(modificationType) {
      this.$questionAlert(
        "Atención, esta acción cambiará los precios en los productos",
        "Desea continuar"
      ).then((result) => {
        if (result.isConfirmed) {
          this.loaded = false;
          switch (this.alterationFilter) {
            case 2:
                this.applyModificationForTradeMark(modificationType);
              break;
            case 3:
                this.applyModificationForLines(modificationType);
              break;
            case 4:
                this.applyModificationForDistribuitors(modificationType);
              break;
            case 5:
                this.applyModificationForProductCode(modificationType);
              break;
            default:
                this.applyModificationToAllProducts(modificationType);
              break;
          }
        }
      });
    },

    applyModificationForTradeMark(modificationType){
      if(this.selectedMarcas.length === 0) return this.$errorAlert("No ha seleccionado ninguna marca");
      GenericService(this.tenant, this.service, this.token)
      .filter(this.filterParams)
      .then((data) => {
        this.products = data.data.content;
        const filteredProductsWithTradeMark = this.filterProducts()
        const alterProducts = filteredProductsWithTradeMark.map((el) => {
          if(this.salePriceModification === true){
            el = this.processModificationSalePrice(el, modificationType);
          }else{
            el = this.processModificationCostPrice(el, modificationType);
          }
          return el;
        });
        GenericService(this.tenant, this.service, this.token)
          .saveAll(alterProducts)
          .then(() => {
            this.$successAlert("Procesado con éxito");
            this.back();
          });
      });
    },
    
    applyModificationForLines(modificationType){
      if(this.selectedRubros.length === 0) return this.$errorAlert("No ha seleccionado ningún rubro");
      GenericService(this.tenant, this.service, this.token)
      .filter(this.filterParams)
      .then((data) => {
        this.products = data.data.content;
        const filteredProductsWithLines = this.filterProducts()
        const alterProducts = filteredProductsWithLines.map((el) => {
          if(this.salePriceModification === true){
            el = this.processModificationSalePrice(el, modificationType);
          }else{
            el = this.processModificationCostPrice(el, modificationType);
          }
          return el;
        });
        GenericService(this.tenant, this.service, this.token)
          .saveAll(alterProducts)
          .then(() => {
            this.$successAlert("Procesado con éxito");
            this.back();
          });
      });
    },

    applyModificationForDistribuitors(modificationType){
      if(this.selectedDistribuidores.length === 0) return this.$errorAlert("No ha seleccionado ningún distribuidor");
      GenericService(this.tenant, this.service, this.token)
      .filter(this.filterParams)
      .then((data) => {
        this.products = data.data.content;
        const filteredProductsWithDistribuitors = this.filterProducts()
        const alterProducts = filteredProductsWithDistribuitors.map((el) => {
          if(this.salePriceModification === true){
            el = this.processModificationSalePrice(el, modificationType);
          }else{
            el = this.processModificationCostPrice(el, modificationType);
          }
          return el;
        });
        GenericService(this.tenant, this.service, this.token)
          .saveAll(alterProducts)
          .then(() => {
            this.$successAlert("Procesado con éxito");
            this.back();
          });
      });
    },

    applyModificationForProductCode(modificationType){
      if(this.codigoDeProducto.length === 0) return this.$errorAlert("No ha escrito ningún código de producto");
      this.filterParams.productoCodigo = this.codigoDeProducto;
      GenericService(this.tenant, this.service, this.token)
      .filter(this.filterParams)
      .then((data) => {
        this.products = data.data.content;
        const alterProducts = this.products.map((el) => {
          if(this.salePriceModification === true){
            el = this.processModificationSalePrice(el, modificationType);
          }else{
            el = this.processModificationCostPrice(el, modificationType);
          }
          return el;
        });
        GenericService(this.tenant, this.service, this.token)
          .saveAll(alterProducts)
          .then(() => {
            this.$successAlert("Procesado con éxito");
            this.back();
          });
      });
    },

    applyModificationToAllProducts(modificationType){
      if(this.selectedMarcas.length === 0) return this.$errorAlert("No ha escrito ningún código de producto");
      GenericService(this.tenant, this.service, this.token)
      .filter(this.filterParams)
      .then((data) => {
        this.products = data.data.content;
        const alterProducts = this.products.map((el) => {
          if(this.salePriceModification === true){
            el = this.processModificationSalePrice(el, modificationType);
          }else{
            el = this.processModificationCostPrice(el, modificationType);
          }
          return el;
        });
        GenericService(this.tenant, this.service, this.token)
          .saveAll(alterProducts)
          .then(() => {
            this.$successAlert("Procesado con éxito");
            this.back();
          });
      });
    },

    filterProducts(){
      let result;
      switch (this.alterationFilter) {
        case 2:
            result = this.filterWithTradeMark()
          break;
        case 3:
            result = this.filterWithLines()
          break;
        default:
            result = this.filterWithDistribuitors()
          break;
      }
      return result;
    },

    filterWithTradeMark(){
      let filteredProducts = [];
      this.products.forEach(product => {
        this.selectedMarcas.forEach(tradeMark => {
          if(product.marca.id === tradeMark.id){
            filteredProducts.push(product);
          }
        })
      })
      return filteredProducts;
    },

    filterWithLines(){
      let filteredProducts = [];
      this.products.forEach(product => {
        this.selectedRubros.forEach(line => {
          if(product.rubro.id === line.id){
            filteredProducts.push(product);
          }
        })
      })
      return filteredProducts;
    },

    filterWithDistribuitors(){
      let filteredProducts = [];
      this.products.forEach(product => {
        this.selectedDistribuidores.forEach(distribuitor => {
          product.distribuidores.forEach(productDistribuitor => {
            if(productDistribuitor.id === distribuitor.id){
              filteredProducts.push(product);
            }
          })
        })
      })
      return filteredProducts;
    },

    processModificationCostPrice(product, type) {
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

    processModificationSalePrice(product, type){
      if (type === "percent") {
        product.precioTotal = calculateAmountPlusPercentaje(
          product.precioTotal,
          this.object.percent
        );
      } else {
        product.precioTotal = sumarNumeros([
          product.precioTotal,
          this.object.amount,
        ]);
      }
      product.ganancia = roundTwoDecimals(
        calculatePercentReductionInAmount(
          product.precioTotal,
          product.ivaVentasObject.porcentaje
        ) - product.costoBruto
      );
      product.precioSinIva = calculatePercentReductionInAmount(
        product.precioTotal,
        product.ivaVentasObject.porcentaje
      );
      product.ivaVenta = roundTwoDecimals(
        restarNumeros([product.precioTotal, product.precioSinIva])
      );
      return product;
    },

    back() {
      this.$router.push({ name: "productos" });
    },
  },
};
</script>