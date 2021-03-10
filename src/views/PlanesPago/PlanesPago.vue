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

    <!-- List -->
    <v-simple-table style="background-color: transparent;">
      <template v-slot:default>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cantidad de cuotas</th>
            <th>Porcentaje de recargo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody v-for="object in objects" :key="object.id">
          <tr>
            <td>{{object.nombre}}</td>
            <td>{{object.cuotas}}</td>
            <td>{{object.porcentaje}}%</td>
            <td>
              <a title="Editar"><img src="/../../images/icons/edit.svg" @click="edit(object.id)" width="30" height="30"/></a>
              <a title="Eliminar"><img src="/../../images/icons/delete.svg" @click="openDelete(object.id)" width="30" height="30"/></a>
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
      @input="filterObjects()"
      v-if="filterParams.totalPages > 1"
    ></v-pagination>
    <!-- End filterParams -->

    <!-- Dialog Delete-->
    <v-dialog v-model="dialogDeleteObject" width="500">
      <v-card>
        <v-toolbar class="d-flex justify-center" color="primary" dark>
          <v-toolbar-title>Eliminar objeto</v-toolbar-title>
        </v-toolbar>
        <v-card-title class="d-flex justify-center">¿Está seguro que desea realizar esta acción?</v-card-title>
        <v-card-actions class="d-flex justify-center pb-4">
          <v-btn small color="disabled" class="mr-5" @click="deleteObject">Si</v-btn>
          <v-btn small color="disabled" @click="dialogDeleteObject = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End Dialog Delete -->
  </v-container>
</template>

<script>
import GenericService from "../../services/GenericService";
import XLSX from 'xlsx';

export default {
  data: () => ({
    objects: [],
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
    dialogDeleteObject: false,
    loguedUser: JSON.parse(localStorage.getItem("userData"))
  }),
  mounted() {
    this.tenant = this.$route.params.tenant;
    if(this.loguedUser.perfil > 1){
      this.filterParams.sucursalId = this.loguedUser.sucursal.id;
    }
    this.filterObjects();
  },
  methods: {
    filterObjects(){
      this.loaded = false;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
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
      this.$router.push({ name: "planesPagoForm", params: { id: 0 } });
    },

    edit(id) {
      this.$router.push({ name: "planesPagoForm", params: { id: id } });
    },

    openDelete(id) {
      this.idObjet = id;
      this.dialogDeleteObject = true;
    },

    deleteObject() {
      this.dialog = true;
      this.dialogDeleteObject = false;
      GenericService(this.tenant, this.service, this.token)
        .delete(this.idObjet)
        .then(() => {
          this.filterObjects();
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

    validateImport(objects) {
      this.loader = true;
      var importacion = {
        status: true,
        data: [],
        message: ""
      };
      objects.forEach((element, index) => {
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