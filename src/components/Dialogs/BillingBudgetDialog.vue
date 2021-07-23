<template>
  <v-dialog v-model="$store.state.budgets.dialog">
    <v-card color="var(--main-bg-color)">
      <form @submit.prevent="saveSale()">
        <v-card-title>
          <span class="ml-5"> Seleccione el comprobante a emitir </span>
        </v-card-title>
        <v-card-text>
          <v-container v-if="object">
            <v-row class="ma-5">
              <v-col cols="6">
                <v-text-field
                  v-model="object.cliente.nombre"
                  item-text="razonSocial"
                  required
                  disabled
                  style="width: 100%;"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-autocomplete
                  class="button-ventas comprobante"
                  v-model="object.documentoComercial"
                  :items="documentos"
                  item-text="nombre"
                  placeholder="Seleccione un tipo de comprobante"
                  :return-object="true"
                  required
                  style="width: 100%;"
                ></v-autocomplete>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  class="button-ventas medio-pago"
                  v-model="object.mediosPago[0].nombre"
                  item-text="nombre"
                  required
                  disabled
                  style="width: 100%;"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  class="button-ventas plan-pago"
                  v-model="object.planesPago[0].nombre"
                  item-text="nombre"
                  required
                  disabled
                  style="width: 100%;"
                ></v-text-field>
              </v-col>
              <v-col></v-col>
              <v-col>
                <v-text-field
                  placeholder="Total"
                  type="number"
                  v-model="object.totalVenta"
                  required
                  disabled
                  style="width: 100%;"
                ></v-text-field>
              </v-col>
              <v-col></v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-col cols="12">
            <v-btn class="primary ml-5" type="submit"
              >FACTURAR</v-btn
            >
          </v-col>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>
<script>
import GenericService from "../../services/GenericService";
import VentasService from '../../services/VentasService';
import ReportsService from '../../services/ReportsService';
import axios from 'axios';
import { getInternationalDate, formatDate, formatDateWithoutSlash, getCurrentDate } from '../../helpers/dateHelper'; 
import { addZerosInString } from '../../helpers/stringHelper'; 
import { checkIfInvoice } from "../../helpers/processObjectsHelper";
import { formatFiscalInvoice } from '../../helpers/receiptFormatHelper'

export default {
  props:{
    listennerOfStore: Number
  },
  data() {
    return {
      loguedUser: JSON.parse(localStorage.getItem("userData")),
      tenant: null,
      token: localStorage.getItem("token"),
      object: null,
      documentos: null
    };
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
  },

  watch: {
    listennerOfStore() {
      if(this.listennerOfStore > 0){
        this.object = this.$store.state.budgets.budget;
        this.getComercialDocuments(this.object.cliente.condicionIva.documentos, this.loguedUser.sucursal.condicionIva.documentos);
      }
    }
  },

  methods: {
    getComercialDocuments(clientDocs, businessDocs) {
      let documentos = [];
      for (let i = 0; i < clientDocs.length; i++) {
        businessDocs.forEach((el) => {
          if (clientDocs[i].id == el.id) {
            documentos.push(el);
          }
        });
      }

      const notas = checkIfInvoice(documentos);
      return (this.documentos = notas);
    },

    saveSale() {
      const documento = this.object.documentoComercial;
      if (documento.tipo === true) {
        if (documento.ticket === true) {
          this.saveTicket(documento.nombre);
        } else {
          this.save();
        }
      } else {
        if(documento.presupuesto === true){
          this.$errorAlert("Seleccione un documento que no sea un presupuesto");
        }else{
          this.saveNoFiscal();
        }
      }
    },

    save() {
      const puntoVenta = this.object.puntoVenta.idFiscal;
      const sucursalCuit = this.object.sucursal.cuit;
      const codigoDocumentoComercial = this.object.documentoComercial.codigoDocumento;
      const letraDocumentoComercial = this.object.documentoComercial.letra;
      const nombreDocumentoComercial = this.object.documentoComercial.nombre;
      const clienteCuit = this.object.cliente.cuit;
      const clienteAlicuotaIngresosBrutos = this.object.cliente.alicIngBrutos;
      const productos = this.object.productos;
      const totalVenta = this.object.totalVenta;
      const planPago = this.object.planesPago[0];
      const condVenta = this.checkSaleCondition(planPago);

      let file;
      let fileURL;
      /*** Get last invoice emmited number ***/
      axios
        .get(
          `${process.env.VUE_APP_API_AFIP}/rest_api_afip/obtenerUltimoNumeroAutorizado/${sucursalCuit}/${puntoVenta}/${codigoDocumentoComercial}`
        )
        .then((data) => {
          const numberOfReceipt = parseInt(data.data.responseOfAfip) + 1;
          const dataForCreateInvoice = {
            ptoVentaId: puntoVenta,
            receiptCode: codigoDocumentoComercial,
            clientCuit: clienteCuit,
            percentIngBrutos: clienteAlicuotaIngresosBrutos,
            numberOfReceipt: numberOfReceipt,
            date: getInternationalDate(),
            products: productos,
            totalVenta: totalVenta,
          };

          let invoice = formatFiscalInvoice(letraDocumentoComercial, dataForCreateInvoice);

          /*** Send invoice to AFIP ***/
          axios
            .post(
              `${process.env.VUE_APP_API_AFIP}/rest_api_afip/generarComprobante/${sucursalCuit}`,
              invoice
            )
            .then((data) => {
              const cae = data.data.CAE;
              const dateOfCaeExpiration = data.data.CAEFchVto;
              const barCode =
                sucursalCuit +
                addZerosInString("02", codigoDocumentoComercial) +
                addZerosInString("04", puntoVenta) +
                cae +
                formatDateWithoutSlash(dateOfCaeExpiration);

              this.object.letra = letraDocumentoComercial;
              this.object.numeroCbte = addZerosInString("04", puntoVenta) + "-" + addZerosInString("08", numberOfReceipt);
              this.object.fechaEmision = formatDate(getCurrentDate());
              this.object.fechaVto = formatDate(dateOfCaeExpiration);
              this.object.barCode = barCode;
              this.object.cae = cae;
              this.object.nombreDocumento = nombreDocumentoComercial;
              this.object.condicionVenta = condVenta;
              
              let comprobante = this.object;

              /*** Save receipt in database and print invoice ***/
              if (comprobante.cae) {
                GenericService(this.tenant, "comprobantesFiscales", this.token)
                  .save(comprobante)
                  .then(() => {
                    ReportsService(this.tenant, "ventas", this.token)
                      .onCloseSaleReport(comprobante)
                      .then((res) => {
                        file = new Blob([res["data"]], {
                          type: "application/pdf",
                        });
                        fileURL = URL.createObjectURL(file);
                        window.open(fileURL, "_blank");
                      });
                  })
                  .then(() => {
                    /*** Save stocks modifications ***/
                    this.applyStockModifications(comprobante)
                      .then((data) => {
                        const productsBelowMinimumStock = data[0];
                        const productsWithoutStockOnDefaultDeposit =
                          data[1];
                        const productsOutOfStockAndDeposits = data[2];
                        this.$successAlert("Venta realizada").then(() => {
                          VentasService(
                            this.tenant,
                            this.service,
                            this.token
                          ).checkProductsAndDepositsStatus(
                            productsBelowMinimumStock,
                            productsWithoutStockOnDefaultDeposit,
                            productsOutOfStockAndDeposits
                          );
                        });
                      })
                      .finally(() => {
                        /*** Reset view objects and status ***/
                        this.clear();
                      });
                  });
              } else {
                this.$errorAlert("Tipo de comprobante no disponible");
              }
            })
            .catch((err) => {
              console.log(
                "---------------- ERROR IN AFIP RESPONSE ----------------"
              );
              console.log(err);
            });
        });
    },

    saveNoFiscal() {
      const letraDocumentoComercial = this.object.documentoComercial.letra;
      const nombreDocumentoComercial = this.object.documentoComercial.nombre;
      const puntoVenta = this.object.puntoVenta.idFiscal;
      const planPago = this.object.planesPago[0];
      const condVenta = this.checkSaleCondition(planPago);
      let file;
      let fileURL;

      this.object.letra = letraDocumentoComercial;
      this.object.numeroCbte = addZerosInString("04", puntoVenta) + "-" + addZerosInString("08", this.object.id);
      this.object.fechaEmision = formatDate(getCurrentDate());
      this.object.fechaVto = formatDate(getCurrentDate());
      this.object.nombreDocumento = nombreDocumentoComercial;
      this.object.condicionVenta = condVenta;

      let comprobante = this.object;
      /*** Evaluate required sale form data ***/
      GenericService(this.tenant, "comprobantesFiscales", this.token)
        .save(comprobante)
        .then(() => {
          ReportsService(this.tenant, "ventas", this.token)
            .onCloseSaleReport(comprobante)
            .then((res) => {
              file = new Blob([res["data"]], {
                type: "application/pdf",
              });
              fileURL = URL.createObjectURL(file);
              window.open(fileURL, "_blank");
            })
            .then(() => {
              /*** Save stocks modifications ***/
              this.applyStockModifications(comprobante)
                .then((data) => {
                  const productsBelowMinimumStock = data[0];
                  const productsWithoutStockOnDefaultDeposit = data[1];
                  const productsOutOfStockAndDeposits = data[2];
                  this.$successAlert("Venta realizada").then(() => {
                    VentasService(
                      this.tenant,
                      this.service,
                      this.token
                    ).checkProductsAndDepositsStatus(
                      productsBelowMinimumStock,
                      productsWithoutStockOnDefaultDeposit,
                      productsOutOfStockAndDeposits
                    );
                  });
                })
                .finally(() => {
                  /*** Reset view objects and status ***/
                  this.clear();
                });
            });
        });
        
    },

    async applyStockModifications(comprobante) {
      const filterParam = {
        sucursalId: this.loguedUser.sucursal.id,
        productoName: "",
        productoCodigo: "",
        productoMarcaName: "",
        productoCodigoBarras: "",
        productoPrimerAtributoName: "",
        page: 1,
        size: 100000,
      };
      let productsBelowMinimumStock = [];
      let productsWithoutStockOnDefaultDeposit = [];
      let productsOutOfStockAndDeposits = [];
      let stocks;
      let receiptData = comprobante;
      await GenericService(this.tenant, "stock", this.token)
        .filter(filterParam)
        .then((data) => {
          stocks = data.data.content;
          stocks.forEach((stock) => {
            receiptData.productos.forEach((productInReceipt) => {
              if (stock.producto.id === productInReceipt.id) {
                productInReceipt.checked = true;
                switch (stock.deposito.id) {
                  case this.defaultDeposit.id:
                    stock.cantidad =
                      parseFloat(stock.cantidad) -
                      parseFloat(productInReceipt.cantUnidades);
                    receiptData.productos = receiptData.productos.filter(
                      (el) => el.id !== productInReceipt.id
                    );
                    if (
                      stock.cantidadMinima &&
                      stock.cantidad < Number(stock.cantidadMinima)
                    ) {
                      productsBelowMinimumStock.push(stock);
                    }
                    GenericService(this.tenant, "stock", this.token).save(
                      stock
                    );
                    break;
                  default:
                    stock.cantidad =
                      parseFloat(stock.cantidad) -
                      parseFloat(productInReceipt.cantUnidades);
                    receiptData.productos = receiptData.productos.filter(
                      (el) => el.id !== productInReceipt.id
                    );
                    if (
                      stock.cantidadMinima &&
                      stock.cantidad < Number(stock.cantidadMinima)
                    ) {
                      productsBelowMinimumStock.push(stock);
                    }
                    GenericService(this.tenant, "stock", this.token).save(
                      stock
                    );
                    productsWithoutStockOnDefaultDeposit.push(stock);
                    break;
                }
              }
            });
          });
          const viewCheckedProductsInReceipt = receiptData.productos.filter(
            (el) => !el.checked
          );
          if (viewCheckedProductsInReceipt.length > 0) {
            productsOutOfStockAndDeposits = viewCheckedProductsInReceipt;
          }
        });

      return [
        productsBelowMinimumStock,
        productsWithoutStockOnDefaultDeposit,
        productsOutOfStockAndDeposits,
      ];
    },

    checkSaleCondition(planPago){
      if(planPago.cuotas > 1){
        return true;
      }else{
        return false;
      }
    },

    clear(){
        window.location.reload();
    }
  },
};
</script>
