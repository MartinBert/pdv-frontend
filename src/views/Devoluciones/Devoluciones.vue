<template>
  <v-container>
    <v-form class="mb-3">
      <v-row>
        <v-col>
          <v-btn class="primary" @click="newObject()" raised>Nuevo</v-btn>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="filterParams.blackReceiptFilter"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            type="number"
            class="text-left"
            placeholder="Búsqueda especial"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <DevolucionesTable
      :items="devoluciones"
      v-on:add="add"
      v-on:print="print"
      v-on:seeDetails="seeDetails"
      v-if="loaded"
    />
    <Pagination
      :page="filterParams.page"
      :totalPages="filterParams.totalPages"
      :totalVisible="7"
      v-on:changePage="filterObjects"
      v-if="loaded"
    />
    <Spinner v-if="!loaded"/>
    <DevolucionDetails/>
    <ReceiptDialog v-on:receipt="saveChanges"/>
  </v-container>
</template>

<script>
import axios from "axios";
import GenericService from "../../services/GenericService";
import ReportsService from "../../services/ReportsService";
import Pagination from "../../components/Pagination";
import DevolucionesTable from "../../components/Tables/DevolucionesTable";
import Spinner from "../../components/Spinner";
import ReceiptDialog from "../../components/ReceiptDialog";
import DevolucionDetails from "../../components/Details/DevolucionDetails";
import { formatDate, getCurrentDate, getInternationalDate, formatDateWithoutSlash } from "../../helpers/dateHelper";
import { questionAlert, errorAlert, successAlert } from "../../helpers/alerts";
import { generateBarCode, generateFiveDecimalCode } from "../../helpers/mathHelper";
import { processDetailReceipt } from "../../helpers/processObjectsHelper";
import { formatFiscalInvoice } from '../../helpers/receiptFormatHelper';
import { addZerosInString } from '../../helpers/stringHelper';

export default {
  data: () => ({
    devoluciones: [],
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    filterParams: {
      sucursalId: "",
      blackReceiptFilter: "",
      page: 1,
      size: 10,
      totalPages: 0
    },
    loaded: false,
    tenant: "",
    service: "devoluciones",
    token: localStorage.getItem("token"),
    details: {},
    activeDetailDialog: false,
    receiptDialogData: null,
    temporalObject: null,
  }),

  components: {
    ReceiptDialog,
    DevolucionDetails,
    Pagination,
    DevolucionesTable,
    Spinner
  },
  
  mounted() {
    this.tenant = this.$route.params.tenant;
    if(this.loguedUser.perfil > 1){
      this.filterParams.sucursalId = this.loguedUser.sucursal.id;
    }
    this.filterObjects();
  },

  methods: {
    filterObjects(page){
      if(page) this.filterParams.page = page;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then(data => {
          this.devoluciones = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          if(this.filterParams.totalPages < this.filterParams.page){
              this.filterParams.page = 1;
          }
          this.loaded = true;
        });
    },

    newObject() {
      this.$router.push({ name: "devolucionesForm", params: { id: 0 } });
    },

    print(object){
      ReportsService(this.tenant, "ventas", this.token)
      .onCloseSaleReport(object.comprobante)
      .then((res) => {
        let file = new Blob([res["data"]], {
          type: "application/pdf",
        });
        let fileURL = URL.createObjectURL(file);
        window.open(fileURL, "_blank");
      });
    },

    seeDetails(object){
      this.$store.commit('details/addTitleToDetail', "Productos")
      this.$store.commit('details/addObjectsToDetail', object);
      this.$store.commit('details/mutateDialog');
    },

    add(o){
      this.temporalObject = o;
      this.$store.commit('receipt/receiptDialogMutation');
    },

    saveChanges(){
      this.receiptDialogData = this.$store.state.receipt.receipt;
      questionAlert('Atención, esta acción generará un comprobante en el sistema', 'Desea continuar')
      .then(result =>{
        if(result.isConfirmed){
          if(this.receiptDialogData.documento.tipo === true){
            this.processAndSaveFiscal();
          }else{
            this.processAndSaveNoFiscal();
          }
        }else{
          this.$store.commit('receipt/resetStates');
        }
      })
    },

    processAndSaveFiscal() {
      this.loaded = false;
      /*** Constants ***/
      const sucursal = this.loguedUser.sucursal;
      const ptoVenta = this.loguedUser.puntoVenta;
      const documento = this.receiptDialogData.documento;
      const empresa = this.loguedUser.empresa;
      const cliente = this.receiptDialogData.cliente;
      const mediosPago = this.receiptDialogData.mediosPago;
      const planesPago = this.receiptDialogData.planPago;
      const totalVenta = this.receiptDialogData.totalVenta;
      const comprobanteAsociado = this.receiptDialogData.comprobanteAsociado;
      const tenant = this.tenant;
      const token = this.token;
      const service = "ventas";
      const comprobanteAsociadoDetalle = [{
        Tipo: comprobanteAsociado.documentoComercial.codigoDocumento,
        PtoVta: comprobanteAsociado.puntoVenta.idFiscal,
        Nro: comprobanteAsociado.numeroCbte
      }];
      const detail = processDetailReceipt(
        documento.codigoDocumento,
        totalVenta
      );

      /*** Mutable vars ***/
      let comprobante;
      let file;
      let fileURL;
      let condVenta;
      let invoice; 
      let devolucion = this.temporalObject
  
      /*** Get last invoice emmited number ***/
      axios
      .get(`${process.env.VUE_APP_API_AFIP}/rest_api_afip/obtenerUltimoNumeroAutorizado/${sucursal.cuit}/${ptoVenta.idFiscal}/${documento.codigoDocumento}`)
      .then(data => {
        const numberOfReceipt = parseInt(data.data.responseOfAfip) + 1;
        const dataForCreateInvoice = {
          ptoVentaId: ptoVenta.idFiscal,
          receiptCode: documento.codigoDocumento,
          clientCuit: cliente.cuit,
          numberOfReceipt: numberOfReceipt,
          date: getInternationalDate(),
          products: [detail],
          totalVenta: totalVenta,
          asociatedReceipt: comprobanteAsociadoDetalle
        };
        
        /*** Format invoice according to type ***/
        invoice = formatFiscalInvoice(documento.letra, dataForCreateInvoice)

        /*** Evaluate required sales form data ***/
        if (mediosPago !== undefined) {
        /*** Send invoice to AFIP ***/
          axios
          .post(`${process.env.VUE_APP_API_AFIP}/rest_api_afip/generarComprobante/${sucursal.cuit}`, invoice)
          .then(data => {
            const cae = data.data.CAE;
            const dateOfCaeExpiration = data.data.CAEFchVto;
            const barCode = sucursal.cuit + addZerosInString("02", documento.codigoDocumento) + addZerosInString("04", ptoVenta.idFiscal) + cae + formatDateWithoutSlash(dateOfCaeExpiration);
            
            if(planesPago.cuotas > 1){condVenta = false;}else{condVenta = true;}

            comprobante = {
              letra: documento.letra,
              numeroCbte: numberOfReceipt,
              fechaEmision: formatDate(getCurrentDate()),
              fechaVto: formatDate(dateOfCaeExpiration),
              condicionVenta: condVenta,
              productos: [detail],
              barCode: barCode,
              cae: cae,
              puntoVenta: ptoVenta,
              sucursal: sucursal,
              documentoComercial: documento,
              empresa: empresa,
              cliente: cliente,
              totalVenta: totalVenta,
              mediosPago: [mediosPago],
              planesPago: [planesPago],
              nombreDocumento: documento.nombre,
            };
            
            /*** Save receipt in database ***/
            if (comprobante.cae) {
              GenericService(tenant, "comprobantesFiscales", token)
              .save(comprobante)
              .then((data) => {
                let comprobanteGenerado = data.data;
                  
                devolucion.comprobante = comprobanteGenerado;
                devolucion.totalDevolucion = comprobanteGenerado.totalVenta;

                GenericService(tenant, this.service, token)
                .save(devolucion)
                .then(() => {
                  successAlert("Comprobante Agregado");
                  this.loaded = true;
                })
                .then(() => {
                  ReportsService(tenant, service, token)
                    .onCloseSaleReport(comprobante)
                    .then((res) => {
                      file = new Blob([res["data"]], {
                        type: "application/pdf",
                      });
                      fileURL = URL.createObjectURL(file);
                      window.open(fileURL, "_blank");
                    });
                });
              });
            } else {
              errorAlert("Tipo de comprobante no disponible");
            }
          })
          .catch((err) => {
            console.log('---------------- ERROR IN AFIP RESPONSE ----------------');
            console.log(err);
          })
        } else {
          errorAlert("Debe seleccionar un medio de pago");
        }
      });
    },

    processAndSaveNoFiscal() {
      this.loaded = false;
      /* Constants */ 
      const mediosPago = this.receiptDialogData.mediosPago;
      const planesPago = this.receiptDialogData.planPago;
      const totalVenta = this.receiptDialogData.totalVenta;
      const cliente = this.receiptDialogData.cliente;
      const empresa = this.loguedUser.empresa;
      const documento = this.receiptDialogData.documento;
      const sucursal = this.loguedUser.sucursal;
      const ptoVenta = this.loguedUser.puntoVenta;
      const tenant = this.tenant;
      const token = this.token;
      const service = "ventas";
      const fecha = getCurrentDate();
      const detail = processDetailReceipt(documento.codigoDocumento, totalVenta);

      /* Mutable vars */ 
      let file;
      let fileURL;
      let comprobante;
      let condVenta;
      let devolucion = this.temporalObject;

      /**** End declarations ****/

      if (planesPago) {
        if (planesPago.length < 2) {
          if (planesPago[0].cuotas > 1) {
            condVenta = true;
          } else {
            condVenta = false;
          }
        } else {
          condVenta = false;
        }
      } else {
        condVenta = true;
      }

      comprobante = {
        letra: documento.letra,
        numeroCbte: generateFiveDecimalCode(),
        fechaEmision: formatDate(fecha),
        fechaVto: formatDate(fecha),
        condicionVenta: condVenta,
        productos: [detail],
        barCode: generateBarCode(),
        cae: "",
        puntoVenta: ptoVenta,
        sucursal: sucursal,
        documentoComercial: documento,
        empresa: empresa,
        cliente: cliente,
        totalVenta: totalVenta,
        mediosPago: [mediosPago],
        planesPago: [planesPago],
        nombreDocumento: documento.nombre,
      };

      GenericService(tenant, "comprobantesFiscales", token).save(comprobante)
      .then((data) => {
        let comprobanteGenerado = data.data;
        devolucion.comprobante = comprobanteGenerado;
        devolucion.totalDevolucion = comprobanteGenerado.totalVenta;
        
        GenericService(tenant, this.service, token).save(devolucion)
          .then(() => {
            successAlert("Comprobante agregado");
            this.loaded = true;
          })
          .then(() => {
            ReportsService(tenant, service, token)
              .onCloseSaleReport(comprobante)
              .then((res) => {
                file = new Blob([res["data"]], {
                  type: "application/pdf",
                });
                fileURL = URL.createObjectURL(file);
                window.open(fileURL, "_blank");
              });
          });
      })

      this.temporalObject = null;
      this.$store.commit("productos/resetStates");
    },
  }
};
</script>