<template>
  <v-container
    style="min-width: 99%;
  margin-left:5px;
  "
  >
    <TabBar
      :tabs="tabs"
      :activeTab="activeTab"
      class="tab"
    />

    <v-card class="card" min-width="100%">
      <Error :errorStatus="errorStatus" />
      <div v-if="loaded" class="grey lighten-5">
        <v-form
          ref="form"
          v-model="valid"
          :lazy-validation="false"
          class="mt-0"
        >
          <v-container>
            <v-row>
              <v-col cols="3" sm="4">
                <v-text-field
                  class="mr-2"
                  type="text"
                  v-model="object.nombre"
                  :counter="50"
                  label="Nombre"
                  required
                  :rules="[(v) => !!v || 'Campo requerido...']"
                ></v-text-field>
              </v-col>
              <v-col cols="3" sm="4">
                <v-text-field
                  class="mr-2"
                  type="text"
                  v-model="object.codigoProducto"
                  :counter="50"
                  label="Código de producto"
                  required
                  :rules="[(v) => !!v || 'Campo requerido...']"
                ></v-text-field>
              </v-col>
              <v-col cols="4" class="d-flex" sm="4">
                <v-text-field
                  class="mr-2"
                  type="text"
                  v-model="object.codigoBarra"
                  :counter="50"
                  label="Código de barras"
                  required
                  @blur="
                    checkBarCode(filterParams, object.codigoBarra)
                  "
                  :rules="[(v) => !!v || 'Campo requerido...']"
                ></v-text-field>
                <v-btn class="primary mt-3" @click="generateBarCode()"
                  >Generar</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
          <v-container>
            <v-row class="sm-3">
              <v-col cols="8">
                <v-autocomplete
                  :items="distribuidores"
                  v-model="object.distribuidores"
                  multiple
                  item-text="razonSocial"
                  label="Proveedores"
                  :return-object="true"
                  :rules="[(v) => !!v || 'Campo requerido...']"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
          <v-container>
            <v-row class="sm-3">
              <v-col>
                <v-autocomplete
                  :items="marcas"
                  v-model="object.marca"
                  item-text="nombre"
                  :return-object="true"
                  label="Marca"
                  :rules="[(v) => !!v || 'Campo requerido...']"
                ></v-autocomplete>
              </v-col>
              <v-col>
                <v-autocomplete
                  :items="rubros"
                  v-model="object.rubro"
                  item-text="nombre"
                  :return-object="true"
                  label="Rubro"
                  :rules="[(v) => !!v || 'Campo requerido...']"
                ></v-autocomplete>
              </v-col>
              <v-col>
                <v-autocomplete
                  multiple
                  :items="propiedades"
                  v-model="object.propiedades"
                  item-text="nombre"
                  label="Propiedades"
                  :return-object="true"
                ></v-autocomplete>
              </v-col>
              <v-col cols="4">
                <v-autocomplete
                  multiple
                  :items="atributosDeTexto"
                  v-model="object.atributos"
                  item-text="valor"
                  label="Atributos de tipo texto"
                  :return-object="true"
                ></v-autocomplete>
              </v-col>
              <v-col>
                <v-autocomplete
                  multiple
                  :items="atributosNumericos"
                  v-model="object.atributos"
                  item-text="valorNumerico"
                  label="Atributos numéricos"
                  :return-object="true"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
          <v-container>
            <v-row class="sm-2">
              <v-col cols="4" sm="4">
                <v-autocomplete
                  label="Iva compras"
                  :items="ivasCompra"
                  item-text="nombre"
                  v-model="object.ivaComprasObject"
                  :return-object="true"
                  v-on:input="calculations()"
                />
              </v-col>
              <v-col cols="4" sm="4">
                <v-autocomplete
                  label="Iva ventas"
                  :items="ivasVenta"
                  item-text="nombre"
                  v-model="object.ivaVentasObject"
                  :return-object="true"
                  v-on:input="calculations()"
                />
              </v-col>
              <v-col cols="4" sm="4">
                <v-container>
                  <v-radio-group
                    v-model="object.editable"
                    row
                    label="¿Precio editable en ventas?"
                  >
                    <v-radio label="Si" :value="true" color="primary"></v-radio>
                    <v-radio
                      label="No"
                      :value="false"
                      color="primary"
                    ></v-radio>
                  </v-radio-group>
                </v-container>
              </v-col>
            </v-row>
          </v-container>
          <v-container>
            <v-row class="sm-3">
              <v-col cols="3" sm="4">
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
              <v-col cols="3" sm="4">
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
              <v-col cols="3" sm="4">
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
              <v-col cols="3" sm="4">
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
              <v-col cols="3" sm="4">
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
              <v-col cols="3" sm="4">
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
              <v-col cols="3" sm="4">
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
              <v-col cols="3" sm="4">
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
          </v-container>
          <v-container>
            <div class="ma-1">
              <v-col class="col-6">
                <v-btn
                  class="mr-4"
                  color="primary"
                  @click="save"
                  :disabled="!valid"
                  >Guardar</v-btn
                >
                <v-btn color="default" @click="back()">Cancelar</v-btn>
              </v-col>
            </div>
          </v-container>
        </v-form>
      </div>
      <Spinner v-if="!loaded" />
    </v-card>
  </v-container>
</template>
<script>
import {
  calculateAmountPlusPercentaje,
  calculateImportWithoutIvaPercent,
  restarNumeros,
  roundTwoDecimals,
  calculatePercentReductionInAmount,
  generateBarCode,
} from "../../helpers/mathHelper";
import GenericService from "../../services/GenericService";
import Spinner from "../../components/Graphics/Spinner";
import Error from "../../components/Error";
import TabBar from "../../components/Generics/TabBar.vue";

export default {
  data: () => ({
    view: "listOfProducts",
    atributosNumericos: [],
    atributosDeTexto: [],
    distribuidores: [],
    propiedades: [],
    marcas: [],
    rubros: [],
    ivasCompra: [],
    ivasVenta: [],
    valid: true,
    object: {
      estado: 1,
      ganancia: 0,
      codigoBarra: "",
      barcode:"",
      ivaComprasObject: { id: 1, nombre: "Iva 21%", porcentaje: 21 },
      ivaVentasObject: { id: 4, nombre: "Iva 21%", porcentaje: 21 },
      editable: false,
    },
    tabs: [
      { id: 1, title: "Lista", route: '/productos' },
      { id: 2, title: "Nuevo", route: '/productos/form/0' },
      { id: 3, title: "Generar Etiqueta", route: '/etiquetas' },
      { id: 4, title: "Modificar precios", route: '/precios' },
    ],
    activeTab: 2,
    filterParams: {
      sucursalId: "",
      productoName: "",
      productoCodigo: "",
      productoCodigoBarras: "",
      productoMarcaName: "",
      productoPrimerAtributoName: "",
      productoSegundoAtributoName: "",
      productoTercerAtributoName: "",
      productoEstado: 1,
      page: 1,
      size: 10,
      totalPages: 0,
    },
    cantidad: [],
    loaded: false,
    tenant: '',
    service: "productos",
    token: localStorage.getItem("token"),
    errorStatus: false,
  }),

  components: {
    Spinner,
    Error,
    TabBar,
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    if (this.$route.params.id && this.$route.params.id > 0) {
      this.getObject(this.$route.params.id);
    } else {
      this.loaded = true;
    }
    this.getOtherModels(0, 100000);
    this.$store.commit("eventual/resetStates");
    this.tenant = this.$route.params.tenant;
    //if (this.loguedUser.perfil > 1) {
    //this.filterParams.sucursalId = this.loguedUser.sucursal.id;
    //}
  },

  methods: {
    getObject(id) {
      GenericService(this.tenant, this.service, this.token)
        .get(id)
        .then((data) => {
          this.object = data.data;
          this.loaded = true;
        });
    },

    getOtherModels(page, size) {
      const services = [
        "marcas",
        "distribuidores",
        "rubros",
        "ivas",
        "propiedades",
        "atributos",
      ];
      services.forEach((service) => {
        GenericService(this.tenant, service, this.token)
          .getAll(page, size)
          .then((data) => {
            switch (service) {
              case "marcas":
                this.marcas = data.data.content;
                break;
              case "distribuidores":
                this.distribuidores = data.data.content;
                break;
              case "rubros":
                this.rubros = data.data.content;
                break;
              case "ivas":
                this.ivasCompra = data.data.content.filter((el) => el.tipo);
                this.ivasVenta = data.data.content.filter((el) => !el.tipo);
                break;
              case "propiedades":
                this.propiedades = data.data.content;
                break;
              default:
                data.data.content.filter((el) => {
                  if (el.valor === undefined || el.valor === null) {
                    this.atributosNumericos.push(el);
                  } else {
                    this.atributosDeTexto.push(el);
                  }
                });
                break;
            }
          });
      });
    },

    newObject() {
      this.$router.push({ name: "productosForm", params: { id: 0 } });
    },

    Getproduct() {
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
    setTabs(tab) {
      //this.activeTab = tab
      console.log(tab);
    },

    calculations() {
      this.object.costoNeto = calculateImportWithoutIvaPercent(
        this.object.costoBruto,
        this.object.ivaComprasObject.porcentaje
      );
      this.object.precioCosto = this.object.costoNeto;
      this.object.ivaCompra = restarNumeros([
        this.object.costoBruto,
        this.object.costoNeto,
      ]);
      this.object.precioSinIva = calculateAmountPlusPercentaje(
        this.object.costoBruto,
        this.object.ganancia
      );
      this.object.precioTotal = calculateAmountPlusPercentaje(
        this.object.precioSinIva,
        this.object.ivaVentasObject.porcentaje
      );
      this.object.ivaVenta = restarNumeros([
        this.object.precioTotal,
        this.object.precioSinIva,
      ]);
    },
    gainCalculations() {
      this.object.ganancia =roundTwoDecimals( (((this.object.precioTotal) / 
                                              (this.object.costoBruto*(((this.object.ivaVentasObject.porcentaje)/100)+1))) -1)*100 )
      
      this.object.precioSinIva = calculatePercentReductionInAmount(
        this.object.precioTotal,
        this.object.ivaVentasObject.porcentaje
      );
      this.object.ivaVenta = roundTwoDecimals(
        restarNumeros([this.object.precioTotal, this.object.precioSinIva])
      );
    },

    generateBarCode() {
      this.object.codigoBarra = generateBarCode();
    },

    checkBarCode(filterParams, barcode) {
      filterParams.productoCodigoBarras = barcode;
      GenericService(this.tenant, this.service, this.token)
        .filter(filterParams)
        .then((data) => {
          if (this.isEmpty(data.data.content)) return;
          this.$errorAlert(
            "El código de barras que ha introducido ya existe en otro producto: " +
              data.data.content[0].nombre
          ).then((data) => {
            if (data.dismiss) {
              this.object.codigoBarra = "";
            }
          });
        });
    },

    isEmpty(array) {
      if (array.length === 0) return true;
      return false;
    },

    save() {
      this.loaded = false;
      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .catch((error) => {
          if (error.response.status == 500) {
            this.errorStatus = true;
            this.loaded = true;
          }
        });
      this.$router.push({ name: "productos" });
    },

    back() {
      this.$router.push({ name: "productos" });
    },
  },
};
</script>
<style>
.active_tab {
  background-color: black;
}
.mt-5 {
  align-content: center;
}
.pa-2 {
  margin: 10px;
}
.tab{
  margin-bottom: 15px;
}
</style>
