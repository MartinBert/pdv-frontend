<template>
  <v-container>
    <v-form class="mb-3">
      <v-row>
        <v-col cols="6">
          <v-btn class="primary" @click="newObject()" raised>Nuevo</v-btn>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="filterParams.stringParam"
            v-on:input="filterObjects(loguedUser.perfil, filterParams.longParam, filterParams.stringParam, filterParams.page - 1, filterParams.size)"
            dense
            outlined
            rounded
            class="text-left"
            placeholder="Búsqueda"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="filterParams.longParam"
            v-on:input="filterObjects(loguedUser.perfil, filterParams.longParam, filterParams.stringParam, filterParams.page - 1, filterParams.size)"
            dense
            outlined
            rounded
            class="text-left"
            placeholder="Búsqueda especial"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>

    <!-- List -->
    <v-simple-table style="background-color: transparent;">
      <template v-slot:default>
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Productos devueltos</th>
            <th>Productos cedidos</th>
            <th>Monto de operación</th>
            <th>Comprobante</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody v-for="o in objects" :key="o.id">
          <tr>
            <td>{{o.id}}</td>
            <td>{{o.descripcion}}</td>
            <td>{{o.fecha}}</td>
            <td>
              <button type="button">
                <img
                  src="/../../images/icons/details.svg"
                  @click="seeDetail('devueltos', o)"
                  width="30"
                  height="30"
                />
              </button>
            </td>
            <td>
              <button type="button">
                <img
                  src="/../../images/icons/details.svg"
                  @click="seeDetail('cedidos', o)"
                  width="30"
                  height="30"
                />
              </button>
            </td>
            <td>${{o.totalDevolucion}}</td>
            <td>
              <span v-if="o.comprobante">{{o.comprobante.nombreDocumento}}</span>
              <span v-if="!o.comprobante">SIN COMPROBANTE</span>
            </td>
            <td>
              <a title="Reimprimir comprobante" v-if="o.comprobante"><img src="/../../images/icons/printer.svg" @click="print(o.comprobante)" width="30" height="30"/></a>
              <a title="Agregar comprobante" v-if="!o.comprobante"><img src="/../../images/icons/add.svg" @click="addReceipt(o)" width="30" height="30"/></a>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <!-- End List -->

    <!-- Loader -->
    <div class="text-center" style="margin-top:15px" v-if="!loaded">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <!-- End Loader -->

    <!-- filterParams -->
    <v-pagination
      v-model="filterParams.page"
      :length="filterParams.totalPages"
      next-icon="mdi-chevron-right"
      prev-icon="mdi-chevron-left"
      :page="filterParams.page"
      :total-visible="8"
      @input="filterObjects(loguedUser.perfil, filterParams.longParam, filterParams.stringParam, filterParams.page - 1, filterParams.size)"
      v-if="filterParams.totalPages > 1"
    ></v-pagination>
    <!-- End filterParams -->

    <!-- Dialog Detail-->
    <v-dialog v-model="activeDetailDialog" width="500">
      <v-card>
        <v-card-title class="d-flex">
          <span class="text-center">Productos {{details[0]}}</span>
        </v-card-title>
        <v-card-text>
          <v-simple-table style="background-color: transparent" ref="tab">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Nombre</th>
                  <th class="text-left">Cantidad de unidades</th>
                  <th class="text-left">Precio Unitario</th>
                  <th class="text-left">Precio Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in details[1]" :key="p.id">
                  <td>{{ p.nombre }}</td>
                  <td>{{ p.cantUnidades }}</td>
                  <td>{{ p.precioUnitario }}</td>
                  <td>{{ p.precioTotal }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
        
    </v-dialog>
    <!-- End Dialog Detail -->

    <ReceiptDialog v-on:receipt="saveChanges"/>
  </v-container>
</template>

<script>
import axios from "axios";
import GenericService from "../../services/GenericService";
import ReportsService from "../../services/ReportsService";
import { formatDate, getCurrentDate, getInternationalDate, formatDateWithoutSlash } from "../../helpers/dateHelper";
import ReceiptDialog from "../../components/ReceiptDialog";
import { questionAlert, errorAlert, successAlert } from "../../helpers/alerts";
import { generateBarCode, generateFiveDecimalCode } from "../../helpers/mathHelper";
import { processDetailReceipt } from "../../helpers/processObjectsHelper";
import { formatFiscalInvoice } from '../../helpers/receiptFormatHelper';
import { addZerosInString } from '../../helpers/stringHelper';

export default {
  data: () => ({
    objects: [],
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    filterParams: {
      idPerfil: "",
      idSucursal: "",
      stringParam: "",
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
    ReceiptDialog
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterObjects(this.loguedUser.perfil, this.filterParams.longParam, this.filterParams.stringParam, this.filterParams.page - 1, this.filterParams.size);
  },

  methods: {
    filterObjects(idPerfil, longParam, stringParam, page, size){
      this.loaded = false
      let idSucursal;
      
      switch (idPerfil) {
        case 1:
            idSucursal = '';
          break;
      
        default:
            idSucursal = this.loguedUser.sucursal.id;
          break;
      }

      GenericService(this.tenant, this.service, this.token)
        .filter({idPerfil, idSucursal, longParam, stringParam, page, size})
        .then(data => {
          this.objects = data.data.content;
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
      .onCloseSaleReport(object)
      .then((res) => {
        let file = new Blob([res["data"]], {
          type: "application/pdf",
        });
        let fileURL = URL.createObjectURL(file);
        window.open(fileURL, "_blank");
      });
    },

    seeDetail(type, object){
      if(type === "devueltos"){
        this.details = ['devueltos por clientes', object.productos];
      }else{
        this.details = ['cedidos a clientes', object.productosSalientes];
      }
      this.activeDetailDialog = true;
    },

    addReceipt(o){
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

      console.log(comprobanteAsociado);

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
          console.log(invoice);

        /*** Send invoice to AFIP ***/
          axios
          .post(`${process.env.VUE_APP_API_AFIP}/rest_api_afip/generarComprobante/${sucursal.cuit}`, invoice)
          .then(data => {
            console.log(data);
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