<template>
  <v-container  style="min-width: 98%;
    margin-left:5px;
  ">
    <TabBar
      :tabs="tabs"
      :activeTab="activeTab"
    />
    <v-card min-width="90%" v-if="loaded">
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
        <v-radio-group
          v-model="salePriceModification"
          label="Aplicar modificación"
        >
          <v-radio label="Sobre el precio de costo" :value="false"></v-radio>
          <v-radio label="Sobre el precio de venta" :value="true"></v-radio>
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
            oninput="this.value=this.value.replace(/[^0-9.]/g,'');"
            type="text"
            label="Ingrese la variación porcentual en los precios"
            v-model="object.percent"
            required
          />
          <v-text-field
            v-if="alterationType === 2"
            oninput="this.value=this.value.replace(/[^0-9.]/g,'');"
            type="text"
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
import TabBar from "../../components/Generics/TabBar.vue";
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
    },
    alterationFilters: [
      { id: 1, text: "Aplicar modificación de precios a todos los productos" },
      { id: 2, text: "Aplicar modificación de precios por marcas" },
      { id: 3, text: "Aplicar modificación de precios por rubros" },
      { id: 4, text: "Aplicar modificación de precios por distribuidores" },
      { id: 5, text: "Aplicar modificación de precios por código de producto" },
    ],
    tabs: [
      { id: 1, title: "Lista", route: '/productos' },
      { id: 2, title: "Nuevo", route: '/productos/form/0' },
      { id: 3, title: "Generar Etiqueta", route: '/etiquetas' },
      { id: 4, title: "Modificar precios", route: '/precios' },
    ],
    activeTab: 4,
    alterationFilter: {
      id: 1,
      text: "Aplicar modificación de precios a todos los productos",
    },
    view: "listOfProducts",
    distribuidores: [],
    selectedDistribuidores: [],
    marcas: [],
    selectedMarcas: [],
    rubros: [],
    selectedRubros: [],
    codigoDeProducto: "",
    tenant: '',
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
      size: 100000,
    },
    filterParamsMarcas: {
      marcaName: "",
      page: 1,
      size: 100000,
    },
    filterParamsRubros: {
      rubroName: "",
      page: 1,
      size: 100000,
    },
    token: localStorage.getItem("token"),
  }),

  components: {
    TabBar,
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.getObjects();
    this.$store.commit("eventual/resetStates");
    //if (this.loguedUser.perfil > 1) {
      //this.filterParams.sucursalId = this.loguedUser.sucursal.id;
    //}
  },

  methods: {
    getObjects() {
      GenericService(this.tenant, "distribuidores", this.token)
        .getAll()
        .then((data) => {
          this.distribuidores = data.data.content;
        });
      GenericService(this.tenant, "marcas", this.token)
        .filter(this.filterParamsMarcas)
        .then((data) => {
          this.marcas = data.data.content;
        });
      GenericService(this.tenant, "rubros", this.token)
        .filter(this.filterParamsRubros)
        .then((data) => {
          this.rubros = data.data.content;
        });
      this.loaded = true;
    },

    newObject() {
      this.$router.push({ name: "productosForm", params: { id: 0 } });
    },
    
    getProduct() {
      this.$router.push({ name: "productos", params: { id: 0 } });
    },
    goPricesManagerView() {
      this.$router.push({ name: "precios" });
    },
    correctPriceInList() {
      this.loaded = false;
      this.filterParams.page = 1;
      this.filterParams.size = 1000000;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          const products = data.data.content;
          let correctedProducts = products.map((el) => {
            el = this.calculations(el);
            return el;
          });
          GenericService(this.tenant, this.service, this.token)
            .saveAll(correctedProducts)
            .then(() => {
              this.$successAlert("Precios corregidos");
              this.loaded = true;
            })
            .catch((err) => {
              console.error(err);
            });
        });
    },

    updatePrices() {
      if (this.object.percent && this.object.percent !== 0) {
        this.applyModification("percent");
      } else if (this.object.amount && this.object.amount !== 0) {
        this.applyModification("amount");
      } else {
        this.$errorAlert(
          "Debe indicar un valor porcentual o fijo distinto a cero"
        );
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

    applyModificationForTradeMark(modificationType) {
      if (this.selectedMarcas.length === 0)
        return this.$errorAlert("No ha seleccionado ninguna marca");
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.products = data.data.content;
          const filteredProductsWithTradeMark = this.filterProducts();
          const alterProducts = filteredProductsWithTradeMark.map((el) => {
            if (this.salePriceModification === true) {
              el = this.processModificationSalePrice(el, modificationType);
            } else {
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

    applyModificationForLines(modificationType) {
      if (this.selectedRubros.length === 0)
        return this.$errorAlert("No ha seleccionado ningún rubro");
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.products = data.data.content;
          const filteredProductsWithLines = this.filterProducts();
          const alterProducts = filteredProductsWithLines.map((el) => {
            if (this.salePriceModification === true) {
              el = this.processModificationSalePrice(el, modificationType);
            } else {
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

    applyModificationForDistribuitors(modificationType) {
      if (this.selectedDistribuidores.length === 0)
        return this.$errorAlert("No ha seleccionado ningún distribuidor");
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.products = data.data.content;
          const filteredProductsWithDistribuitors = this.filterProducts();
          const alterProducts = filteredProductsWithDistribuitors.map((el) => {
            if (this.salePriceModification === true) {
              el = this.processModificationSalePrice(el, modificationType);
            } else {
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

    applyModificationForProductCode(modificationType) {
      if (this.codigoDeProducto.length === 0)
        return this.$errorAlert("No ha escrito ningún código de producto");
      this.filterParams.productoCodigo = this.codigoDeProducto;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.products = data.data.content;
          const alterProducts = this.products.map((el) => {
            if (this.salePriceModification === true) {
              el = this.processModificationSalePrice(el, modificationType);
            } else {
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

    applyModificationToAllProducts(modificationType) {
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.products = data.data.content;
          const alterProducts = this.products.map((el) => {
            if (this.salePriceModification === true) {
              el = this.processModificationSalePrice(el, modificationType);
            } else {
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

    filterProducts() {
      let result;
      switch (this.alterationFilter) {
        case 2:
          result = this.filterWithTradeMark();
          break;
        case 3:
          result = this.filterWithLines();
          break;
        default:
          result = this.filterWithDistribuitors();
          break;
      }
      return result;
    },

    filterWithTradeMark() {
      let filteredProducts = [];
      this.products.forEach((product) => {
        this.selectedMarcas.forEach((tradeMark) => {
          if (product.marca.id === tradeMark.id) {
            filteredProducts.push(product);
          }
        });
      });
      return filteredProducts;
    },

    filterWithLines() {
      let filteredProducts = [];
      this.products.forEach((product) => {
        this.selectedRubros.forEach((line) => {
          if (product.rubro.id === line.id) {
            filteredProducts.push(product);
          }
        });
      });
      return filteredProducts;
    },

    filterWithDistribuitors() {
      let filteredProducts = [];
      this.products.forEach((product) => {
        this.selectedDistribuidores.forEach((distribuitor) => {
          product.distribuidores.forEach((productDistribuitor) => {
            if (productDistribuitor.id === distribuitor.id) {
              filteredProducts.push(product);
            }
          });
        });
      });
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

    processModificationSalePrice(product, type) {
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
