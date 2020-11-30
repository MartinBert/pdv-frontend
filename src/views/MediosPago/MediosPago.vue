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
            v-model="filterString"
            v-on:input="filterObjects(filterString, paginate.page - 1, paginate.size)"
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

    <!-- List -->
    <v-simple-table style="background-color: transparent;">
      <template v-slot:default>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Planes asociados</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody v-for="object in objects" :key="object.id">
          <tr>
            <td>{{object.id}}</td>
            <td>{{object.nombre}}</td>
            <td><v-icon title="Ver planes" @click="openPlans(object.planPago)">mdi-clipboard-list</v-icon></td>
            <td>
              <a title="Editar"><img src="/../../images/icons/ico_10.svg" @click="edit(object.id)" width="40" height="40"/></a>
              <a title="Eliminar"><img src="/../../images/icons/ico_11.svg" @click="openDelete(object.id)" width="40" height="40"/></a>
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

    <!-- Dialog Planes-->
    <v-dialog v-model="seePlansDialog" width="300">
      <v-card>
        <v-toolbar class="d-flex justify-center" color="primary" dark>
          <v-toolbar-title>Planes</v-toolbar-title>
        </v-toolbar>
        <div v-if="plans != ''" align="center" justify="center">
          <v-list>
            <v-list-item v-for="p in plans" :key="p.id">
                <v-list-item-icon>
                <v-icon>mdi-clipboard-list</v-icon>
                </v-list-item-icon>
                {{p.nombre}}
            </v-list-item>
          </v-list>
        </div>
        <div v-if="plans == ''" align="center" justify="center">
          <img id="ghostImage" src="/../../images/mediosPago/ghost.png"><br>
          <img src="/../../images/mediosPago/shadow.png"><br>
          Nada por aquí...
        </div>
      </v-card>
    </v-dialog>
    <!-- End Dialog Planes -->

  </v-container>
</template>

<script>
import GenericService from "../../services/GenericService";
import XLSX from 'xlsx';

export default {
  data: () => ({
    plans: "",
    file: null,
    objects: [],
    filterString: "",
    paginate: {
      page: 1,
      size: 10,
      totalPages: 0
    },
    loaded: false,
    tenant: "",
    service: "mediosPago",
    token: localStorage.getItem("token"),
    dialogDeleteObject: false,
    seePlansDialog: false,
    loguedUser: null
  }),
  mounted() {
    this.tenant = this.$route.params.tenant;
    this.getLoguedUser();
  },
  methods: {

    getLoguedUser(){
      GenericService(this.tenant, this.service, this.token)
      .getLoguedUser()
      .then(data => {
        this.loguedUser = data.data;
        this.filterObjects(this.filterString, this.paginate.page - 1, this.paginate.size);
      })
    },

    filterObjects(param, page, size){
      this.loaded = false;
      let id;
      if(this.loguedUser.perfil.id < 3){
        id = ""
      }else{
        id = this.loguedUser.sucursal.id;
      }

      GenericService(this.tenant, this.service, this.token)
        .filter({id, param, page, size})
        .then(data => {
          this.objects = data.data.content;
          this.paginate.totalPages = data.data.totalPages;
          if(this.paginate.totalPages < this.paginate.page){
              this.paginate.page = 1;
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

    openDelete(id) {
      this.idObjet = id;
      this.dialogDeleteObject = true;
    },

    openPlans(plans){
      this.plans = plans;
      this.seePlansDialog = true;
    },

    deleteObject() {
      this.dialog = true;
      this.dialogDeleteObject = false;
      GenericService(this.tenant, this.service, this.token)
        .delete(this.idObjet)
        .then(() => {
          this.getLoguedUser()
        });
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
              this.getLoguedUser();
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
      var importacion = {
        status: true,
        data: [],
        message: ""
      };
      objects.forEach((element, index) => {
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