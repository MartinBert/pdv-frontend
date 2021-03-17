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
          placeholder="Importar planes de pago"
          accept=".xlsx, xls"
          @change="importDocuments($event)"
          ></v-file-input>
        </v-col>
        <v-col cols="5"></v-col>
        <v-col cols="3">
          <v-text-field
            v-model="filterParams.planPagoName"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            placeholder="Búsqueda"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <PlanesPagoTable
      :items="planesPago"
      v-on:editItem="edit"
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
    <Spinner v-if="!loaded" />
    <DeleteDialog
      :status="deleteDialogStatus"
      v-on:deleteConfirmation="deleteConfirmation"
    />
  </v-container>
</template>

<script>
import GenericService from "../../services/GenericService";
import PlanesPagoTable from "../../components/Tables/PlanesPagoTable";
import Pagination from "../../components/Pagination";
import Spinner from "../../components/Spinner";
import DeleteDialog from "../../components/Dialogs/DeleteDialog";
import XLSX from 'xlsx';

export default {
  data: () => ({
    planesPago: [],
    file: null,
    filterParams: {
      sucursalId: "",
      planPagoName: "",
      page: 1,
      size: 10,
      totalPages: 0
    },
    loaded: false,
    tenant: "",
    service: "planesPago",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData"))
  }),

  components: {
    PlanesPagoTable,
    Pagination,
    Spinner,
    DeleteDialog,
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
          this.planesPago = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          if(this.filterParams.totalPages < this.filterParams.page){
              this.filterParams.page = 1;
          }
          this.loaded = true;
        });
    },

    newObject() {
      this.$router.push({ name: "planesPagoForm", params: { id: 0 } });
    },

    edit(id) {
      this.$router.push({ name: "planesPagoForm", params: { id: id } });
    },

    deleteItem(id) {
      this.idObjet = id;
      this.deleteDialogStatus = true;
    },

    deleteConfirmation(result) {
      return result ? this.deleteObject() : (this.deleteDialogStatus = false);
    },

    deleteObject() {
      this.deleteDialogStatus = false;
      GenericService(this.tenant, this.service, this.token)
        .delete(this.idObjet)
        .then(() => {
          this.filterObjects();
        })
        .catch(() => {
          this.$errorAlert(
            "El registro se encuentra asociado a otros elementos en el sistema"
          );
        });
    },

    importDocuments(event) {
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
        var doc = this.validateImport(excel);
        if (doc.status) {
          GenericService(this.tenant, this.service, this.token)
            .saveAll(doc.data)
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

    validateImport(planesPago) {
      this.loader = true;
      var importacion = {
        status: true,
        data: [],
        message: ""
      };
      planesPago.forEach((element, index) => {
        if (
          element.nombre &&
          element.cuotas &&
          element.porcentaje
        ) {
          var obj = {
            nombre: element.nombre,
            cuotas: element.cuotas,
            porcentaje: element.porcentaje,
            sucursal: this.loguedUser.sucursal
          };
          importacion.data.push(obj);
        } else {
          importacion.status = false;
          importacion.message = "Faltan datos en el renglón " + (index + 2);
        }
      });
      return importacion;
    }
  }
};
</script>