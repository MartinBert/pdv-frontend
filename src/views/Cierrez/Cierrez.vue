
<template>
  <v-container style="min-width: 97%;">
    <TabBar :tabs="tabs" :activeTab="activeTab" />
    <v-card min-width="100%">
      <v-form class="mb-3" v-if="loaded">
        <v-row>
          <v-col cols="1">
            <v-btn class="primary" @click="generateZClosure()" raised
              >Realizar cierre z diario</v-btn
            >
          </v-col>
          <v-col></v-col>
          <v-col cols="3">
            <v-text-field
              v-model="filterParams.marcaName"
              v-on:input="filterObjects()"
              dense
              outlined
              rounded
              class="text-left"
              placeholder="Búsqueda"
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
      <CierrezTable
        :items="cierres"
        v-on:seeDetails="seeDetails"
        v-on:print="print"
        v-on:deleteItem="deleteItem"
        v-if="loaded"
      />
    </v-card>

    <Spinner v-if="!loaded" />
    <DeleteDialog
      :status="deleteDialogStatus"
      v-on:deleteConfirmation="deleteConfirmation"
    />
    <CierrezDetails />
    <PrintSelectionDialog
      :status="printDialogStatus"
      v-on:close="closePrintSelectionDialog"
      v-on:printSpecification="printSpecification"
    />
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import ReportsService from "../../services/ReportsService";
import VentasService from "../../services/VentasService";
import CierrezTable from "../../components/Tables/CierrezTable";
import Spinner from "../../components/Graphics/Spinner";
import TabBar from "../../components/Generics/TabBar";
import DeleteDialog from "../../components/Dialogs/DeleteDialog";
import PrintSelectionDialog from "../../components/Dialogs/PrintSelectionDialog";
import CierrezDetails from "../../components/Details/CierrezDetails.vue";
import { getCurrentDate, formatDate } from "../../helpers/dateHelper";
import { questionAlert } from "../../helpers/alerts";
import {
  roundTwoDecimals,
  calculatePercentReductionInAmount,
  sumarNumeros,
} from "../../helpers/mathHelper";
export default {
  data: () => ({
    cierres: [],
    comprobantes: [],
    file: null,
    filterParams: {
      sucursalId: "",
      date: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    invoiceFilterParams: {
      sucursalId: "",
      fechaEmision: "",
      page: 1,
      size: 100000,
    },
    tabs: [
      { id: 1, title: "Comprobantes Emitidos", route: "/ventas/list" },
      { id: 2, title: "Presupuesto", route: "/ventas/presupuesto" },
      { id: 3, title: "Cierre de ventas Diario", route: "/ventas/cierrez" },
    ],
    activeTab: 3,
    objectToPrint: null,
    savedMedioDetalles: [],
    printDialogStatus: false,
    loaded: false,
    tenant: "",
    service: "cierres_z",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
  }),

  components: {
    CierrezTable,
    Spinner,
    DeleteDialog,
    CierrezDetails,
    PrintSelectionDialog,
    TabBar,
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    if (this.loguedUser.perfil > 1) {
      this.filterParams.sucursalId = this.loguedUser.sucursal.id;
      this.invoiceFilterParams.sucursalId = this.loguedUser.sucursal.id;
    }
    this.filterObjects();
  },
  methods: {
    filterObjects(page) {
      if (page) this.filterParams.page = page;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.cierres = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },

    generateZClosure() {
      this.loaded = false;
      this.invoiceFilterParams.fechaEmision = formatDate(getCurrentDate());
      VentasService(this.tenant, "ventas", this.token)
        .getUniqueDateSales(this.invoiceFilterParams)
        .then((data) => {
          this.comprobantes = data.data.content;
          this.closeOrCancelZ();
        });
    },

    async closeOrCancelZ() {
      questionAlert(
        "Este proceso realizará el cierre z diario",
        "Desea continuar"
      ).then((result) => {
        this.comprobantes.forEach((comprobante) => {
          comprobante.cerradoEnCierreZ = true;
        });
        const total = this.comprobantes.reduce(
          (acc, el) => acc + roundTwoDecimals(parseFloat(el.totalVenta)),
          0
        );
        let iva21 = 0;
        let iva10 = 0;
        let iva27 = 0;
        let mediosPagoDetalle = [];
        this.comprobantes.forEach((comprobante) => {
          const totalIva21 = comprobante.productoDescription.reduce(
            (acc, producto) => {
              if (producto.saleIvaPercent == 21) {
                if (
                  producto.discountPercent > 0 &&
                  producto.surchargePercent > 0
                ) {
                  const salePriceWithDiscountAndSurcharge =
                    producto.salePrice +
                    producto.surchargeAmount -
                    producto.discountAmount;
                  acc +=
                    salePriceWithDiscountAndSurcharge -
                    calculatePercentReductionInAmount(
                      salePriceWithDiscountAndSurcharge,
                      21
                    );
                } else if (producto.discountPercent > 0) {
                  const salePriceWithDiscount =
                    producto.salePrice - producto.discountAmount;
                  acc +=
                    salePriceWithDiscount -
                    calculatePercentReductionInAmount(
                      salePriceWithDiscount,
                      21
                    );
                } else if (producto.surchargePercent > 0) {
                  const salePriceWithSurcharge =
                    producto.salePrice + producto.surchargeAmount;
                  acc +=
                    salePriceWithSurcharge -
                    calculatePercentReductionInAmount(
                      salePriceWithSurcharge,
                      21
                    );
                } else {
                  acc += producto.saleIvaAmount;
                }
              }
              return acc;
            },
            0
          );
          const totalIva10 = comprobante.productoDescription.reduce(
            (acc, producto) => {
              if (producto.saleIvaPercent == 10.5) {
                if (
                  producto.discountPercent > 0 &&
                  producto.surchargePercent > 0
                ) {
                  const salePriceWithDiscountAndSurcharge =
                    producto.salePrice +
                    producto.surchargeAmount -
                    producto.discountAmount;
                  acc +=
                    salePriceWithDiscountAndSurcharge -
                    calculatePercentReductionInAmount(
                      salePriceWithDiscountAndSurcharge,
                      10.5
                    );
                } else if (producto.discountPercent > 0) {
                  const salePriceWithDiscount =
                    producto.salePrice - producto.discountAmount;
                  acc +=
                    salePriceWithDiscount -
                    calculatePercentReductionInAmount(
                      salePriceWithDiscount,
                      10.5
                    );
                } else if (producto.surchargePercent > 0) {
                  const salePriceWithSurcharge =
                    producto.salePrice + producto.surchargeAmount;
                  acc +=
                    salePriceWithSurcharge -
                    calculatePercentReductionInAmount(
                      salePriceWithSurcharge,
                      10.5
                    );
                } else {
                  acc += producto.saleIvaAmount;
                }
              }
              return acc;
            },
            0
          );
          const totalIva27 = comprobante.productoDescription.reduce(
            (acc, producto) => {
              if (producto.saleIvaPercent == 27) {
                if (
                  producto.discountPercent > 0 &&
                  producto.surchargePercent > 0
                ) {
                  const salePriceWithDiscountAndSurcharge =
                    producto.salePrice +
                    producto.surchargeAmount -
                    producto.discountAmount;
                  acc +=
                    salePriceWithDiscountAndSurcharge -
                    calculatePercentReductionInAmount(
                      salePriceWithDiscountAndSurcharge,
                      27
                    );
                } else if (producto.discountPercent > 0) {
                  const salePriceWithDiscount =
                    producto.salePrice - producto.discountAmount;
                  acc +=
                    salePriceWithDiscount -
                    calculatePercentReductionInAmount(
                      salePriceWithDiscount,
                      27
                    );
                } else if (producto.surchargePercent > 0) {
                  const salePriceWithSurcharge =
                    producto.salePrice + producto.surchargeAmount;
                  acc +=
                    salePriceWithSurcharge -
                    calculatePercentReductionInAmount(
                      salePriceWithSurcharge,
                      27
                    );
                } else {
                  acc += producto.saleIvaAmount;
                }
              }
              return acc;
            },
            0
          );
          if (mediosPagoDetalle.length > 0) {
            let previousRegisterPaymenthMethod = [];
            comprobante.mediosPago.forEach((comprobanteMedio) => {
              mediosPagoDetalle.forEach((medioDetalle) => {
                if (medioDetalle.medioPago.id === comprobanteMedio.id) {
                  previousRegisterPaymenthMethod.push(medioDetalle);
                }
              });
            });
            if (previousRegisterPaymenthMethod.length > 0) {
              previousRegisterPaymenthMethod.forEach((medioDetalle) => {
                medioDetalle.total += Number(comprobante.totalVenta);
                medioDetalle.importeTotalIva += Number(
                  sumarNumeros([totalIva21, totalIva10, totalIva27])
                );
                medioDetalle.totalIva21 += Number(totalIva21);
                medioDetalle.totalIva10 += Number(totalIva10);
                medioDetalle.totalIva27 += Number(totalIva27);
                medioDetalle.cantidadComprobantes += 1;
              });
            } else {
              comprobante.mediosPago.forEach((comprobanteMedio) => {
                const obj = {
                  medioPago: comprobanteMedio,
                  total: Number(comprobante.totalVenta),
                  importeTotalIva: sumarNumeros([
                    totalIva21,
                    totalIva10,
                    totalIva27,
                  ]),
                  totalIva21: Number(totalIva21),
                  totalIva10: Number(totalIva10),
                  totalIva27: Number(totalIva27),
                  cantidadComprobantes: 1
                };
                mediosPagoDetalle.push(obj);
              });
            }
          } else {
            comprobante.mediosPago.forEach((comprobanteMedio) => {
              const obj = {
                medioPago: comprobanteMedio,
                total: comprobante.totalVenta,
                importeTotalIva: sumarNumeros([
                  totalIva21,
                  totalIva10,
                  totalIva27,
                ]),
                totalIva21,
                totalIva10,
                totalIva27,
                cantidadComprobantes: 1
              };
              mediosPagoDetalle.push(obj);
            });
          }
          return (
            (iva21 += totalIva21), (iva10 += totalIva10), (iva27 += totalIva27)
          );
        });
        this.savePaymentMethodDetails(mediosPagoDetalle);
        setTimeout(() => {
          if (result.isConfirmed) {
            const cierreZ = {
              sucursal: this.loguedUser.sucursal,
              empresa: this.loguedUser.empresa,
              comprobantesFiscales: this.comprobantes,
              total,
              cantidadVentas: parseInt(this.comprobantes.length),
              detalleMediosPago: this.savedMedioDetalles,
              totalSumatoriaIva: sumarNumeros([iva21, iva10, iva27]),
              totalIva21: iva21,
              totalIva10: iva10,
              totalIva27: iva27,
              fecha: new Date(),
            };
            GenericService(this.tenant, this.service, this.token)
              .save(cierreZ)
              .then(() => {
                this.filterObjects();
              });
            this.loaded = true;
          } else {
            this.comprobantes = [];
            this.loaded = true;
          }
        }, 1000);
      });
    },

    savePaymentMethodDetails(mediosPagoDetalle) {
      try {
        mediosPagoDetalle.forEach((medioPagoDetalle) => {
          GenericService(this.tenant, "mediosPagoDetalle", this.token)
            .save(medioPagoDetalle)
            .then((data) => {
              this.savedMedioDetalles.push(data.data);
            });
        });
      } catch (err) {
        console.error(err);
      }
    },

    seeDetails(comprobantes) {
      this.$store.commit("details/mutateDialog");
      this.$store.commit("details/addObjectsToDetail", comprobantes);
    },

    print(object) {
      this.objectToPrint = object;
      this.printDialogStatus = true;
    },

    printSpecification(specification) {
      return this.printZClosure(specification);
    },

    printZClosure(specification) {
      ReportsService(this.tenant, "cierres_z", this.token)
        .printZClosure(this.objectToPrint, specification)
        .then((res) => {
          let file = new Blob([res["data"]], {
            type: "application/pdf",
          });
          let fileURL = URL.createObjectURL(file);
          window.open(fileURL, "_blank");
        });
    },

    deleteItem(id) {
      this.idObjet = id;
      this.deleteDialogStatus = true;
    },

    deleteConfirmation(result) {
      return result ? this.deleteObject() : (this.deleteDialogStatus = false);
    },

    deleteObject() {
      this.deleteDialogStatus = false;
      GenericService(this.tenant, this.service, this.token)
        .delete(this.idObjet)
        .then(() => {
          this.filterObjects();
        })
        .catch(() => {
          this.$errorAlert(
            "El registro se encuentra asociado a otros elementos en el sistema"
          );
        });
    },

    setActiveTabComponent(id) {
      this.activeTab = id;
    },

    closePrintSelectionDialog() {
      this.printDialogStatus = false;
    },
  },
};
</script>
