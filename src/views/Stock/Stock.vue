<template>
  <v-container
   style="min-width: 98%;
   margin-left:1px;
   "
  >
    <v-tabs fixed-tabs background-color="indigo" dark>
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
      <StocksTable
        :items="stocks"
        v-on:editItem="edit"
        v-on:deleteItem="deleteItem"
        v-on:add="addToMigration"
        v-on:uncheck="removeOfMigration"
        v-if="loaded"
        ref="stockTable"
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
//import TabBar from "../../components/Generics/TabBar.vue";
import GenericService from "../../services/GenericService";
import StocksService from "../../services/StocksService";
import ModifyMinimumStocksDialog from "../../components/Dialogs/ModifyMinimumStocksDialog";
import StockReportsDialog from "../../components/Dialogs/StockReportsDialog";
import StocksTable from "../../components/Tables/StocksTable";
import Pagination from "../../components/Pagination";
import Spinner from "../../components/Graphics/Spinner";
import DeleteDialog from "../../components/Dialogs/DeleteDialog";
import DepositMigrationDialog from "../../components/Dialogs/DepositMigrationDialog";
import { getCurrentDate, formatDate } from "../../helpers/dateHelper";
export default {
  data: () => ({
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
      size: 10,
      totalPages: 0,
    },
    depositsFilterParams: {
      depositoName: "",
      perfilId: "",
      sucursalId: "",
      page: 1,
      size: 100000,
    },
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
    tabs: [
      { id: 1, title: "Lista", route: "/stock" },
      { id: 2, title: "Nuevo", route: "/stock/form/0" },
      { id: 3, title: "Existencias minimas"},
      { id: 4, title: "Migrar Stock" },
    ],
    activeTab: 1,
  }),

  components: {
    ModifyMinimumStocksDialog,
    DepositMigrationDialog,
    StockReportsDialog,
    StocksTable,
    Pagination,
    Spinner,
    //TabBar,
    DeleteDialog,
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
      GenericService(this.tenant, this.service, this.token)
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

    searchForDeposit(typeList) {
      this.filterParams.stockDepositoId = typeList;
      StocksService(this.tenant, "stock", this.token)
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
    gotoList() {
      this.$router.push({ name: "stock", params: { id: 0 } });
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

    addToMigration(object) {
      this.migration.push(object);
      this.stocks.filter((el) => el.id === object.id)[0].selected = true;
      this.$refs.stockTable.$forceUpdate();
    },

    removeOfMigration(object) {
      this.migration = this.migration.filter((el) => el.id !== object.id);
      this.stocks.filter((el) => el.id === object.id)[0].selected = false;
      this.$refs.stockTable.$forceUpdate();
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
