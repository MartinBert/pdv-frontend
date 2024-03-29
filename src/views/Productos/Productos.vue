<template>
  <v-container
    class="container"
    style="min-width: 98%;
    margin-left:5px;
  "
  >
    <TabBar
     v-if="perfil < 3"
      :tabs="tabs"
      :activeTab="activeTab"
    />
    <v-card>
      <v-form class="mb-0" v-on:click="show = !show">
        <v-row class="m-5">
          <v-col cols="6" v-if="perfil < 3">
            <v-btn class="primary ml-2" @click="getReport()" raised
              >REPORTE</v-btn
            >
            <v-btn
              v-if="loaded"
              class="primary ml-2"
              @click="exportGeneralExcel()"
              raised
              >EXPORTAR EXCEL</v-btn
            >
            <!-- 
          Este servicio corrige los precios de la 
          lista, calculando sus valores basados en los 
          porcentajes de iva compra, iva venta, ganancia 
          y costo bruto del producto, por lo que todos los 
          cálculos se realizan partiendo del costo bruto
          del artículo y no de de su precio final de venta.
          -->
          </v-col>
          <v-col cols="3" v-if="perfil < 3">
            <v-file-input
              class="mt-2"
              dense
              v-model="file"
              placeholder="Importar"
              accept=".xlsx, xls"
              @change="onChange($event)"
            ></v-file-input>
          </v-col>
        </v-row>
      </v-form>
      <ProductosTable
        :items="productos"
        v-on:editItem="edit"
        v-on:deleteItem="deleteItem"
        v-on:add="reactivationOfProduct"
        v-if="loaded"
      />
      <Spinner v-if="!loaded" />
      <DialogStop v-if="!loaded"/>
      <DeleteDialog
        :status="deleteDialogStatus"
        v-on:deleteConfirmation="deleteConfirmation"
      />
    </v-card>
    <template>
      <v-dialog
        v-model="loader"
        hide-overlay
        persistent
        width="400"
        v-if="loaderStatus == false"
      >
        <v-card color="primary" dark>
          <v-card-text>
            Importando productos...
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="loader"
        v-if="loaderStatus == true"
        hide-overlay
        persistent
        width="400"
      >
        <v-card color="primary">
          <v-list-item>
            <v-list-item-content justify="center" align="center">
              <v-icon x-large color="success">{{ this.icon }}</v-icon>
              <v-card-text class="title">¡Importación finalizada!</v-card-text>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-dialog>
    </template>
  </v-container>
</template>
<script>
import DialogStop from "../../components/Dialogs/DialogStop";
import GenericService from "../../services/GenericService";
import ReportsService from "../../services/ReportsService";
import Spinner from "../../components/Graphics/Spinner";
import ProductosTable from "../../components/Tables/ProductosTable";
import DeleteDialog from "../../components/Dialogs/DeleteDialog";
import TabBar from "../../components/Generics/TabBar";

import {
  generateBarCode,
  roundTwoDecimals,
  decimalPercent,
  calculateImportWithoutIvaPercent,
  restarNumeros,
  calculateAmountPlusPercentaje,
} from "../../helpers/mathHelper";
import { exportExcel } from "../../helpers/exportFileHelper";
import XLSX from "xlsx";
export default {
  data: () => ({
    tab:null,
    show: true,
    icon: "mdi-check-circle",
    perfil: "",
    loader: false,
    loaderStatus: false,
    file: null,
    object: null,
    stock: [],
     filterParams: {
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
    productos: [],
    marcas: [],
    distribuidores: [],
    depositos: [],
    rubros: [],
    propiedades: [],
    atributos: [],
    ivas: [],
    estados: [
      { id: 1, text: "Activos" },
      { id: 2, text: "Inactivos" },
    ],
    tabs: [
      { id: 1, title: "Lista", route: '/productos' },
      { id: 2, title: "Nuevo", route: '/productos/form/0' },
      { id: 3, title: "Generar Etiqueta", route: '/etiquetas' },
      { id: 4, title: "Modificar precios", route: '/precios' },
    ],
    activeTab: 1,
    loaded: true,
    tenant: '',
    idObject: "",
    service: "productos",
    token: localStorage.getItem("token"),
    dialogStock: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    checkImportStatus: 0,
    deleteDialogStatus: false,
  }),

  components: {
    Spinner,
    ProductosTable,
    DeleteDialog,
    TabBar,
    DialogStop
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.getOtherModels(0, 100000);
    this.perfil = this.loguedUser.perfil;
  },

  methods: {
    getOtherModels(page, size) {
      const services = [
        "marcas",
        "distribuidores",
        "rubros",
        "propiedades",
        "atributos",
        "ivas",
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

              case "propiedades":
                this.propiedades = data.data.content;
                break;

              case "atributos":
                this.atributos = data.data.content;
                break;

              default:
                this.ivas = data.data.content;
                break;
            }
          });
      });
    },

    edit(id) {
      this.$router.push({ name: "productosForm", params: { id: id } });
    },

    deleteItem(id) {
      this.idObject = id;
      this.deleteDialogStatus = true;
    },

    deleteConfirmation(result) {
      return result ? this.deleteObject() : (this.deleteDialogStatus = false);
    },

    deleteObject() {
      this.dialog = true;
      this.deleteDialogStatus = false;
      GenericService(this.tenant, this.service, this.token)
        .delete(this.idObject)
        .then(() => {
          this.filterObjects();
        })
        .catch(() => {
          this.$errorAlert(
            "El registro se encuentra asociado a otros elementos en el sistema"
          ).then((result) => {
            if (result.isDismissed) {
              this.$questionAlert(
                "Puede desactivar el producto para no verlo en la tabla",
                "Desea hacerlo"
              ).then((result) => {
                if (result.isConfirmed) {
                  GenericService(this.tenant, this.service, this.token)
                  .get(this.idObject)
                  .then(res => {
                    let inactiveProduct = res.data;
                    inactiveProduct.estado = 2;
                    console.log(inactiveProduct);
                    GenericService(this.tenant, this.service, this.token)
                      .save(inactiveProduct)
                      .then(this.refreshPage())
                      .catch((err) => {
                        console.error(err);
                      });
                  })
                }
              });
            }
          });
        });
    },

    reactivationOfProduct(object) {
      this.$questionAlert(
        "Atención, esta acción activará el producto en el sistema",
        "Desea continuar"
      ).then((result) => {
        if (result.isConfirmed) {
          this.loaded = false;
          object.estado = 1;
          GenericService(this.tenant, this.service, this.token)
            .save(object)
            .then(() => {
              this.refreshPage();
            });
        }
      });
    },

    refreshPage(){
      window.location.reload();
    },

    //Load excel
    findFile() {
      this.$refs.uploader.click();
    },

    //Importar productos
    onChange(event) {
      this.loaderStatus = false;
      this.loaded = false;
      this.file = event;
      let excel = [];
      
      let reader = new FileReader();
      reader.onload = (e) => {
        let data = e.target.result;
        let workbook = XLSX.read(data, { type: "binary" });

        let sheet_name_list = workbook.SheetNames;
        sheet_name_list.forEach(function(y) {
          let exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
          console.log(exceljson);
          if (exceljson.length > 0) {
            for (let i = 0; i < exceljson.length; i++) {
              excel.push(exceljson[i]);
            }
          }
        });

        let prod = this.validateImport(excel);
        console.log(prod);
        if (prod.status) {
          GenericService(this.tenant, this.service, this.token)
            .saveAll(prod.data)
            .then(() => {
              console.log(prod.data);
              this.$successAlert("Importación exitosa").then(() => {
                if (this.checkImportStatus > 0) {
                  this.$infoAlert(
                    "Se agregaron nuevos atributos al sistema. Realice nuevamente la importación para asignarlos correctamente"
                  );
                }
                location.reload();
              });
              this.filterObjects();
              this.loaderStatus = true;
              this.loaded = true;
            });
        }
      };
      reader.readAsBinaryString(this.file);
    },

    validateImport(productos) {
      let importacion = {
        status: true,
        data: [],
        message: "",
      };
      productos.forEach((element) => {
        if (
          element.nombre &&
          element.codigoBarra &&
          element.codigoProducto &&
          element.ganancia && 
          element.precioTotal
        ) {
          if (element.codigoBarra == 1) {
            element.codigoBarra = generateBarCode();
          }

          let ivaComp = this.getIva(element.idIvaCompras).porcentaje;
          let ivaVent = this.getIva(element.idIvaVentas).porcentaje;
          let ganancia = element.ganancia / 100;
          let obj = {
            nombre: element.nombre,
            codigoBarra: String(element.codigoBarra),
            codigoProducto: String(element.codigoProducto),
            marca: this.getMarca(element.marca),
            rubro: this.getRubro(element.rubro),
            propiedades: this.getPropiedades(element.propiedades),
            atributos: this.getAtributos(element),
            distribuidores: this.getDistribuidores(element.idDistribuidores),
            ivaComprasObject: this.getIva(element.idIvaCompras),
            ivaVentasObject: this.getIva(element.idIvaVentas),
            precioCosto: roundTwoDecimals(
              element.precioTotal /
                (1 + ganancia) /
                (1 + decimalPercent(ivaVent))
            ),
            costoBruto: roundTwoDecimals(
              element.precioTotal /
                (1 + ganancia) /
                (1 + decimalPercent(ivaVent))
            ),
            costoNeto: roundTwoDecimals(
              element.precioTotal /
                (1 + decimalPercent(ivaVent)) /
                (1 + ganancia) /
                (1 + decimalPercent(ivaComp))
            ),
            ivaCompra: roundTwoDecimals(
              element.precioTotal /
                (1 + ganancia) /
                (1 + decimalPercent(ivaVent)) -
                element.precioTotal /
                  (1 + decimalPercent(ivaVent)) /
                  (1 + ganancia) /
                  (1 + decimalPercent(ivaComp))
            ),
            ganancia: element.ganancia,
            precioSinIva: roundTwoDecimals(
              element.precioTotal / (1 + decimalPercent(ivaVent))
            ),
            ivaVenta: roundTwoDecimals(
              element.precioTotal -
                roundTwoDecimals(
                  element.precioTotal / (1 + decimalPercent(ivaVent))
                )
            ),
            precioTotal: element.precioTotal,
            estado: 1
          };
          importacion.data.push(obj);
        } else {
          importacion.status = false;
          importacion.message = "Faltan datos en el renglón ";
        }
      });
      console.log(productos);
      console.log(importacion);
      return importacion;
      
    },

    getMarca(str) {
      const marca = this.marcas.filter(
        (el) => el.nombre.toLowerCase() === str.toLowerCase()
      )[0];
      if (marca) {
        return marca;
      } else {
        GenericService(this.tenant, "marcas", this.token)
          .save({ nombre: str })
          .then((data) => {
            this.marcas.push(data.data);
            return data.data;
          });
          
      }
    },

    getRubro(str) {
      const rubro = this.rubros.filter(
        (el) => el.nombre.toLowerCase() === str.toLowerCase()
      )[0];
      if (rubro) {
        return rubro;
      } else {
        GenericService(this.tenant, "rubros", this.token)
          .save({ nombre: str })
          .then((data) => {
            this.rubros.push(data.data);
            return data.data;
          });
      }
    },

    getPropiedades(propiedades) {
      if (this.isEmptyString(propiedades)) return null;
      let propiedadesArray = [];
      if (propiedades.length > 1) {
        propiedades = propiedades.split(",");
        propiedades.forEach((el) => {
          this.propiedades.forEach((e) => {
            if (el == e.id) {
              propiedadesArray.push(e);
            }
          });
        });
      } else {
        this.propiedades.forEach((el) => {
          if (el.id == propiedades) {
            propiedadesArray.push(el);
          }
        });
      }
      return propiedadesArray;
    },

    getAtributos(element) {
      const attributes = Object.entries(element).filter(
        (el) => el[0].substring(0, 8) === "atributo"
      );
      if (this.isEmptyArray(attributes)) return null;
      const attributesNames = attributes.map((el) => {
        return el[1];
      });
      let listOfAttributes = [];
      attributesNames.forEach((attributeName) => {
        this.atributos.forEach((attribute) => {
          if (attributeName && attributeName == attribute.valor) {
            listOfAttributes.push(attribute);
          }
          if (attributeName && attributeName == attribute.valorNumerico) {
            listOfAttributes.push(attribute);
          }
        });
      });
      listOfAttributes = [...new Set(listOfAttributes)];
      if (listOfAttributes.length === 0) {
        this.createNewAtributes(attributesNames);
      }
      return listOfAttributes;
    },

    getIva(id) {
      return this.ivas.filter((el) => el.id === id)[0];
    },

    getDistribuidores(distribuidores) {
      if (distribuidores.length > 1) {
        distribuidores = distribuidores.split(",");
        let distribuidoresArray = [];

        distribuidores.forEach((el) => {
          this.distribuidores.forEach((e) => {
            if (el == e.id) {
              distribuidoresArray.push(e);
            }
          });
        });
        return distribuidoresArray;
      } else {
        return this.distribuidores.filter((el) => el.id === distribuidores);
      }
    },

    getReport() {
      ReportsService(this.tenant, this.service, this.token)
        .listAllProducts()
        .then((res) => {
          let file = new Blob([res["data"]], { type: "application/pdf" });
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

    createNewAtributes(atributeNames) {
      atributeNames.forEach((el) => {
        let obj = {
          valor: null,
          valorNumerico: null,
        };
        if (el && typeof el === "string") {
          obj.valor = el;
        } else {
          if (el) {
            obj.valorNumerico = el;
          }
        }
        GenericService(this.tenant, "atributos", this.token)
          .save(obj)
          .then((data) => {
            this.atributos.push(data.data);
          });
      });
      this.checkImportStatus += 1;
    },

    changePage(data) {
      this.filterParams.page = data;
      this.filterObjects();
    },

    checkProductInList(data) {
      this.productos.forEach((product) => {
        if (product.id === data.id) {
          if (product.selected) {
            product.selected = false;
          } else {
            product.selected = true;
          }
        }
      });
    },

    isEmptyString(str) {
      if (str === undefined || str === null) return true;
      return false;
    },

    isEmptyArray(array) {
      if (array.length === 0) return true;
      return false;
    },

    async exportGeneralExcel() {
      this.loaded = false;
      const headers = [
        "NOMBRE",
        "CODIGO DE PRODUCTO",
        "CODIGO DE BARRAS",
        "DISTRIBUIDORES",
        "MARCA",
        "RUBRO",
        "PROPIEDADES",
        "ATRIBUTOS",
        "ALICUOTA IVA COMPRAS",
        "ALICUOTA IVA VENTAS",
        "COSTO BRUTO",
        "COSTO NETO",
        "IMPORTE DE IVA COMPRAS",
        "PORCENTAJE DE GANANCIA",
        "PRECIO SIN IVA",
        "IMPORTE DE IVA VENTAS",
        "PRECIO TOTAL",
      ];
      const data = await this.setDataToExcel();
      exportExcel(headers, data);
      this.loaded = true;
    },

    async setDataToExcel() {
      let dataForExcel = [];
      let filters = {
        productoName: "",
        productoCodigo: "",
        productoCodigoBarras: "",
        productoMarcaName: "",
        productoPrimerAtributoName: "",
        productoSegundoAtributoName: "",
        productoTercerAtributoName: "",
        productoEstado: 1,
        page: 1,
        size: 100000,
        totalPages: 0,
      };
      await GenericService(this.tenant, this.service, this.token)
        .filter(filters)
        .then((data) => {
          let products = data.data.content;
          products.forEach((el) => {
            el = this.formatForExcel(el);
            dataForExcel.push(el);
          });
        });
      return dataForExcel;
    },

    formatForExcel(product) {
      if (product.marca) {
        product.marca = product.marca.nombre;
      }
      if (product.rubro) {
        product.rubro = product.rubro.nombre;
      }
      if (product.atributos) {
        product.atributos = product.atributos.reduce((acc, el) => {
          if (el.valor) {
            acc = acc + el.valor + ",";
            return acc;
          } else {
            acc = acc + el.valorNumerico + ",";
            return acc;
          }
        }, "");
      }
      if (product.distribuidores) {
        product.distribuidores = product.distribuidores.reduce(
          (acc, el) => acc + el.razonSocial + ",",
          ""
        );
      }
      if (product.propiedades) {
        product.propiedades = product.propiedades.reduce(
          (acc, el) => acc + el.nombre + ",",
          ""
        );
      }
      product.ivaComprasObject = product.ivaComprasObject.porcentaje;
      product.ivaVentasObject = product.ivaVentasObject.porcentaje;
      return product;
    },

    /******************************************************************************************************/
    /* ALL FUNCTIONS TO APPLY CORRECTIONS TO THE PRICE LIST ----------------------------------------------*/
    /******************************************************************************************************/
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

    calculations(object) {
      object.costoNeto = calculateImportWithoutIvaPercent(
        object.costoBruto,
        object.ivaComprasObject.porcentaje
      );
      object.precioCosto = object.costoNeto;
      object.ivaCompra = restarNumeros([object.costoBruto, object.costoNeto]);
      object.precioSinIva = calculateAmountPlusPercentaje(
        object.costoBruto,
        object.ganancia
      );
      object.precioTotal = calculateAmountPlusPercentaje(
        object.precioSinIva,
        object.ivaVentasObject.porcentaje
      );
      object.ivaVenta = restarNumeros([
        object.precioTotal,
        object.precioSinIva,
      ]);

      return object;
    },
  },
};
</script>
<style>
.active_tab {
  background-color: black;
}
.filtros {
  margin-right: 20px;
}
</style>
