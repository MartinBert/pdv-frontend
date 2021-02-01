<template>
  <v-container>
    <h3>Depositos</h3>
    <v-form class="mb-3">
      <v-row>
        <v-col cols="9" class="mt-2 d-flex">
          <v-btn class="primary" @click="newObject()" raised>NUEVO</v-btn>
          <v-btn class="primary ml-1" @click="openStockMovementHistoryDialog()">MOVIMIENTOS DE STOCK</v-btn>
          <div style="width: 300px">
            <v-file-input
              dense
              v-model="file" 
              class="mt-0"
              placeholder="Importar depósitos"
              accept=".xlsx, xls"
              @change="importDocuments($event)"
            ></v-file-input>
          </div>
        </v-col>
        <v-col cols="3">
          <v-text-field
            style="width:300px"
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
    <v-simple-table style="background-color: transparent;" ref="tab" v-if="loaded">
      <template v-slot:default>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Telefono</th>
            <th>Acciones</th>
            <th>Depósito predeterminado</th>
          </tr>
        </thead>
        <tbody v-for="object in objects" :key="object.id">
          <tr>
            <td>{{object.id}}</td>
            <td>{{object.nombre}}</td>
            <td>{{object.direccion}}</td>
            <td>{{object.telefono}}</td>
            <td>
              <a title="Editar"><img src="/../../images/icons/ico_10.svg" @click="edit(object.id)" width="40" height="40"/></a>
              <a title="Eliminar"><img src="/../../images/icons/ico_11.svg" @click="openDelete(object.id)" width="40" height="40"/></a>
            </td>
            <td>
              <span v-if="object.defaultDeposit == '1'">
                <v-alert type="success">Definido para descontar stock en ventas</v-alert>
              </span>
              <span v-if="object.defaultDeposit !== '1'">
                <v-btn class="primary" @click="selectDefaultDeposit(object.id)">Elegir como deposito predeterminado</v-btn>
              </span>
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
      @input="filterObjects(filterString, paginate.page - 1, paginate.size)"
      v-if="paginate.totalPages > 1 && loaded"
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

    <StockHistoryDialog />
  </v-container>
</template>

<script>
import GenericService from "../../services/GenericService";
import XLSX from 'xlsx';
import { errorAlert } from '../../helpers/alerts';
import StockHistoryDialog from '../../components/StockHistoryDialog';

export default {
  data: () => ({
    objects: [],
    file: null,
    filterString: "",
    paginate: {
      page: 1,
      size: 10,
      totalPages: 0
    },
    loaded: false,
    tenant: "",
    service: "depositos",
    token: localStorage.getItem("token"),
    dialogDeleteObject: false,
    loguedUser: JSON.parse(localStorage.getItem("userData"))
  }),

  components:{
    StockHistoryDialog
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterObjects(this.filterString, this.paginate.page - 1, this.paginate.size);
  },

  methods: {

    filterObjects(param, page, size){
      this.loaded = false;
      let id;
      if(this.loguedUser.perfil < 3){
        id = ""
      }else{
        id = this.loguedUser.sucursal.id;
      }
      
      GenericService(this.tenant, this.service, this.token)
        .filter({ id, param, page, size })
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
      this.$router.push({ name: "depositosForm", params: { id: 0 } });
    },

    edit(id) {
      this.$router.push({ name: "depositosForm", params: { id: id } });
    },

    openDelete(id) {
      const checkObjectPriority = this.objects.filter(el => el.defaultDeposit === '1')[0];
      if(checkObjectPriority.id !== id){
        this.idObjet = id;
        this.dialogDeleteObject = true;
      }else{
        errorAlert("No puede eliminar el depósito predeterminado para descontar stock en las ventas");
      }
    },

    deleteObject() {
      this.dialog = true;
      this.dialogDeleteObject = false;
        GenericService(this.tenant, this.service, this.token)
        .delete(this.idObjet)
        .then(() => {
          this.filterObjects(this.filterString, this.paginate.page - 1, this.paginate.size);
        })
        .catch(()=>{
          errorAlert("No se puede eliminar este depósito, todavía tiene productos en stock asociados");
        })
      
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
              this.filterObjects(this.filterString, this.paginate.page - 1, this.paginate.size);
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
          element.direccion &&
          element.telefono
        ) {
          var obj = {
            nombre: element.nombre,
            direccion: element.direccion,
            telefono: element.telefono,
            sucursales: this.loguedUser.sucursal
          };
          importacion.data.push(obj);
        } else {
          importacion.status = false;
          importacion.message = "Faltan datos en el renglón " + (index + 2);
        }
      });
      return importacion;
    },

    selectDefaultDeposit(idDeposit){
      this.loaded = false;
      const param = '';
      const page = 0;
      const size = 100000;

      let id;

      if(this.loguedUser.perfil < 3){
        id = ""
      }else{
        id = this.loguedUser.sucursal.id;
      }

      GenericService(this.tenant, this.service, this.token)
      .filter({id, param, page, size})
      .then(data => {
        let allDeposits = data.data.content;

        let currentDefaultDeposit = allDeposits.filter(el => el.defaultDeposit === '1')[0];
        if(currentDefaultDeposit){
          currentDefaultDeposit.defaultDeposit = null;

          GenericService(this.tenant, this.service, this.token)
          .save(currentDefaultDeposit)
          .then(()=>{
            let defaultDeposit = allDeposits.filter(el => el.id === idDeposit)[0];
            defaultDeposit.defaultDeposit = '1';
  
            GenericService(this.tenant, this.service, this.token)
            .save(defaultDeposit);
          })
          .then(()=>{
            setTimeout(()=>{this.filterObjects(this.filterString, this.paginate.page - 1, this.paginate.size);}, 500);
          })
        }else{
          let defaultDeposit = allDeposits.filter(el => el.id === idDeposit)[0];
            defaultDeposit.defaultDeposit = '1';
  
            GenericService(this.tenant, this.service, this.token)
            .save(defaultDeposit)
            .then(()=>{
              setTimeout(()=>{this.filterObjects(this.filterString, this.paginate.page - 1, this.paginate.size);}, 500);
            })
        }
      })
    },

    openStockMovementHistoryDialog(){
      this.$store.commit('stocks/stockHistoryDialogMutation');
    }
  }
};
</script>