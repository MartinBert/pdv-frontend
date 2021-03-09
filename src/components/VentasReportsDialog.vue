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
              <v-select
                v-if="loguedUser.perfil < 3"
                outlined
                rounded
                label="Seleccione la sucursal sobre la que desea obtener información"
                placeholder=" "
                :items="sucursales"
                item-text="nombre"
                v-model="loguedUser.sucursal"
                :return-object="true"
                required
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <form @submit.prevent="allSalesReport(loguedUser.sucursal)">
                <v-btn class="primary v-btn--block" type="submit">TODAS LAS VENTAS</v-btn>
              </form>
            </v-col>
            <v-col>
              <form @submit.prevent="allSalesGroupBy(loguedUser.sucursal, 'Receipts')">
                <v-btn class="primary v-btn--block" type="submit">TODAS LAS VENTAS AGRUPADAS POR COMPROBANTE</v-btn>
              </form>
            </v-col>
            <v-col>
              <form @submit.prevent="allSalesGroupBy(loguedUser.sucursal, 'Clients')">
                <v-btn class="primary v-btn--block" type="submit">TODAS LAS VENTAS AGRUPADAS POR CLIENTE</v-btn>
              </form>
            </v-col>
          </v-row>
          <v-row>
             <v-col>
              <form @submit.prevent="comingSoon()">
                <v-btn class="default v-btn--block" type="submit">TODAS LAS VENTAS AGRUPADAS POR MEDIOS DE PAGO</v-btn>
              </form>
            </v-col>
            <v-col>
              <form @submit.prevent="comingSoon()">
                <v-btn class="default v-btn--block" type="submit">TODAS LAS VENTAS AGRUPADAS POR MARCAS</v-btn>
              </form>
            </v-col>
            <v-col>
              <form @submit.prevent="comingSoon()">
                <v-btn class="default v-btn--block" type="submit">TODAS LAS VENTAS AGRUPADAS POR RUBROS</v-btn>
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
              <form @submit.prevent="salesForDate(loguedUser.sucursal, object.fechaDesde, object.fechaHasta)">
                <v-btn class="primary v-btn--block" type="submit">VENTAS POR FECHA</v-btn>
                <div class="d-block">
                  <v-text-field
                  id="input1"
                  name="input1"
                  type="date"
                  v-model="fechaDesde"
                  label="Fecha desde"
                  @input="createDate(fechaDesde, 'fechaDesde')"
                  required
                  >
                  </v-text-field>
                </div>
                <div class="d-block">
                  <v-text-field
                  id="input2"
                  name="input2"
                  type="date"
                  label="Fecha hasta"
                  v-model="fechaHasta"
                  @input="createDate(fechaHasta, 'fechaHasta')"
                  required
                  >
                  </v-text-field>
                </div>
              </form>
            </v-col>
            <v-col>
              <form @submit.prevent="salesForMonth(loguedUser.sucursal, object.year, object.month)">
                <v-btn class="primary v-btn--block" type="submit">VENTAS POR MES</v-btn>
                <div class="d-block">
                  <v-autocomplete
                    label="Seleccione un año"
                    :items="years"
                    v-model="object.year"
                    required
                  ></v-autocomplete>
                  <v-autocomplete
                    label="Seleccione un mes"
                    :items="months"
                    item-value="value"
                    v-model="object.month"
                    required
                  ></v-autocomplete>
                </div>
              </form>
            </v-col>
            <v-col>
              <form @submit.prevent="salesForYear(loguedUser.sucursal, object.year2)" class="ml-5">
                <v-btn class="primary v-btn--block" type="submit" raised>VENTAS POR AÑO</v-btn>
                <div class="d-block">
                  <v-autocomplete
                    :items="years"
                    v-model="object.year2"
                    item-text="nombre"
                    :return-object="true"
                    placeholder="Seleccione un año"
                    required
                  ></v-autocomplete>
                </div>
              </form>
            </v-col>
          </v-row>
          <v-row>
             <v-col>
              <form @submit.prevent="salesForClient(loguedUser.sucursal, object.cliente.id)">
                <v-btn class="primary v-btn--block" type="submit">VENTAS POR CLIENTE</v-btn>
                <div class="d-block">
                  <v-autocomplete
                    :items="clientes"
                    v-model="object.cliente"
                    item-text="nombre"
                    :return-object="true"
                    placeholder="Seleccione un año"
                    required
                  ></v-autocomplete>
                </div>
              </form>
            </v-col>
            <v-col>
              <form @submit.prevent="salesForReceipt(loguedUser.sucursal, object.documento.codigoDocumento)">
                <v-btn class="primary v-btn--block" type="submit">VENTAS POR COMPROBANTE</v-btn>
                <div class="d-block">
                  <v-autocomplete
                    label="Seleccione un comprobante"
                    :items="documentos"
                    v-model="object.documento"
                    item-text="nombre"
                    :return-object="true"
                    required
                  ></v-autocomplete>
                </div>
              </form>
            </v-col>
            <v-col>
              <form @submit.prevent="comingSoon()" class="ml-5">
                <v-btn class="default v-btn--block" type="submit" raised>VENTAS POR MEDIO DE PAGO</v-btn>
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
              <form @submit.prevent="comingSoon()">
                <v-btn class="default v-btn--block" type="submit">VENTAS POR MES Y COMPROBANTE</v-btn>
              </form>
            </v-col>
            <v-col>
              <form @submit.prevent="comingSoon()" class="ml-5">
                <v-btn class="default v-btn--block" type="submit" raised>VENTAS POR MES Y CLIENTE</v-btn>
              </form>
            </v-col>
            <v-col>
              <form @submit.prevent="comingSoon()">
                <v-btn class="default v-btn--block" type="submit" raised>VENTAS POR MES Y MEDIOS DE PAGO</v-btn>
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
import { generateIntegerDate, getYearsList, monthsList } from '../helpers/dateHelper';
import { exportPDF } from '../helpers/exportFileHelper';
import { errorAlert, infoAlert2 } from '../helpers/alerts';

export default {
  name: "VentasReportsDialog",
  data(){
    return {
      tenant: null,
      service: "ventas",
      token: localStorage.getItem("token"),
      months: null,
      years: getYearsList(),
      loguedUser: JSON.parse(localStorage.getItem("userData")),
      documentos: [],
      sucursales: [],
      clientes: [],
      object:{
        documento: {},
        cliente: {},
        fechaDesde: null,
        fechaHasta: null,
        mes: null,
        year: null,
        year2: null
      },
      fechaDesde: null,
      fechaHasta: null
    }
  },

  mounted(){
    this.tenant = this.$route.params.tenant;
    this.months = monthsList;
    this.getObjects();
  },

  methods:{
    /**** USER AND MODELS ****/
    getObjects(){
        let id;
        if(this.loguedUser.perfil < 3){
          id = "";
        }else{
          id = this.loguedUser.sucursal.id;
        }

        const filterParam = {id, param: '', page: 0, size: 100000}
        const clientFilter = {
          sucursalId: this.loguedUser.sucursal.id,
          personaSocialReason: "",
          personaName: "",
          personaCuit: "",
          personaDirection: "",
          personaContactName: "",
          page: 1,
          size: 100000,
        }
        
        if(this.loguedUser.perfil < 3){
          GenericService(this.tenant, "sucursales", this.token)
          .filter(filterParam)
          .then(data => {
            this.sucursales = data.data.content;
          });
        }

        GenericService(this.tenant, "clientes", this.token)
        .filter(clientFilter)
        .then(data => {
          this.clientes = data.data.content;
        });


        DocumentosService(this.tenant, "documentosComerciales", this.token)
        .getInvoices()
        .then(data => {
          this.documentos = data.data;
        });

    },
    /**** USER AND MODELS ****/

    /**** Export PDF ****/
    allSalesReport(sucursal) {
      if(sucursal === undefined) return errorAlert("Debe seleccionar una sucursal para generar el documento");
      let id = sucursal.id;
      ReportsService(this.tenant, this.service, this.token)
        .allSalesReport(id)
        .then((res) => {
          exportPDF(res);
        });
    },

    allSalesGroupBy(sucursal, type){
      if(sucursal === undefined) return errorAlert("Debe seleccionar una sucursal para generar el documento");
      let id = sucursal.id;
      ReportsService(this.tenant, "ventas", this.token)
      .allSalesGroupBy(id, type)
      .then((res) => {
          exportPDF(res);
        });
    },

    salesForReceipt(sucursal, receipt) {
      if(sucursal === undefined) return errorAlert("Debe seleccionar una sucursal para generar el documento");
      let id = sucursal.id;
      ReportsService(this.tenant, this.service, this.token)
        .salesForReceipt(id, receipt)
        .then((res) => {
          exportPDF(res);
        });
    },

    salesForClient(sucursal, client) {
      if(sucursal === undefined) return errorAlert("Debe seleccionar una sucursal para generar el documento");
      let id = sucursal.id;
      ReportsService(this.tenant, this.service, this.token)
        .salesForClient(id, client)
        .then((res) => {
          exportPDF(res);
        });
    },

    salesForDate(sucursal, fechaDesde, fechaHasta) {
      if(sucursal === undefined) return errorAlert("Debe seleccionar una sucursal para generar el documento");
      let id = sucursal.id;
      ReportsService(this.tenant, this.service, this.token)
        .salesForDate(id, fechaDesde, fechaHasta)
        .then((res) => {
          exportPDF(res);
        });
    },

    salesForMonth(sucursal, year, month){
      if(sucursal === undefined) return errorAlert("Debe seleccionar una sucursal para generar el documento");
      let id = sucursal.id;
      ReportsService(this.tenant, this.service, this.token)
        .salesForMonth(id, year, month)
        .then((res) => {
          exportPDF(res);
        });
    },

    salesForYear(sucursal, year){
      if(sucursal === undefined) return errorAlert("Debe seleccionar una sucursal para generar el documento");
      let id = sucursal.id;
      ReportsService(this.tenant, this.service, this.token)
        .salesForYear(id, year)
        .then((res) => {
          exportPDF(res);
        });
    },

    /**** Export PDF ****/

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
    /**** Transform data functions ****/
  }
};
</script>
