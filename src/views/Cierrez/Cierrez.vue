<template>
  <v-container>
    <TabBar :tabs="tabs" :activeTab="setActiveTabComponent" v-if="loaded"/>
    <v-form class="mb-3" v-if="loaded">
      <v-row>
        <v-col cols="1">
          <v-btn class="primary" @click="generateZClosure()" raised>Realizar cierre z</v-btn>
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
    <Pagination
      :page="filterParams.page"
      :totalPages="filterParams.totalPages"
      :totalVisible="7"
      v-on:changePage="filterObjects"
      v-if="loaded"
    />
    <Spinner v-if="!loaded"/>
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
import CierrezTable from '../../components/Tables/CierrezTable'
import Pagination from '../../components/Pagination';
import Spinner from '../../components/Graphics/Spinner';
import TabBar from '../../components/Graphics/TabBar';
import DeleteDialog from '../../components/Dialogs/DeleteDialog';
import PrintSelectionDialog from '../../components/Dialogs/PrintSelectionDialog';
import CierrezDetails from '../../components/Details/CierrezDetails.vue';
import { getCurrentDate, formatDate } from '../../helpers/dateHelper';
import { questionAlert } from '../../helpers/alerts';
import { roundTwoDecimals } from '../../helpers/mathHelper';
export default {
  data: () => ({
    cierres: [],
    comprobantes: [],
    file: null,
    filterParams: {
      sucursalId: '',
      date: '',
      page: 1,
      size: 10,
      totalPages: 0
    },
    invoiceFilterParams: {
      sucursalId: '',
      fechaEmision: '',
      page: 1,
      size: 100000,
    },
    tabs: [
      {id: 1, route: '', title: 'Comprobantes Emitidos'},
      {id: 2, route: '', title: 'Presupuesto'},
      {id: 3, route: '', title: 'Cierre Z'}
    ],
    activeTab: 3,
    objectToPrint: null,
    printDialogStatus: false,
    loaded: false,
    tenant: "",
    service: "cierres_z",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData"))
  }),

  components:{
    CierrezTable,
    Pagination,
    Spinner,
    DeleteDialog,
    CierrezDetails,
    PrintSelectionDialog,
    TabBar
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.tabs[0].route = `/${this.tenant}/ventas/list`
    this.tabs[1].route = `/${this.tenant}/ventas/presupuesto`
    this.tabs[2].route = `/${this.tenant}/ventas/cierrez`
    if(this.loguedUser.perfil > 1){
      this.filterParams.sucursalId = this.loguedUser.sucursal.id;
      this.invoiceFilterParams.sucursalId = this.loguedUser.sucursal.id;
    }
    this.filterObjects();
  },
  methods: {
    filterObjects(page){
      if(page) this.filterParams.page = page;
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

    closeOrCancelZ(){
      questionAlert("Este proceso realizará el cierre z diario", "Desea continuar")
      .then(result => {
        this.comprobantes.forEach(comprobante => {
          comprobante.cerradoEnCierreZ = true;
        })
        const total = this.comprobantes.reduce((acc, el) => acc + roundTwoDecimals(parseFloat(el.totalVenta)), 0)
        if(result.isConfirmed){
          const cierreZ = {
            sucursal: this.loguedUser.sucursal,
            comprobantesFiscales: this.comprobantes,
            total,
            cantidadVentas: parseInt(this.comprobantes.length),
            fecha: new Date()
          }
          console.log(cierreZ);
          GenericService(this.tenant, this.service, this.token)
          .save(cierreZ)
          .then(()=>{
            this.filterObjects();
          })
          this.loaded = true;
        }else{
          this.comprobantes = []
          this.loaded = true;
        }
      })
    },

    seeDetails(comprobantes) {
      this.$store.commit('details/mutateDialog');
      this.$store.commit('details/addObjectsToDetail', comprobantes);
    },

    print(object){
      this.objectToPrint = object;
      this.printDialogStatus = true;
    },

    printSpecification(specification){
      return this.printZClosure(specification);
    },

    printZClosure(specification){
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

    deleteConfirmation(result){
      return result ? this.deleteObject() : this.deleteDialogStatus = false;
    },

    deleteObject() {
      this.deleteDialogStatus = false;
      GenericService(this.tenant, this.service, this.token)
        .delete(this.idObjet)
        .then(() => {
          this.filterObjects();
        })
        .catch(()=>{
          this.$errorAlert("El registro se encuentra asociado a otros elementos en el sistema");
        })
    },

    setActiveTabComponent(id){
      this.activeTab = id;
    },

    closePrintSelectionDialog(){
      this.printDialogStatus = false;
    }
  }
};
</script>