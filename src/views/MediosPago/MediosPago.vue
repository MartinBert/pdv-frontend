<template>
  <v-container>
    <v-form class="mb-3">
      <v-row>
        <v-col cols="1">
          <v-btn class="primary" @click="newObject()" raised>Nuevo</v-btn>
        </v-col>
        <v-col cols="3">
          <v-file-input
          v-model="file" 
          class="mt-0"
          placeholder="Importar medios de pago"
          accept=".xlsx, xls"
          @change="onChange($event)"
          ></v-file-input>
        </v-col>
        <v-col cols="5"></v-col>
        <v-col cols="3">
          <v-text-field
            v-model="filterParams.medioPagoName"
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
    <MediosPagoTable
      :items="mediosPago"
      v-on:editItem="edit"
      v-on:deleteItem="deleteItem"
      v-on:seeDetails="seeDetails"
      v-on:add="add"
      v-on:uncheck="uncheck"
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
    <MedioPagoDetails/>
  </v-container>
</template>

<script>
import GenericService from "../../services/GenericService";
import Spinner from "../../components/Graphics/Spinner";
import Pagination from "../../components/Pagination";
import MediosPagoTable from "../../components/Tables/MediosPagoTable";
import DeleteDialog from "../../components/Dialogs/DeleteDialog";
import MedioPagoDetails from "../../components/Details/MedioPagoDetails";
import XLSX from 'xlsx';

export default {
  data: () => ({
    plans: "",
    file: null,
    mediosPago: [],
    filterParams: {
      sucursalId: "",
      medioPagoName: "",
      page: 1,
      size: 10,
      totalPages: 0
    },
    loaded: false,
    tenant: "",
    service: "mediosPago",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    seePlansDialog: false,
    loguedUser: JSON.parse(localStorage.getItem("userData"))
  }),

  components:{
    Spinner,
    Pagination,
    MediosPagoTable,
    DeleteDialog,
    MedioPagoDetails
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
          this.mediosPago = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          if(this.filterParams.totalPages < this.filterParams.page){
              this.filterParams.page = 1;
          }
          this.loaded = true;
        });
    },

    newObject() {
      this.$router.push({ name: "mediosPagoForm", params: { id: 0 } });
    },

    edit(id) {
      this.$router.push({ name: "mediosPagoForm", params: { id: id } });
    },

    deleteItem(id) {
      this.idObjet = id;
      this.deleteDialogStatus = true;
    },

    deleteConfirmation(result){
      return result ? this.deleteObject() : this.deleteDialogStatus = false;
    },

    deleteObject() {
      this.dialog = true;
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

    seeDetails(objects){
      this.$store.commit('details/mutateDialog');
      this.$store.commit('details/addObjectsToDetail', objects);
    },

    add(object){
      this.loaded = false;
      object.sumaEnCierreDeCaja = true;
      GenericService(this.tenant, this.service, this.token)
      .save(object)
      .then(()=>{
        this.refreshView();
      })
      .catch(err =>{
        console.error(err);
      })
    },

    uncheck(object){
      this.loaded = false;
      object.sumaEnCierreDeCaja = false;
      GenericService(this.tenant, this.service, this.token)
      .save(object)
      .then(()=>{
        this.refreshView();
      })
      .catch(err =>{
        console.error(err);
      })
    },

    refreshView(){
      setTimeout(() => {
          this.filterObjects();
      }, 500);
    },

    onChange(event) {
      this.file = event;
      var excel = [];
      var reader = new FileReader();
      reader.onload = e => {
        var data = e.target.result;
        var workbook = XLSX.read(data, { type: "binary" });

        var sheet_name_list = workbook.SheetNames;
        sheet_name_list.forEach(function(y) {
          var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
          if (exceljson.length > 0) {
            for (var i = 0; i < exceljson.length; i++) {
              excel.push(exceljson[i]);
            }
          }
        });
        var prod = this.validateImport(excel);
        if (prod.status) {
          GenericService(this.tenant, this.service, this.token)
            .saveAll(prod.data)
            .then(() => {
              this.filterObjects();
              this.loaderStatus = true;
              window.setTimeout(()=>{
                this.loader = false
                this.loaderStatus=false;
              }, 2000);    
            });
        }
      };
      reader.readAsBinaryString(this.file);
    },

    validateImport(mediosPago) {
      var importacion = {
        status: true,
        data: [],
        message: ""
      };
      mediosPago.forEach((element, index) => {
        if (
          element.nombre 
        ) {
          var obj = {
            nombre: element.nombre,
            planPago: this.getPlanesPago(
              String(element.idPlanes)
            ),
            sucursal: this.loguedUser.sucursal
          };
          importacion.data.push(obj);
        } else {
          importacion.status = false;
          importacion.message = "Faltan datos en el renglón " + (index + 2);
        }
      });
      return importacion;
    },

    getPlanesPago(d) {
      var plans = [];
      if (this.plans && d) {
        var exp = d.match("-");
        if (exp) {
          var stringIds = d.split("-");
          this.plans.forEach(element => {
            stringIds.forEach(s => {
              if (element.id == Number(s)) {
                plans.push(element);
              }
            });
          });
        } else {
          this.plans.forEach(element => {
            if (element.id == d) {
              plans.push(element);
            }
          });
        }
      }
      return plans;
    }
  }
};
</script>