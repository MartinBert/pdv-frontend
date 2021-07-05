<template>
  <v-container style="min-width: 98%;
  margin-left:12px;
  margin-right:12px;
  ">
    <v-card>
      <v-form class="mb-0">
        <v-row>
          <v-col cols="9" class="mt-2 d-flex">
            <v-btn class="primary" @click="newObject()" raised>NUEVO</v-btn>
            <v-btn
              class="primary ml-1"
              @click="openStockMovementHistoryDialog()"
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
              v-model="filterParams.depositoName"
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
      <DepositosTable
        :items="depositos"
        v-on:deleteItem="deleteItem"
        v-on:editItem="editItem"
        v-on:selectDefaultDeposit="selectDefaultDeposit"
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
      <StockHistoryDialog />
    </v-card>
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import XLSX from "xlsx";
import StockHistoryDialog from "../../components/Dialogs/StockHistoryDialog";
import DepositosTable from "../../components/Tables/DepositosTable";
import Pagination from "../../components/Pagination";
import Spinner from "../../components/Graphics/Spinner";
import DeleteDialog from "../../components/Dialogs/DeleteDialog";
export default {
  data: () => ({
    depositos: [],
    file: null,
    filterParams: {
      depositoName: "",
      perfilId: "",
      sucursalId: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "depositos",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
  }),

  components: {
    StockHistoryDialog,
    DepositosTable,
    DeleteDialog,
    Spinner,
    Pagination,
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    if (this.loguedUser.perfil > 1) {
      this.filterParams.sucursalId = this.loguedUser.sucursal.id;
    }
    this.filterParams.perfilId = this.loguedUser.perfil;
    this.filterObjects();
  },

  methods: {
    filterObjects(page) {
      if (page) this.filterParams.page = page;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.depositos = data.data.content;
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

    editItem(id) {
      this.$router.push({ name: "depositosForm", params: { id: id } });
    },

    deleteItem(id) {
      this.idObjet = id;
      this.deleteDialogStatus = true;
    },

    deleteConfirmation(result) {
      return result ? this.deleteObject() : (this.deleteDialogStatus = false);
    },

    deleteObject() {
      this.dialog = true;
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
      reader.onload = (e) => {
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
              window.setTimeout(() => {
                this.loader = false;
                this.loaderStatus = false;
              }, 2000);
            });
        }
      };
      reader.readAsBinaryString(this.file);
    },

    validateImport(depositos) {
      this.loader = true;
      var importacion = {
        status: true,
        data: [],
        message: "",
      };
      depositos.forEach((element, index) => {
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

    selectDefaultDeposit(deposit) {
      this.loaded = false;
      const filterParams = {
        depositoName: "",
        perfilId: this.loguedUser.perfil,
        sucursalId: this.loguedUser.sucursal.id,
        page: 1,
        size: 100000,
      };

      GenericService(this.tenant, this.service, this.token)
        .filter(filterParams)
        .then((data) => {
          let allDeposits = data.data.content;
          let allDefaultDeposits = allDeposits.filter(
            (el) => el.defaultDeposit === "1"
          );

          if (allDefaultDeposits.length > 0) {
            let defaultBranchDeposit = allDefaultDeposits.filter(
              (el) => el.sucursales.id === deposit.sucursales.id
            )[0];

            if (defaultBranchDeposit) {
              this.modifyDepositStatus(
                defaultBranchDeposit,
                "nullDefaultStatus"
              );
              this.modifyDepositStatus(deposit, "changeStatusToDefaultDeposit");
              this.refreshView();
            } else {
              this.modifyDepositStatus(deposit, "changeStatusToDefaultDeposit");
              this.refreshView();
            }
          } else {
            this.modifyDepositStatus(deposit, "changeStatusToDefaultDeposit");
            this.refreshView();
          }
        });
    },

    openStockMovementHistoryDialog() {
      this.$store.commit("stocks/stockHistoryDialogMutation");
    },

    modifyDepositStatus(deposit, statusType) {
      if (statusType === "nullDefaultStatus") {
        deposit.defaultDeposit = null;
        GenericService(this.tenant, this.service, this.token).save(deposit);
      } else {
        deposit.defaultDeposit = "1";
        GenericService(this.tenant, this.service, this.token).save(deposit);
      }
    },

    refreshView() {
      setTimeout(() => {
        this.filterObjects();
      }, 500);
    },
  },
};
</script>
