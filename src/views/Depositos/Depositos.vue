<template>
  <v-container
    style="min-width: 98%;
  margin-right:40px;
  "
  >
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
          <v-col cols="1"></v-col>
          <v-col cols="2">
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
      <v-data-table
        :headers="headers"
        :items="depositos"
        class="elevation-6"
        ref="depositosTable"
        hide-default-footer
      >
        <template v-slot:[`item.defaultDeposit`]="{ item , index}">
          <p v-show="viewCheckboxState === 1">
            {{(item.defaultDeposit) ? checkboxModel[index] = true : checkboxModel[index] = false}}
          </p>
          <v-checkbox
           v-model="checkboxModel[index]"
           @change="selectDefaultDeposit1(item)"
          ></v-checkbox>
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
         <Edit :itemId="item.id" v-on:editItem="editItem" />
          <Delete :itemId="item.id" v-on:deleteItem="deleteItem"/>
        </template>
        <template v-slot:[`item.cantidad`]="{ item }">
          <span v-if="!item.cantidadMinima"
            >Sin existencias mínimas asignadas</span
          >
          <span v-if="item.cantidadMinima">{{ item.cantidadMinima }}</span>
        </template>
      </v-data-table>
      <Pagination
        :page="filterParams.page"
        :totalPages="filterParams.totalPages"
        :totalVisible="7"
        v-on:changePage="filterObjects"
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
import Edit from "../../components/Buttons/Edit";
import Delete from "../../components/Buttons/Delete";
import GenericService from "../../services/GenericService";
import XLSX from "xlsx";
import StockHistoryDialog from "../../components/Dialogs/StockHistoryDialog";
//import DepositosTable from "../../components/Tables/DepositosTable";
import Pagination from "../../components/Pagination";
import Spinner from "../../components/Graphics/Spinner";
import DeleteDialog from "../../components/Dialogs/DeleteDialog";
export default {
  props: {
    isChecked: [],
  },
  data: () => ({
    radioGroup: "",
    item: "",
    selected: "",
    stocks: [],
    checkboxModel:{},
    depositos: [],
    defaultDeposit: [],
    file: null,
    viewCheckboxState: 0,
    filterParams: {
      depositoName: "",
      perfilId: "",
      sucursalId: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    headers: [
      { text: "Nombre", value: "nombre" },
      { text: "Deposito predeterminado", value: "defaultDeposit" },
      { text: "Acciones", value: "acciones", sortable: false },
    ],
    loaded: false,
    tenant: "",
    service: "depositos",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
  }),

  components: {
    StockHistoryDialog,
    //DepositosTable,
    DeleteDialog,
    Spinner,
    Edit,
    Delete,
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
    persist() {
      localStorage.isChecked = this.isChecked;
    },
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

    add(object) {
      this.$emit("add", object);
    },
    uncheck(object) {
      this.$emit("uncheck", object);
    },

    selectDefaultDeposit2(object) {
      this.$emit("selectDefaultDeposit", object);
    },
    initIsChecked: function() {
      const stored = localStorage.getItem("isChecked");
      if (stored === null) {
        console.log("Nothing stored; default to `true`");
        return true;
      } else {
        console.log("Using stored value " + stored);
        return stored == "true";
      }
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

    newObject() {
      this.$router.push({ name: "depositosForm", params: { id: 0 } });
    },

    openStockMovementHistoryDialog() {
      this.$store.commit("stocks/stockHistoryDialogMutation");
    },

    addDepositDefault(deposit) {
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          let allDeposits = data.data.content;
          let allDefaultDeposits = allDeposits.filter(
            (el) => el.defaultDeposit === "1"
          );
          if (allDefaultDeposits.length > 0) {
            let defaultBranchDeposit = allDefaultDeposits.filter(
              (el) => el.sucursales.id === deposit.sucursales.id
            )[0];

            if (defaultBranchDeposit.length > 0) {
              this.defaultDeposit = this.defaultBranchDeposit.filter(
                (el) => el.id != deposit.id
              );
              this.deposit.filter(
                (el) => el.id === deposit.id
              )[0].selected = false;
              this.$refs.depositosTable.$forceUpdate();
            } else {
              this.defaultDeposit.push(allDefaultDeposits);
              this.deposit.filter(
                (el) => el.id === deposit.id
              )[0].selected = true;
              this.$refs.depositosTable.$forceUpdate();
            }
          } else {
            this.defaultDeposit.push(allDefaultDeposits);
            this.deposit.filter(
              (el) => el.id === deposit.id
            )[0].selected = true;
            this.$refs.depositosTable.$forceUpdate();
          }
        });
    },
    selectDefaultDeposit1(deposit) {
      this.loaded = false;
      const filterParams = {
        id: "",
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
    selectDefaultDeposit(item) {
      if (this.defaultDeposit.length > 0) {
        const filterDepositos = this.defaultDeposit.filter(
          (el) => el.id === item.id
        );
        if (filterDepositos.length > 0) {
          this.defaultDeposit = this.defaultDeposit.filter(
            (el) => el.id != item.id
          );
          this.depositos.filter((el) => el.id === item.id)[0].selected = false;
        } else {
          this.defaultDeposit.push(item);
          this.depositos.filter((el) => el.id === item.id)[0].selected = true;
          this.$refs.depositosTable.$forceUpdate();
        }
      } else {
        this.defaultDeposit.push(item);
        this.depositos.filter((el) => el.id === item.id)[0].selected = true;
        this.$refs.depositosTable.$forceUpdate();
      }

      console.log(this.defaultDeposit);
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
      }, 300);
    },
  },

  watch: {
    isChecked() {
      console.log("storing value " + this.isChecked);
      localStorage.setItem("isChecked", this.isChecked);
    },
  },
};
</script>
