<template>
  <v-container
    style="min-width: 99%;
    margin-left:5px;
  "
  >
    <TabBar :tabs="tabs" :activeTab="activeTab" style="margin-bottom:15px"/>
    <v-card min-width="100%">
      <v-row style="justify-content: center;" class="mt-1">
      <v-col cols="2">
        <v-text-field
          v-model="filterParams.productoName"
          v-on:input="filterObjects()"
          dense
          outlined
          rounded
          class="text-left"
          label="Nombre de producto"
          append-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field
          v-model="filterParams.productoCodigo"
          v-on:input="filterObjects()"
          dense
          outlined
          rounded
          class="text-left"
          label="Codigo de producto"
          append-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field
          v-model="filterParams.productoCodigoBarras"
          v-on:input="filterObjects()"
          dense
          outlined
          rounded
          class="text-left"
          label="Codigo de barras"
          append-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field
          v-model="filterParams.productoMarcaName"
          v-on:input="filterObjects()"
          dense
          outlined
          rounded
          class="text-left"
          label="Marca"
          append-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field
          v-model="filterParams.productoPrimerAtributoName"
          v-on:input="filterObjects()"
          dense
          outlined
          rounded
          class="text-left"
          label="Atributo"
          append-icon="mdi-magnify"
        />
      </v-col>
    </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table
            class="elevation-6"
            style="background-color: transparent"
            ref="tableOfProducts"
            :headers="headers"
            :items="productos"
            hide-default-footer
          >
            <template v-slot:[`item.acciones`]="{ item }">
              <Add :object="item" v-if="!item.selected" v-on:add="selectItem" />
              <Checked
                :object="item"
                v-if="item.selected"
                v-on:uncheck="uncheckItem"
              />
            </template>
          </v-data-table>
          <Pagination
            :page="filterParams.page"
            :totalPages="filterParams.totalPages"
            :totalVisible="7"
            v-on:changePage="filterObjects"
          />
        </v-col>
        <v-row style="margin:auto">
          <v-col cols="12">
            <div class="horizontalSeparator"></div>
          </v-col>
        </v-row>
        <v-col cols="12">
          <v-row>
            <v-col cols="12">
              <h2
                style="text-align:center;
               margin-top:0;
              "
              >
                Indique la cantidad de etiquetas a imprimir en cada caso
              </h2>
            </v-col>
            <v-col>
              <v-simple-table
                style="background-color: transparent"
                height="525"
              >
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Atributos</th>
                      <th>Marca</th>
                      <th>Código de barras</th>
                      <th>Código de producto</th>
                      <th>Cantidad</th>
                    </tr>
                  </thead>
                  <tbody
                    v-for="producto in $store.state.productos.products"
                    :key="producto.id"
                  >
                    <tr>
                      <td>{{ producto.nombre }}</td>
                      <td>{{ setAtributesValues(producto.atributos) }}</td>
                      <td>{{ producto.marca.nombre }}</td>
                      <td>{{ producto.codigoBarra }}</td>
                      <td>{{ producto.codigoProducto }}</td>
                      <td>
                        <v-text-field
                          autocomplete="off"
                          type="number"
                          counter="3"
                          maxlength="3"
                          id="inputQuantity"
                          @input="setQuantity(producto, $event)"
                        />
                      </td>
                      <td>
                        <a title="Agregar"
                          ><img
                            src="/../../images/icons/delete.svg"
                            @click="uncheckItem(producto)"
                            width="30"
                            height="30"
                        /></a>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center">
          <v-btn class="primary" @click="printLabels(labelList)"
            >IMPRIMIR ETIQUETAS</v-btn
          >
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<script>
import ReportsService from "../../services/ReportsService";
import Pagination from "../../components/Pagination";
import GenericService from "../../services/GenericService";
import TabBar from "../../components/Generics/TabBar";
import Add from "../../components/Buttons/Add";
import Checked from "../../components/Buttons/Checked";
import {printBarCodes} from "../../services/ImpresionService";
export default {
  data: () => ({
    productos: [],
    valorPrint:"",
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
      impresoras:[]
    },
    tabs: [
      { id: 1, title: "Lista", route: "/productos" },
      { id: 2, title: "Nuevo", route: "/productos/form/0" },
      { id: 3, title: "Generar Etiqueta", route: "/etiquetas" },
      { id: 4, title: "Modificar precios", route: "/precios" },
    ],
    activeTab: 3,
    loaded: false,
    idObject: "",
    service: "productos",
    dialogStock: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    token: localStorage.getItem("token"),
    tenant: "",
    checkImportStatus: 0,
    deleteDialogStatus: false,
    labelList: [],
    headers: [
      { text: "Nombre", value: "nombre" },
      { text: "Atributos", value: "atributos[0].valor" },
      { text: "Marca", value: "marca.nombre" },
      { text: "Codigo de Barra", value: "codigoBarra" },
      { text: "Codigo de Producto", value: "codigoProducto" },
      { text: "Acciones", value: "acciones", sortable: false },
    ],
    headers1: [
      { text: "Nombre" },
      { text: "Atributos" },
      { text: "Marca" },
      { text: "Codigo de Barra" },
      { text: "Codigo de Producto" },
      { text: "Cantidad", value: "cantidad" },
    ],
  }),

  mounted() {
    this.tenant = this.$route.params.tenant;
    if (this.loguedUser.perfil > 1) {
      this.filterParams.sucursalId = this.loguedUser.sucursal.id;
    }
    this.filterObjects();
    this.getImpresoras();
  },

  components: {
    Pagination,
    TabBar,
    Add,
    Checked,
  },

  methods: {
    getImpresoras(){
      let sucursalId;
      if (this.loguedUser.perfil > 1) {
        sucursalId = this.loguedUser.sucursal.id;
      }

      const impresoraFilter = {
        sucursalId: sucursalId,
        valor: "",
        nombreImpresora: "",
        impresoraPredeterminada: true,
        page: 1,
        size: 100000
      };

      GenericService(this.tenant, "impresoras", this.token)
      .filter(impresoraFilter)
      .then((data) => {

        this.impresoras = data.data.content;
        this.impresoras.forEach(print => {
          if(print.impresoraPredeterminada == true){
            this.defaultPrint = true;
            this.printName = print.nombreImpresora;
            this.valorPrint = print.valor
          }
        });
      });
    },
     filterObjects(page) {
      if (page) this.filterParams.page = page;
      if (this.loguedUser.perfil > 1) {
        this.filterParams.sucursalId = this.loguedUser.sucursal.id;
      }
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          const productsOfGlobalStore = this.$store.state.productos.products;
          data.data.content.forEach((product) => {
            productsOfGlobalStore.forEach((productOfGlobalStore) => {
              if (product.id === productOfGlobalStore.id) {
                product.selected = true;
              }
            });
          });
          this.productos = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },
    selectItem(object) {
      this.$store.commit("productos/addProductsToList", object);
      this.filterObjects();
    },

    uncheckItem(object) {
      this.$store.commit("productos/removeProductsToList", object.id);
      this.filterObjects();
    },

    setQuantity(producto, $event) {
      if ($event !== "") {
        if ($event < 0) $event = 0;
        if ($event.length > 3) $event = $event.slice(0, 3);
        this.labelList = this.labelList.filter(
          (el) => el.codigoBarra !== producto.codigoBarra
        );
        producto.attributes = this.setAtributesValues(producto.atributos);
        const labelList = Array(parseInt($event)).fill({
          nombre: producto.nombre,
          codigoBarra: producto.codigoBarra,
          attributes: producto.attributes,
        });
        labelList.forEach((el) => {
          this.labelList.push(el);
        });
      } else {
        return;
      }
    },

    printLabels(labelList) {
      printBarCodes(labelList,this.printName,this.valorPrint);
      ReportsService(this.tenant, "productos", this.token)
        .labels(labelList)
        .then((res) => {
          let file = new Blob([res["data"]], {
            type: "application/pdf",
          });
          let fileURL = URL.createObjectURL(file);
          window.open(fileURL, "_blank");
        });
    },

    setAtributesValues(atributes) {
      let str = atributes.reduce((acc, element) => {
        if (element.valor) {
          return acc + element.valor + ",";
        } else {
          return acc + element.valorNumerico.toString() + ",";
        }
      }, "");

      return str;
    },
  },
};
</script>
<style>
</style>
