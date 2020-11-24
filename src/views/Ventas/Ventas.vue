<template>
  <v-container>
    <v-form class="mb-3">
      <v-row>
        <v-col cols="1">
          <v-btn class="primary" @click="seeReports()" raised>Reporte de Ventas</v-btn>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="3">
          <v-text-field
            type="date"
            v-model="filterStringDate"
            v-on:input="filterObjects('fechaEmision',filterStringDate)"
            dense
            outlined
            rounded
            class="text-left"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            type="number"
            v-model="filterStringTotalVenta"
            v-on:input="filterObjects('totalVenta',filterStringTotalVenta)"
            dense
            outlined
            rounded
            class="text-left"
            placeholder="Búsqueda por total facturado"
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
            <th>Fecha de venta</th>
            <th>Código de barras</th>
            <th>Productos</th>
            <th>Medios de pago empleados</th>
            <th>Planes de pago</th>
            <th>Precio de venta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody v-for="object in objects" :key="object.id">
          <tr>
            <td>{{object.id}}</td>
            <td>{{object.fechaEmision}}</td>
            <td>{{object.barCode}}</td>
            <td class="text-center">
              <button @click="seeDetails(object.productos)"><img
                src="/../../images/icons/eye.svg"
                width="40"
                height="40"
              /></button>
            </td>
            <td class="text-center">
              <button @click="seeDetails(object.mediosPago)"><img
                src="/../../images/icons/eye.svg"
                width="40"
                height="40"
              /></button>
            </td>
            <td class="text-center">
              <button @click="seeDetails(object.planesPago)"><img
                src="/../../images/icons/eye.svg"
                width="40"
                height="40"
              /></button>
            </td>
            <td>${{object.totalVenta}}</td>
            <td>
              <a title="Reimprimir comprobante"><img src="/../../images/icons/impresora.svg" @click="print(object)" width="40" height="40"/></a>
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

    <!-- Paginate -->
    <v-pagination
      v-model="paginate.page"
      :length="paginate.totalPages"
      next-icon="mdi-chevron-right"
      prev-icon="mdi-chevron-left"
      :page="paginate.page"
      :total-visible="8"
      @input="getLoguedUser()"
      v-if="paginate.totalPages > 1"
    ></v-pagination>
    <!-- End Paginate -->

    <v-dialog v-model="dialog" persistent width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          <span v-if="dialogMode === 1">Métodos de pago asociados a la venta</span>
          <span v-if="dialogMode === 2">Planes de pago asociados a la venta</span>
          <span v-if="dialogMode === 3">Productos</span>
        </v-card-title>
          <v-simple-table style="background-color: transparent;">
            <template v-slot:default>
              <thead>
                <tr>
                  <th v-if="dialogMode !== 3">ID</th>
                  <th>Nombre</th>
                  <th v-if="dialogMode === 2">Cuotas</th>
                  <th v-if="dialogMode === 2">Porcentaje</th>
                  <th v-if="dialogMode === 3">Precio Unitario</th>
                  <th v-if="dialogMode === 3">Cantidad de unidades</th>
                  <th v-if="dialogMode === 3">Precio Total</th>
                </tr>
              </thead>
              <tbody v-for="object in $store.state.eventual.eventual" :key="object.id">
                <tr>
                  <td v-if="dialogMode !== 3">{{object.id}}</td>
                  <td>{{object.nombre}}</td>
                  <td v-if="dialogMode === 2">{{object.cuotas}}</td>
                  <td v-if="dialogMode === 2">{{object.porcentaje}}</td>
                  <td v-if="dialogMode === 3">{{object.precioUnitario}}</td>
                  <td v-if="dialogMode === 3">{{object.cantUnidades}}</td>
                  <td v-if="dialogMode === 3">{{object.precioTotal}}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        <v-card-actions class="d-flex justify-end">
          <v-btn icon @click="closeDialog()">
            <img src="/../../images/icons/success.svg" width="40px" height="40px">
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <VentasReportsDialog />

  </v-container>
</template>

<script>
import { formatDate } from '../../helpers/dateHelper';
import { infoAlert } from '../../helpers/alerts';
import GenericService from '../../services/GenericService';
import ReportsService from '../../services/ReportsService';
import VentasService from '../../services/VentasService';
import VentasReportsDialog from '../../components/VentasReportsDialog';

export default {
   
  data: () => ({
    icon: "mdi-check-circle",
    file: null,
    objects: null,
    filterStringDate: "",
    filterStringTotalVenta: "",
    paginate: {
      page: 1,
      size: 10,
      totalPages: 7
    },
    loaded: false,
    tenant: "",
    service: "comprobantesFiscales",
    token: localStorage.getItem("token"),
    dialogMode: "",
    dialog: false,
    loguedUser: {}
  }),

  components:{
    VentasReportsDialog
  },

  mounted() {
    this.$store.commit('eventual/resetStates');
    this.tenant = this.$route.params.tenant;
    this.getLoguedUser();
  },

  methods: {

    getLoguedUser(){
      GenericService(this.tenant, this.service, this.token)
      .getLoguedUser()
      .then(data => {
        this.loguedUser = data.data;
        if(this.loguedUser.perfil.id != 1){
          const sucursal = this.loguedUser.sucursal.id
          this.getVentasForSucursal(sucursal, this.paginate.page - 1, this.paginate.size);
        }else{
          this.getAll(this.paginate.page - 1, this.paginate.size);
        }
      })
    },

    getVentasForSucursal(sucursal, page, size){
      GenericService(this.tenant, "ventas", this.token)
      .getDataForSucursal(sucursal, page, size)
      .then(data => {
        this.objects = data.data.content;
        this.paginate.totalPages = data.data.totalPages;
        this.loaded = true;
      })
    },

    getAll(page, size) {
      this.loaded = false;
      GenericService(this.tenant, this.service, this.token)
        .getAll(page, size)
        .then(data => {
          this.objects = data.data.content;
          this.paginate.totalPages = data.data.totalPages;
          console.log(data);
          this.loaded = true;
        });
    },

    filterObjects(filterParam, filter){
      if(this.loguedUser.perfil.id !== 1){
        const sucursal = this.loguedUser.sucursal.id;
        const page = this.paginate.page - 1;
        const size = this.paginate.size;
        let year;
        let month;
        let day;

        if(filter === ''){
          this.getVentasForSucursal(sucursal, page, size);
        }else{
          if(filterParam === 'fechaEmision'){
          if(this.filterStringTotalVenta !== ""){
            this.filterStringTotalVenta = "";
          }
          year = filter.slice(0, filter.indexOf('-'));
          month = filter.slice(filter.indexOf('-') + 1, filter.lastIndexOf('-'));
          day = filter.slice(filter.lastIndexOf('-') + 1, filter.length);
          filter = formatDate(year+month+day);
        }else{
          if(this.filterStringDate !== ""){
            this.filterStringDate = "";
          }
        }

        let object = { sucursal, filterParam, filter, page, size }
        
        VentasService(this.tenant, "ventas", this.token)
          .filter(object)
          .then(data => {
            this.objects = data.data.content;
            this.paginate.totalPages = data.data.totalPages;
            this.loaded = true;
          });
        }
      }else{
        console.log("asdf");
      }
    },

    seeDetails(object){
      if(object[0] !== undefined){
        const evalObject = Object.keys(object[0]);
        if(evalObject[2] === "planPago"){
          this.openDialog(object, 1);
        }else if(evalObject[2] === "cuotas"){
          this.openDialog(object, 2);
        }else{
          this.openDialog(object, 3);
        }
      }else{
        infoAlert("Sin datos...")
      }
      
    },

    closeDialog(){
      this.dialog = false;
      this.$store.commit('eventual/resetStates');
    },

    openDialog(object, type){
      this.dialogMode = type;
      this.$store.commit('eventual/addEventual', object);
      this.dialog = true; 
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

    seeReports(){
      this.$store.commit('eventual/mutateEventualDialog');
    }

  },
};
</script>