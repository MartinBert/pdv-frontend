<template>
  <v-dialog v-model="$store.state.budgets.dialog">
    <v-card color="var(--main-bg-color)">
      <form @submit.prevent="saveSale()" v-if="loaded">
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
      <Spinner v-if="!loaded"/>
    </v-card>
  </v-dialog>
</template>
<script>
import GenericService from "../../services/GenericService";
import VentasService from '../../services/VentasService';
import StocksService from '../../services/StocksService';
import ReportsService from '../../services/ReportsService';
import Spinner from '../Graphics/Spinner';
import axios from 'axios';
import { getInternationalDate, formatDate, formatDateWithoutSlash, getCurrentDate } from '../../helpers/dateHelper'; 
import { addZerosInString } from '../../helpers/stringHelper'; 
import { checkIfInvoice } from "../../helpers/processObjectsHelper";
import { formatFiscalInvoice } from '../../helpers/receiptFormatHelper'

export default {
  props:{
    listennerOfStore: Number
  },

  data: () => ({
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    tenant: null,
    token: localStorage.getItem("token"),
    object: null,
    documentos: null,
    loaded: true,
    processStockResult: [],
    lowStock: [],
    productsInOtherDeposits: [],
    productsWithoutStock: []
  }),

  components: {
    Spinner
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
      this.loaded = false;
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
          this.loaded = true;
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
              this.object.correlativoComprobante = numberOfReceipt;
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
                    })
                    .then(() => {
                      this.applyStockModifications(comprobante)
                    })
                    .catch(err => {
                      console.error(err);
                    })
                });
              } else {
                this.$errorAlert("Tipo de comprobante no disponible");
                this.loaded = true;
              }
            })
            .catch((err) => {
              this.$errorAlert("Error en respuesta de AFIP");
              this.loaded = true;
              console.log(err);
            });
        });
    },

    saveNoFiscal() {
      const letraDocumentoComercial = this.object.documentoComercial.letra;
      const sucursalId = this.object.sucursal.id;
      const codigoDocumento = this.object.documentoComercial.codigoDocumento;
      const nombreDocumentoComercial = this.object.documentoComercial.nombre;
      const puntoVenta = this.object.puntoVenta.idFiscal;
      const planPago = this.object.planesPago[0];
      const condVenta = this.checkSaleCondition(planPago);
      let file;
      let fileURL;

      VentasService(this.tenant, "ventas", this.token)
      .getPreviousCorrelativeDocumentNumber(sucursalId, codigoDocumento)
      .then(data => {
        const numeroCorrelativoDeComprobante = parseInt(data.data) + 1;
        this.object.letra = letraDocumentoComercial;
        this.object.numeroCbte = addZerosInString("04", puntoVenta) + "-" + addZerosInString("08", numeroCorrelativoDeComprobante);
        this.object.correlativoComprobante = numeroCorrelativoDeComprobante;
        this.object.fechaEmision = formatDate(getCurrentDate());
        this.object.fechaVto = formatDate(getCurrentDate());
        this.object.nombreDocumento = nombreDocumentoComercial;
        this.object.condicionVenta = condVenta;

        let comprobante = this.object;

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
                this.applyStockModifications(comprobante)
              })
              .catch(err => {
                this.$errorAlert("Error al guardar comprobante");
                this.loaded = true;
                console.error(err);
              })
          });
        })
    },

    applyStockModifications(comprobante) {
      comprobante.productos.forEach((product) => {
        StocksService(this.tenant, "stock", this.token)
        .getStockByProductCodeBarInDefaultDeposit(product.codigoBarra, comprobante.sucursal.id)
        .then(data => {
          let stock = data.data;
          if(stock){
            stock.cantidad = stock.cantidad - Number(product.cantUnidades);
            this.saveStockModifications(stock, comprobante.productos.length);
          }else{
            StocksService(this.tenant, "stock", this.token)
            .getStockByProductCodeBarInAnyDeposit(product.codigoBarra, comprobante.sucursal.id)
            .then(data => {
              let firstStockDetected = data.data[0];
              if(firstStockDetected){
                firstStockDetected.cantidad = firstStockDetected.cantidad - Number(product.cantUnidades);
                this.saveStockModifications(firstStockDetected, comprobante.productos.length);
              }else{
                this.saveStockModifications(product.nombre, comprobante.productos.length);
              }
            })
          }
        })
      })
    },

    saveStockModifications(stock, processProductsLength){
        if(typeof(stock) === 'string'){
          this.productsWithoutStock.push(stock);
          this.processStockResult.push("success");
          if(this.processStockResult.length === processProductsLength) {
            this.clear()
          }
        }else{
          if(stock.cantidadMinima && !stock.cantidadMinima.includes("asign") && stock.cantidad < parseFloat(stock.cantidadMinima)){
            this.lowStock.push(stock.producto.nombre);
          }
          if(!stock.deposito.defaultDeposit){
            this.productsInOtherDeposits.push(stock.producto.nombre)
          }
          GenericService(this.tenant, "stock", this.token)
          .save(stock)
          .then(() => {
            this.processStockResult.push("success");
            if(this.processStockResult.length === processProductsLength) {
              this.clear()
            }
          })
          .catch(err => {
            this.$errorAlert("Error al procesar stock");
            this.loaded = true;
            console.error(err);
          })
        }
    },

    clear(){
      if(this.productsWithoutStock.length > 0){
        this.$infoAlert2(`No existo un registro de stock de estos productos: ${this.productsWithoutStock.reduce((acc, el)=> acc + ', ' + el)}.`)
        .then(() => {
          if(this.lowStock.length > 0){
            this.$infoAlert2(`Productos bajos de stock: ${this.lowStock.reduce((acc, el)=> acc + ', ' + el)}`)
            .then(() => {
              if(this.productsInOtherDeposits.length > 0){
                this.$infoAlert2(`Estos productos no se encuentran en el depósito principal: ${this.productsInOtherDeposits.reduce((acc, el)=> acc + ', ' + el)}. Sus unidades fueron descontadas de otros depósitos.`)
                .then(() => {
                  this.$successAlert("Facturación realizada")
                  .then(()=>{
                    window.location.reload();
                  })
                })
              }else{
                this.$successAlert("Facturación realizada")
                .then(()=>{
                  this.clear()
                })
              }
            })
          }else if(this.productsInOtherDeposits.length > 0){
            this.$infoAlert2(`Estos productos no se encuentran en el depósito principal: ${this.productsInOtherDeposits.reduce((acc, el)=> acc + ', ' + el)}. Sus unidades fueron descontadas de otros depósitos.`)
            .then(() => {
              this.$successAlert("Facturación realizada")
              .then(()=>{
                window.location.reload();
              })
            })
          }else{
            this.$successAlert("Facturación realizada")
            .then(()=>{
              window.location.reload();
            })
          }
        })
      }else if(this.lowStock.length > 0){
        this.$infoAlert2(`Productos bajos de stock: ${this.lowStock.reduce((acc, el)=> acc + ', ' + el)}`)
        .then(() => {
          if(this.productsInOtherDeposits.length > 0){
            this.$infoAlert2(`Estos productos no se encuentran en el depósito principal: ${this.productsInOtherDeposits.reduce((acc, el)=> acc + ', ' + el)}. Sus unidades fueron descontadas de otros depósitos.`)
            .then(() => {
              this.$successAlert("Facturación realizada")
              .then(()=>{
                window.location.reload();
              })
            })
          }else{
            this.$successAlert("Facturación realizada")
            .then(()=>{
              window.location.reload();
            })
          }
        })
      }else if(this.productsInOtherDeposits.length > 0){
        this.$infoAlert2(`Estos productos no se encuentran en el depósito principal: ${this.productsInOtherDeposits.reduce((acc, el)=> acc + ', ' + el)}. Sus unidades fueron descontadas de otros depósitos.`)
        .then(() => {
          this.$successAlert("Facturación realizada")
          .then(()=>{
            window.location.reload();
          })
        })
      }else{
        this.$successAlert("Facturación realizada")
        .then(()=>{
          window.location.reload();
        })
      }
    },

    checkSaleCondition(planPago){
      if(planPago.cuotas > 1){
        return true;
      }else{
        return false;
      }
    }
  },
};
</script>
