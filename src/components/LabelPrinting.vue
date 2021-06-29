<template>
  <v-container style="min-width: 100%">
    <v-row>
      <v-col cols="12">
        <v-data-table
          style="background-color: transparent"
          ref="tableOfProducts"
          :headers="headers"
          :items="productos"
        >
          <template v-slot:[`item.acciones`]="{ item }">
            <a title="Agregar" v-if="!item.selected"
              ><img
                src="/../../images/icons/add.svg"
                @click="addProductToTagsList(item)"
                width="30"
                height="30"
            /></a>
            <a title="Quitar" v-if="item.selected"
              ><img
                src="/../../images/icons/success.svg"
                @click="deleteLine(item)"
                width="30"
                height="30"
            /></a>
          </template>
        </v-data-table>
        <Pagination
          :page="page"
          :totalPages="totalPages"
          :totalVisible="totalVisible"
          v-on:changePage="changePage"
        />
      </v-col>
      <v-row>
        <v-col>
          <div class="horizontalSeparator"></div>
        </v-col>
      </v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <h2>Indique la cantidad de etiquetas a imprimir en cada caso</h2>
          </v-col>
          <v-col>
            <v-simple-table style="background-color: transparent" height="525">
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
                          @click="deleteLine(producto)"
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
  </v-container>
</template>
<script>
import ReportsService from "../services/ReportsService";
import Pagination from "./Pagination";
import GenericService from "../services/GenericService";
export default {
  name: "LabelPrinting",
  props: {
    productos: Array,
    page: Number,
    totalVisible: Number,
    totalPages: Number,
    tenant: String,
    token: String,
  },
  data: () => ({
    filterParams: {
      sucursalId: "",
      productoName: "",
      productoCodigo: "",
      productoCodigoBarras: "",
      productoMarcaName: "",
      productoPrimerAtributoName: "",
      productoSegundoAtributoName: "",
      productoTercerAtributoName: "",
      productoEstado: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    idObject: "",
    service: "productos",
    dialogStock: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    checkImportStatus: 0,
    deleteDialogStatus: false,
    labelList: [],
    labelFormats: {
      labelWithoutPrice: "label_image_not_selected",
      labelWithAttributes: "label_image_not_selected",
      labelWithPrice: "label_image_not_selected",
      labelOnlyBarCode: "label_image_not_selected",
    },
    headers: [
      { text: "Nombre", value: "nombre" },
      { text: "Atributos", value: "atributos[0].valor" },
      { text: "Marca", value: "marca.nombre" },
      { text: "Codigo de Barra", value: "codigoBarra" },
      { text: "Codigo de Producto", value: "codigoProducto" },
      { text: "Acciones", value: "acciones" },
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
    this.filterObjects();
  },
  components: {
    Pagination,
  },
  methods: {
    filterObjects(page) {
      if (page) this.filterParams.page = page;
      if (this.estadoSelecionado.id > 1) {
        this.filterParams.productoEstado = 2;
      } else {
        this.filterParams.productoEstado = 0;
      }
      if (this.loguedUser.perfil > 1) {
        this.filterParams.sucursalId = this.loguedUser.sucursal.id;
      }
      GenericService(this.tenant, "productos", this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.productos = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },
    changePage(page) {
      this.$emit("changePage", page);
    },
    addProductToTagsList(producto) {
      this.$store.commit("productos/addProductsToList", producto);
      this.$emit("checkProduct", producto);
      this.$refs.tableOfProducts.$forceUpdate();
    },
    deleteLine(producto) {
      this.$store.commit("productos/removeProductsToList", producto.id);
      this.labelList = this.labelList.filter(
        (el) => el.codigoBarra !== producto.codigoBarra
      );
      this.$emit("checkProduct", producto);
      this.$refs.tableOfProducts.$forceUpdate();
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
    getTypeClass(typeLabelFormat) {
      const selected = "label_image_selected";
      const notSelected = "label_image_not_selected";

      switch (typeLabelFormat) {
        case "labelWithoutPrice":
          if (this.labelFormats.labelWithoutPrice === selected) {
            this.labelFormats.labelWithoutPrice = notSelected;
          } else {
            this.labelFormats.labelWithAttributes = notSelected;
            this.labelFormats.labelWithPrice = notSelected;
            this.labelFormats.labelOnlyBarCode = notSelected;
            this.labelFormats.labelWithoutPrice = selected;
          }
          break;

        case "labelWithAttributes":
          if (this.labelFormats.labelWithAttributes === selected) {
            this.labelFormats.labelWithAttributes = notSelected;
          } else {
            this.labelFormats.labelWithoutPrice = notSelected;
            this.labelFormats.labelWithPrice = notSelected;
            this.labelFormats.labelOnlyBarCode = notSelected;
            this.labelFormats.labelWithAttributes = selected;
          }
          break;

        case "labelWithPrice":
          if (this.labelFormats.labelWithPrice === selected) {
            this.labelFormats.labelWithPrice = notSelected;
          } else {
            this.labelFormats.labelWithoutPrice = notSelected;
            this.labelFormats.labelWithAttributes = notSelected;
            this.labelFormats.labelOnlyBarCode = notSelected;
            this.labelFormats.labelWithPrice = selected;
          }
          break;

        default:
          if (this.labelFormats.labelOnlyBarCode === selected) {
            this.labelFormats.labelOnlyBarCode = notSelected;
          } else {
            this.labelFormats.labelWithoutPrice = notSelected;
            this.labelFormats.labelWithAttributes = notSelected;
            this.labelFormats.labelWithPrice = notSelected;
            this.labelFormats.labelOnlyBarCode = selected;
          }
          break;
      }
    },
  },
};
</script>
