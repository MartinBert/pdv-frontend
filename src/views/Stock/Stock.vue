<template>
  <v-container
    style="min-width: 98%;
   margin-left:1px;
   "
  >
    <v-tabs
      fixed-tabs
      background-color="indigo"
      dark
      style="margin-bottom:13px"
    >
      <v-tab @click="newObject()" raise>
        Nuevo
      </v-tab>
      <v-tab @click="openDialog('minimumStockRestriction')" raised>
        Existencias Minimas
      </v-tab>
      <v-tab @click="openDialog('stockMigration')">
        Migrar Stock
      </v-tab>
      <v-tab @click="openDialog('reports')">
        Reportes
      </v-tab>
    </v-tabs>
    <br />
    <v-card>
      <v-row class="ml-1">
        <v-col cols="3">
          <v-autocomplete
            :items="depositos"
            item-text="nombre"
            item-value="id"
            label="Depósito"
            v-model="typeList"
            @change="filterObjects()"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="search1"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            class="text-left mt-2"
            label="Buscar en Todo"
            append-icon="mdi-magnify"
            style="width: 500px"
          ></v-text-field>
        </v-col>
        <v-col>
          <form @submit.prevent="migrateStockToOtherDeposit()">
            <v-autocomplete
              :items="realDeposits"
              item-text="nombre"
              :return-object="true"
              label="A depósito"
              v-model="destinationDepositForMigrations"
              required
              style="width: 250px"
            />
            <v-btn
              class="primary"
              type="submit"
              style="margin-left:300px;
          margin-top:-120px
          "
              >Migrar seleccionados</v-btn
            >
          </form>
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="stocks"
        :search="search1"
        class="elevation-6"
        ref="stockTable"
        hide-default-footer
      >
        <template v-slot:[`item.acciones`]="{ item }">
          <v-icon small class="mr-2" @click="edit(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:[`item.migrar`]="{ item }">
          <v-checkbox color="indigo" @click="addToMigration(item)"></v-checkbox>
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
      <ModifyMinimumStocksDialog
        v-on:stocksRestrictions="applyMassiveStocksRestrictions()"
      />
      <DepositMigrationDialog
        v-on:depositsForMigrationProcess="applyMassiveChangesInDeposits()"
      />
      <StockReportsDialog
        :loguedUser="loguedUser"
        :tenant="tenant"
        :service="service"
        :token="token"
      />
    </v-card>
  </v-container>
</template>
<script>
//import Add from "../../components/Buttons/Add.vue";
//import Checked from "../../components/Buttons/Checked.vue";
import GenericService from "../../services/GenericService";
import StocksService from "../../services/StocksService";
import ModifyMinimumStocksDialog from "../../components/Dialogs/ModifyMinimumStocksDialog";
import StockReportsDialog from "../../components/Dialogs/StockReportsDialog";
//import StocksTable from "../../components/Tables/StocksTable";
import Pagination from "../../components/Pagination";
import Spinner from "../../components/Graphics/Spinner";
import DeleteDialog from "../../components/Dialogs/DeleteDialog";
import DepositMigrationDialog from "../../components/Dialogs/DepositMigrationDialog";
import { getCurrentDate, formatDate } from "../../helpers/dateHelper";
import Swal from "sweetalert2";
export default {
  props: {
    level: {},
  },
  data: () => ({
    depositoRules: [(v) => !!v || "Campo requerido"],
    required: {
      type: Boolean,
      default: false,
    },
    check: false,
    selected: [],
    search1: "",
    stocks: [],
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    filterParams: {
      productoName: "",
      productoCodigo: "",
      productoCodigoBarras: "",
      productoMarcaName: "",
      productoPrimerAtributoName: "",
      productoSegundoAtributoName: "",
      productoTercerAtributoName: "",
      productoEstado: 0,
      stockDepositoId: "",
      sucursalId: "",
      perfilId: "",
      page: 1,
      size: 1000000,
      totalPages: 0,
    },
    depositsFilterParams: {
      depositoName: "",
      perfilId: "",
      sucursalId: "",
      page: 1,
      size: 100000,
    },
    productos: [],
    loaded: false,
    tenant: "",
    service: "stock",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    depositos: [],
    realDeposits: [],
    typeList: 0,
    migration: [],
    destinationDepositForMigrations: {},
    headers: [
      { text: "Productos", value: "producto.nombre" },
      { text: "Atributos", value: "producto.atributos[0].valor" },
      { text: "Marca", value: "producto.marca.nombre" },
      { text: "Codigo de Barras", value: "producto.codigoBarra" },
      { text: "Codigo de producto", value: "producto.codigoProducto" },
      { text: "Cantidad", value: "cantidad" },
      { text: "Cantidad Minima", value: "cantidadMinima" },
      { text: "Deposito", value: "deposito.nombre" },
      { text: "Acciones", value: "acciones", sortable: false },
      { text: "Migrar a otro Deposito", value: "migrar", sortable: false },
    ],
  }),
  components: {
    ModifyMinimumStocksDialog,
    DepositMigrationDialog,
    StockReportsDialog,
    //StocksTable,
    Pagination,
    Spinner,
    DeleteDialog,
    // Add,
    //Checked,
  },
  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterParams.perfilId = this.loguedUser.perfil;
    this.depositsFilterParams.perfilId = this.loguedUser.perfil;
    if (this.loguedUser.perfil > 1) {
      this.filterParams.sucursalId = this.loguedUser.sucursal.id;
      this.depositsFilterParams.sucursalId = this.loguedUser.sucursal.id;
    }
    this.filterObjects();
    this.getOtherModels();
  },
  methods: {
    filterObjects(page) {
      if (page) this.filterParams.page = page;
      if (this.typeList > 0) {
        this.searchForDeposit(this.typeList);
      } else {
        this.search();
      }
    },
    search() {
      GenericService(this.tenant, "stock", this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.stocks = data.data.content;
          if (this.migration.length > 0) {
            this.migration.filter((el) => {
              this.stocks.filter((e) => {
                if (el.id === e.id) {
                  e.selected = true;
                }
              });
            });
          }
          this.filterParams.totalPages = data.data.totalPages;
          if (this.filterParams.totalPages < this.filterParams.page) {
            this.filterParams.page = 1;
          }
          this.loaded = true;
        });
    },

    changeIcon() {},

    searchForDeposit(typeList) {
      this.filterParams.stockDepositoId = typeList;
      StocksService(this.tenant, this.service, this.token)
        .filterStockForDepositId(this.filterParams)
        .then((data) => {
          this.stocks = data.data.content;
          if (this.migration.length > 0) {
            this.migration.filter((el) => {
              this.stocks.filter((e) => {
                if (el.id === e.id) {
                  e.selected = true;
                }
              });
            });
          }
          this.filterParams.totalPages = data.data.totalPages;
          if (this.filterParams.totalPages < this.filterParams.page) {
            this.filterParams.page = 1;
          }
          this.loaded = true;
        });
    },
    getOtherModels() {
      GenericService(this.tenant, "depositos", this.token)
        .filter(this.depositsFilterParams)
        .then((data) => {
          this.depositos = data.data.content;
          this.depositos.push({
            id: 0,
            nombre: "Todos",
          });
          this.realDeposits = this.depositos.filter((el) => el.id !== 0);
        });
    },
    newObject() {
      this.$router.push({ name: "stockForm", params: { id: 0 } });
    },
    edit(id) {
      this.$router.push({ name: "stockForm", params: { id: id } });
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
    applyMassiveStocksRestrictions() {
      this.$store.commit("stocks/dialogMutation");
      this.loaded = false;
      let filterParams = {
        productoName: "",
        productoCodigo: "",
        productoCodigoBarras: "",
        productoMarcaName: "",
        productoPrimerAtributoName: "",
        productoSegundoAtributoName: "",
        productoTercerAtributoName: "",
        productoEstado: 0,
        stockDepositoId: "",
        sucursalId: "",
        perfilId: "",
        page: 1,
        size: 100000,
      };
      filterParams.perfilId = this.loguedUser.perfil;
      if (this.loguedUser.perfil > 1) {
        filterParams.sucursalId = this.loguedUser.sucursal.id;
      }
      GenericService(this.tenant, this.service, this.token)
        .filter(filterParams)
        .then((data) => {
          let stockWithRestrictions = data.data.content.map((el) => {
            el.cantidadMinima = this.$store.state.stocks.minimumQuantity;
            return el;
          });
          stockWithRestrictions.forEach((el) => {
            GenericService(this.tenant, this.service, this.token).save(el);
          });
          this.saveHistorial(
            stockWithRestrictions,
            "Cambio masivo en límite de existencias mínimas"
          );
          this.$store.commit("stocks/resetStates");
          this.filterObjects(this.typeList);
        });
    },
    applyMassiveChangesInDeposits() {
      this.loaded = false;
      let filterParams = {
        productoName: "",
        productoCodigo: "",
        productoCodigoBarras: "",
        productoMarcaName: "",
        productoPrimerAtributoName: "",
        productoSegundoAtributoName: "",
        productoTercerAtributoName: "",
        productoEstado: 0,
        stockDepositoId: "",
        sucursalId: "",
        perfilId: "",
        page: 1,
        size: 100000,
      };
      filterParams.perfilId = this.loguedUser.perfil;
      if (this.loguedUser.perfil > 1) {
        filterParams.sucursalId = this.loguedUser.sucursal.id;
      }
      let depositToModifyId = this.$store.state.stocks.selectedDeposits[0].id;
      let newDepositForProducts = this.$store.state.stocks.selectedDeposits[1];
      GenericService(this.tenant, this.service, this.token)
        .filter(filterParams)
        .then((data) => {
          let affectedProducts = data.data.content.filter(
            (el) => el.deposito.id == depositToModifyId
          );
          affectedProducts.forEach((el) => {
            el.deposito = newDepositForProducts;
            el.algorim = el.producto.codigoBarra + el.deposito.id;
            GenericService(this.tenant, this.service, this.token).update(el);
          });

          this.saveHistorial(
            affectedProducts,
            "Movimiento masivo de stock entre depósitos"
          );
          this.$store.commit("stocks/resetStates");
          setTimeout(() => {
            this.filterObjects(this.typeList);
          }, 500);
        });
    },

    add(item) {
      this.$emit("add", item);
    },
    addToMigration(item) {
      if (this.migration.length > 0) {
        const filterMigration = this.migration.filter(
          (el) => el.id === item.id
        );
        if (filterMigration.length > 0) {
          this.migration = this.migration.filter((el) => el.id != item.id);
          this.stocks.filter((el) => el.id === item.id)[0].selected = false;
          this.$refs.stockTable.$forceUpdate();
        } else {
          this.migration.push(item);
          this.stocks.filter((el) => el.id === item.id)[0].selected = true;
          this.$refs.stockTable.$forceUpdate();
        }
      } else {
        this.migration.push(item);
        this.stocks.filter((el) => el.id === item.id)[0].selected = true;
        this.$refs.stockTable.$forceUpdate();
      }

      console.log(this.migration);
    },
    removeOfMigration(item) {
      this.migration = this.migration.filter((el) => el.id !== item.id);
      this.stocks.filter((el) => el.id === item.id)[0].selected = false;
      this.$refs.stockTable.$forceUpdate();
    },
    migrateStockToOtherDeposit() {
      if (this.migration.length > 0) {
        this.loaded = false;
        this.migration.forEach((el) => {
          el.deposito = this.destinationDepositForMigrations;
          el.algorim = el.producto.codigoBarra + el.deposito.id;
          GenericService(this.tenant, "stock", this.token).update(el);
        });

        Swal.fire("Exitosa", "", "success");

        this.saveHistorial(this.migration, "Migración de productos");

        this.migration = [];
        this.destinationDepositForMigrations = {};
        setTimeout(() => {
          this.filterObjects(this.typeList);
        }, 500);
      } else {
        this.$errorAlert(
          "Debe seleccionar al menos 1 producto para migrar su stock de depósito"
        );
      }
    },
    saveHistorial(stocks, str) {
      const stockHistory = {
        stocks: stocks,
        descripcion: str,
        fecha: formatDate(getCurrentDate()),
        usuario: this.loguedUser.nombre,
        sucursal: this.loguedUser.sucursal,
      };
      GenericService(this.tenant, "historialStock", this.token).save(
        stockHistory
      );
    },
    openDialog(param) {
      switch (param) {
        case "minimumStockRestriction": {
          this.$store.commit("stocks/dialogMutation");
          break;
        }
        case "stockMigration": {
          const deposits = this.depositos.filter((el) => el.id !== 0);
          this.$store.commit("stocks/allDepositsMutation", deposits);
          this.$store.commit("stocks/depositMigrationDialogMutation");
          break;
        }
        default: {
          this.$store.commit("stocks/stockReportsDialogMutation");
          break;
        }
      }
    },
    setAtributesValues(atributes) {
      let str = atributes.reduce((acc, element) => {
        if (element.valor) {
          return acc + element.valor + ",";
        } else {
          return acc + element.valorNumerico.toString() + ",";
        }
      }, "");
      return str;
    },
    modifyAlgorim() {
      this.loaded = false;
      GenericService(this.tenant, this.service, this.token)
        .getAll(0, 100000)
        .then((data) => {
          let stockForModify = data.data.content;
          stockForModify.forEach((el) => {
            el.algorim = el.producto.codigoBarra + el.deposito.id;
          });
          GenericService(this.tenant, this.service, this.token)
            .saveAll(stockForModify)
            .then(() => {
              this.filterObjects();
            })
            .catch((err) => {
              console.log(err);
            });
        });
    },

    uncheck(object) {
      this.$emit("uncheck", object, "uncheck");
    },
    checkStocks() {
      GenericService(this.tenant, this.service, this.token)
        .getAll(0, 100000)
        .then((data) => {
          console.log(data.data.content);
        });
    },
  },
};
</script>
<style>
.oculto {
  display: none;
  color: red;
}
.visible {
  display: block;
}
</style>
