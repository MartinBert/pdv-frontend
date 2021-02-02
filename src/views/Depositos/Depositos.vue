<template>
  <v-container>
    <h3>Depositos</h3>
    <v-form class="mb-3">
      <v-row>
        <v-col cols="9" class="mt-2 d-flex">
          <v-btn class="primary" @click="newObject()" raised>NUEVO</v-btn>
          <v-btn class="primary ml-1" @click="openStockMovementHistoryDialog()"
            >MOVIMIENTOS DE STOCK</v-btn
          >
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
            style="width: 300px"
            v-model="filterParams.stringParam"
            v-on:input="
              filterObjects(
                loguedUser.perfil,
                filterParams.stringParam,
                filterParams.page - 1,
                filterParams.size
              )
            "
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
    <v-simple-table
      style="background-color: transparent"
      ref="tab"
      v-if="loaded"
    >
      <template v-slot:default>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Telefono</th>
            <th>Acciones</th>
            <th>Depósito predeterminado</th>
            <th v-if="loguedUser.perfil <= 2">Sucursal</th>
          </tr>
        </thead>
        <tbody v-for="object in objects" :key="object.id">
          <tr>
            <td>{{ object.id }}</td>
            <td>{{ object.nombre }}</td>
            <td>{{ object.direccion }}</td>
            <td>{{ object.telefono }}</td>
            <td>
              <a title="Editar"
                ><img
                  src="/../../images/icons/ico_10.svg"
                  @click="edit(object.id)"
                  width="40"
                  height="40"
              /></a>
              <a title="Eliminar"
                ><img
                  src="/../../images/icons/ico_11.svg"
                  @click="openDelete(object.id)"
                  width="40"
                  height="40"
              /></a>
            </td>
            <td>
              <span v-if="object.defaultDeposit == '1'">
                <v-alert type="success"></v-alert>
              </span>
              <span v-if="object.defaultDeposit !== '1'">
                <v-btn class="primary" @click="selectDefaultDeposit(loguedUser.perfil, object)"
                  >Elegir predeterminado</v-btn
                >
              </span>
            </td>
            <td v-if="loguedUser.perfil <= 2">
              {{ object.sucursales.nombre }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <!-- End List -->

    <!-- Loader -->
    <div class="text-center" style="margin-top: 15px" v-if="!loaded">
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
      @input="
        filterObjects(
          loguedUser.perfil,
          filterParams.stringParam,
          filterParams.page - 1,
          filterParams.size
        )
      "
      v-if="filterParams.totalPages > 1 && loaded"
    ></v-pagination>
    <!-- End filterParams -->

    <!-- Dialog Delete-->
    <v-dialog v-model="dialogDeleteObject" width="500">
      <v-card>
        <v-toolbar class="d-flex justify-center" color="primary" dark>
          <v-toolbar-title>Eliminar objeto</v-toolbar-title>
        </v-toolbar>
        <v-card-title class="d-flex justify-center"
          >¿Está seguro que desea realizar esta acción?</v-card-title
        >
        <v-card-actions class="d-flex justify-center pb-4">
          <v-btn small color="disabled" class="mr-5" @click="deleteObject"
            >Si</v-btn
          >
          <v-btn small color="disabled" @click="dialogDeleteObject = false"
            >No</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End Dialog Delete -->

    <StockHistoryDialog />
  </v-container>
</template>

<script>
import GenericService from "../../services/GenericService";
import XLSX from "xlsx";
import { errorAlert } from "../../helpers/alerts";
import StockHistoryDialog from "../../components/StockHistoryDialog";

export default {
  data: () => ({
    objects: [],
    file: null,
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
    service: "depositos",
    token: localStorage.getItem("token"),
    dialogDeleteObject: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
  }),

  components: {
    StockHistoryDialog,
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterObjects(
      this.loguedUser.perfil,
      this.filterParams.stringParam,
      this.filterParams.page - 1,
      this.filterParams.size
    );
  },

  methods: {
    filterObjects(idPerfil, stringParam, page, size) {
      this.loaded = false;
      let idSucursal;
      switch (idPerfil) {
        case 1:
          idSucursal = "";
          break;
        default:
          idSucursal = this.loguedUser.sucursal.id;
          break;
      }

      GenericService(this.tenant, this.service, this.token)
        .filter({idPerfil, idSucursal, stringParam, page, size})
        .then((data) => {
          this.objects = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          if (this.filterParams.totalPages < this.filterParams.page) {
            this.filterParams.page = 1;
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
      const checkObjectPriority = this.objects.filter(
        (el) => el.defaultDeposit === "1"
      )[0];
      if (checkObjectPriority.id !== id) {
        this.idObjet = id;
        this.dialogDeleteObject = true;
      } else {
        errorAlert(
          "No puede eliminar el depósito predeterminado para descontar stock en las ventas"
        );
      }
    },

    deleteObject() {
      this.dialog = true;
      this.dialogDeleteObject = false;
      GenericService(this.tenant, this.service, this.token)
        .delete(this.idObjet)
        .then(() => {
          this.filterObjects(
            this.loguedUser.perfil,
            this.filterParams.stringParam,
            this.filterParams.page - 1,
            this.filterParams.size
          );
        })
        .catch(() => {
          errorAlert(
            "No se puede eliminar este depósito, todavía tiene productos en stock asociados"
          );
        });
    },

    importDocuments(event) {
      this.file = event;
      var excel = [];
      var reader = new FileReader();
      reader.onload = (e) => {
        var data = e.target.result;
        var workbook = XLSX.read(data, { type: "binary" });

        var sheet_name_list = workbook.SheetNames;
        sheet_name_list.forEach(function (y) {
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
              this.filterObjects(
                this.loguedUser.perfil,
                this.filterParams.stringParam,
                this.filterParams.page - 1,
                this.filterParams.size
              );
              this.loaderStatus = true;
              window.setTimeout(() => {
                this.loader = false;
                this.loaderStatus = false;
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
        message: "",
      };
      objects.forEach((element, index) => {
        if (element.nombre && element.direccion && element.telefono) {
          var obj = {
            nombre: element.nombre,
            direccion: element.direccion,
            telefono: element.telefono,
            sucursales: this.loguedUser.sucursal,
          };
          importacion.data.push(obj);
        } else {
          importacion.status = false;
          importacion.message = "Faltan datos en el renglón " + (index + 2);
        }
      });
      return importacion;
    },

    selectDefaultDeposit(idPerfil, deposit) {
      this.loaded = false;
      const stringParam = "";
      const page = 0;
      const size = 100000;
      
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
        .filter({
          idPerfil,
          idSucursal,
          stringParam,
          page,
          size,
        })
        .then((data) => {
          let allDeposits = data.data.content;
          let allDefaultDeposits = allDeposits.filter(el => el.defaultDeposit === "1");

          if (allDefaultDeposits.length > 0) {
            let defaultBranchDeposit = allDefaultDeposits.filter(el => el.sucursales.id === deposit.sucursales.id)[0];
            
            if(defaultBranchDeposit){
              this.modifyDepositStatus(defaultBranchDeposit, 'nullDefaultStatus')
              this.modifyDepositStatus(deposit, 'changeStatusToDefaultDeposit')
              this.refreshView();
            }else{
              this.modifyDepositStatus(deposit, 'changeStatusToDefaultDeposit')
              this.refreshView();
            }
          } else {
            this.modifyDepositStatus(deposit, 'changeStatusToDefaultDeposit')
            this.refreshView();
          }
        });
    },

    openStockMovementHistoryDialog() {
      this.$store.commit("stocks/stockHistoryDialogMutation");
    },

    modifyDepositStatus(deposit, statusType){
      if(statusType === 'nullDefaultStatus'){
        deposit.defaultDeposit = null;
        GenericService(this.tenant, this.service, this.token)
        .save(deposit);
      }else{
        deposit.defaultDeposit = '1';
        GenericService(this.tenant, this.service, this.token)
        .save(deposit);
      }
    },

    refreshView(){
      setTimeout(() => {
          this.filterObjects(
            this.loguedUser.perfil,
            this.filterParams.stringParam,
            this.filterParams.page - 1,
            this.filterParams.size
          );
      }, 500);
    }
  },
};
</script>