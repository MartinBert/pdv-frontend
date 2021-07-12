<template>
  <v-container
    style="min-width: 98%;
    margin-left:1px;
  "
  >
    <TabBar :tabs="tabs" :activeTab="activeTab" class="tab" />
    <v-card min-width="100%">
      <v-row>
        <v-col cols="12">
          <v-data-table
            style="background-color: transparent"
            ref="tableOfProducts"
            :headers="headers"
            :items="productos"
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
export default {
  data: () => ({
    productos: [],
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
  },

  components: {
    Pagination,
    TabBar,
    Add,
    Checked,
  },

  methods: {
    filterObjects(page) {
      if (page) this.filterParams.page = page;
      if (this.loguedUser.perfil > 1) {
        this.filterParams.sucursalId = this.loguedUser.sucursal.id;
      }
      GenericService(this.tenant, "productos", this.token)
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
.tab {
  margin-bottom: 30px;
}

</style>
