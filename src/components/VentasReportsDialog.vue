<template>
  <v-dialog v-model="$store.state.eventual.eventualDialog">
    <v-card>
      <v-card-title class="d-flex justify-center">
        <span>Generar reportes de ventas</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <form @submit.prevent="allSalesReport(loguedUser.sucursal.id)">
                <v-btn class="primary v-btn--block" type="submit">TODAS LAS VENTAS</v-btn>
                <div class="d-flex justify-center mt-3">
                  <img src="/../../images/messages/happy_1.svg" width="40" height="40">
                </div>
              </form>
            </v-col>
            <v-col>
              <form @submit.prevent="comingSoon()">
                <v-btn class="default v-btn--block" type="submit">TODAS LAS VENTAS AGRUPADAS POR COMPROBANTE</v-btn>
                <div class="d-flex justify-center mt-3">
                  <img src="/../../images/messages/happy_1.svg" width="40" height="40">
                </div>
              </form>
            </v-col>
            <v-col>
              <form @submit.prevent="comingSoon()">
                <v-btn class="default v-btn--block" type="submit">TODAS LAS VENTAS AGRUPADAS POR CLIENTE</v-btn>
                <div class="d-flex justify-center mt-3">
                  <img src="/../../images/messages/happy_1.svg" width="40" height="40">
                </div>
              </form>
            </v-col>
          </v-row>
          <v-row>
             <v-col>
              <form @submit.prevent="comingSoon()">
                <v-btn class="default v-btn--block" type="submit">TODAS LAS VENTAS AGRUPADAS POR MEDIOS DE PAGO</v-btn>
                <div class="d-flex justify-center mt-3">
                  <img src="/../../images/messages/happy_1.svg" width="40" height="40">
                </div>
              </form>
            </v-col>
            <v-col>
              <form @submit.prevent="comingSoon()">
                <v-btn class="default v-btn--block" type="submit">TODAS LAS VENTAS AGRUPADAS POR MARCAS</v-btn>
                <div class="d-flex justify-center mt-3">
                  <img src="/../../images/messages/happy_1.svg" width="40" height="40">
                </div>
              </form>
            </v-col>
            <v-col>
              <form @submit.prevent="comingSoon()">
                <v-btn class="default v-btn--block" type="submit">TODAS LAS VENTAS AGRUPADAS POR RUBROS</v-btn>
                <div class="d-flex justify-center mt-3">
                  <img src="/../../images/messages/happy_1.svg" width="40" height="40">
                </div>
              </form>
            </v-col> 
          </v-row>
          <v-row>
            <v-col>
              <div class="horizontalSeparator"></div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <form @submit.prevent="salesForDate(loguedUser.sucursal.id, object.fechaDesde, object.fechaHasta)">
                <v-btn class="primary v-btn--block" type="submit">VENTAS POR FECHA</v-btn>
                <div class="d-block">
                  <label for="input1">Fecha desde</label>
                  <v-text-field
                  id="input1"
                  name="input1"
                  type="date"
                  v-model="fechaDesde"
                  @input="createDate(fechaDesde, 'fechaDesde')"
                  required
                  >
                  </v-text-field>
                </div>
                <div class="d-block">
                  <label for="input2">Fecha hasta</label>
                  <v-text-field
                  id="input2"
                  name="input2"
                  type="date"
                  v-model="fechaHasta"
                  @input="createDate(fechaHasta, 'fechaHasta')"
                  required
                  >
                  </v-text-field>
                </div>
              </form>
            </v-col>
            <v-col>
              <form @submit.prevent="salesForReceipt(loguedUser.sucursal.id, object.documento.codigoDocumento)" class="ml-5">
                <v-btn class="primary v-btn--block" type="submit" raised>VENTAS POR COMPROBANTE</v-btn>
                <div class="d-block">
                  <v-autocomplete
                    :items="documentos"
                    v-model="object.documento"
                    item-text="nombre"
                    :return-object="true"
                    placeholder="Seleccione un comprobante"
                    required
                  ></v-autocomplete>
                </div>
              </form>
            </v-col>
            <v-col>
              <form @submit.prevent="salesForClient(loguedUser.sucursal.id, object.cliente.id)">
                <v-btn class="primary v-btn--block" type="submit" raised>VENTAS POR CLIENTE</v-btn>
                <div class="d-block">
                  <v-autocomplete
                    :items="clientes"
                    v-model="object.cliente"
                    item-text="nombre"
                    :return-object="true"
                    placeholder="Seleccione un cliente"
                    required
                  ></v-autocomplete>
                </div>
              </form>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import ReportsService from '../services/ReportsService';
import GenericService from '../services/GenericService';
import DocumentosService from '../services/DocumentosService';
import { generateIntegerDate } from '../helpers/dateHelper';
import { infoAlert2 } from '../helpers/alerts';

export default {
  name: "VentasReportsDialog",
  data(){
    return {
      tenant: null,
      service: "ventas",
      token: localStorage.getItem("token"),
      loguedUser: null,
      documentos: [],
      clientes: [],
      object:{
        documento: {},
        cliente: {},
        fechaDesde: null,
        fechaHasta: null
      },
      fechaDesde: null,
      fechaHasta: null
    }
  },

  mounted(){
    this.tenant = this.$route.params.tenant;
    this.getLoguedUser();
  },

  methods:{
    /****USER****/
    getLoguedUser(){
      GenericService(this.tenant, this.service, this.token)
      .getLoguedUser()
      .then(data => {
        this.loguedUser = data.data;
      }).then(() => {
        GenericService(this.tenant, "clientes", this.token)
        .getDataForSucursal(this.loguedUser.sucursal.id, 0, 100000)
        .then(data => {
          this.clientes = data.data.content;
        })

        DocumentosService(this.tenant, "documentosComerciales", this.token)
        .getInvoices()
        .then(data => {
          this.documentos = data.data;
        })
      })
    },
    /****USER****/

    /****REPORTS****/
    allSalesReport(id) {
      ReportsService(this.tenant, this.service, this.token)
        .allSalesReport(id)
        .then((res) => {
          var file = new Blob([res["data"]], { type: "application/pdf" });
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL, "_blank");
        });
    },

    allSalesGroupBy(id, type){
      ReportsService(this.tenant, "ventas", this.token)
      .allSalesGroupBy(id, type)
      .then((res) => {
          var file = new Blob([res["data"]], { type: "application/pdf" });
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL, "_blank");
        });
    },

    salesForReceipt(id, receipt) {
      ReportsService(this.tenant, this.service, this.token)
        .salesForReceipt(id, receipt)
        .then((res) => {
          var file = new Blob([res["data"]], { type: "application/pdf" });
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL, "_blank");
        });
    },

    salesForClient(id, client) {
      ReportsService(this.tenant, this.service, this.token)
        .salesForClient(id, client)
        .then((res) => {
          var file = new Blob([res["data"]], { type: "application/pdf" });
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL, "_blank");
        });
    },

    salesForDate(id, fechaDesde, fechaHasta) {
      ReportsService(this.tenant, this.service, this.token)
        .salesForDate(id, fechaDesde, fechaHasta)
        .then((res) => {
          var file = new Blob([res["data"]], { type: "application/pdf" });
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL, "_blank");
        });
    },

    /****REPORTS****/

    /**** Transform data functions ****/
    createDate(date, param){
      const integerDate = generateIntegerDate(date);
      if(param === 'fechaDesde'){
        this.object.fechaDesde = integerDate;
      }else{
        this.object.fechaHasta = integerDate;
      }
    },

    comingSoon(){
      infoAlert2("Disponible muy pronto");
    }
  }
};
</script>
