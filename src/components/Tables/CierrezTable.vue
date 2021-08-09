<template>
  <v-container style="min-width: 98%;">
    <v-form class="mb-3" v-if="loaded">
      <v-row>
        <v-col cols="1">
          <v-btn class="primary" @click="generateZClosure()" raised
            >Realizar cierre ventas diario</v-btn
          >
        </v-col>
        <v-col></v-col>
        <v-col cols="3">
          <v-text-field
            v-model="search"
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
    <v-data-table class="elevation-6" :headers="headers" :items="cierres" :search="search"  hide-default-footer>
      <template v-slot:[`item.acciones`]="{ item }">
        <Detail
          :objectsArray="item.comprobantesFiscales"
          v-on:seeDetails="seeDetails"
        />
        <Print :object="item" v-on:print="print" class="ml-1" />
        <Delete :itemId="item.id" v-on:deleteItem="deleteItem" class="ml-1" />
      </template>
    </v-data-table>
    <Pagination
      :page="filterParams.page"
      :totalPages="filterParams.totalPages"
      :totalVisible="7"
      v-on:changePage="filterObjects"
    />
  </v-container>
</template>
<script>
import VentasService from "../../services/VentasService";
import { getCurrentDate, formatDate } from "../../helpers/dateHelper";
import Pagination from "../Pagination";
import GenericService from "../../services/GenericService";
import Print from "../Buttons/Print";
import Detail from "../Buttons/Detail";
import Delete from "../Buttons/Delete";
import { questionAlert } from "../../helpers/alerts";
import {
  roundTwoDecimals,
  calculatePercentReductionInAmount,
  sumarNumeros,
} from "../../helpers/mathHelper";
export default {
  data: () => ({
    search:"",
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
    headers: [
      { text: "Fecha", value: "fecha" },
      { text: "Numero de Comprobante", value: "id" },
      { text: "Acciones", value: "acciones", sortable: false },
    ],
  }),
  components: {
    Detail,
    Print,
    Delete,
    Pagination,
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
      console.log(this.cierres);
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
    seeDetails(object) {
      this.$emit("seeDetails", object);
    },
    print(object) {
      this.$emit("print", object);
    },
    deleteItem(itemId) {
      this.$emit("deleteItem", itemId);
    },
  },
};
</script>
