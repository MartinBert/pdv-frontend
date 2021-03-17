<template>
  <v-container>
    <v-form>
      <v-row>
        <v-col cols="6">
          <v-btn class="primary" @click="newObject()" raised>Nuevo</v-btn>
          <v-btn class="primary ml-1" @click="openDialog('minimumStockRestriction')" raised
            >EXISTENCIAS MÍNIMAS</v-btn
          >
          <v-btn class="primary ml-1" @click="openDialog('stockMigration')"
            >MIGRAR STOCK</v-btn
          >
          <v-btn class="primary ml-1" @click="openDialog('reports')">Reportes</v-btn>
          <v-btn class="primary ml-1" @click="modifyAlgorim()" v-if="loguedUser.perfil < 2">Cambiar marca de algoritmo de stock</v-btn>
          <v-btn class="primary ml-1" @click="checkStocks()" v-if="loguedUser.perfil < 2">Check stock</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-autocomplete
            :items="depositos"
            item-text="nombre"
            item-value="id"
            label="Depósito"
            v-model="typeList"
            @change="filterObjects()"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="filterParams.productoName"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            class="text-left mt-2"
            label="Nombre"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="filterParams.productoCodigo"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            class="text-left mt-2"
            label="Codigo"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="filterParams.productoCodigoBarras"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            class="text-left mt-2"
            label="Codigo de barras"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="filterParams.productoMarcaName"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            class="text-left mt-2"
            label="Marca"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="filterParams.productoPrimerAtributoName"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            class="text-left mt-2"
            label="Atributo"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
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
    <Spinner v-if="!loaded"/>
    <DeleteDialog
      :status="deleteDialogStatus"
      v-on:deleteConfirmation="deleteConfirmation"
    />
    <v-row>
      <v-col cols="12">
        <form @submit.prevent="migrateStockToOtherDeposit()">
          <v-btn class="primary" type="submit">Migrar seleccionados</v-btn>
          <v-autocomplete
            :items="realDeposits"
            item-text="nombre"
            :return-object="true"
            label="A depósito"
            v-model="destinationDepositForMigrations"
            required
            style="width: 250px"
          />
        </form>
      </v-col>
    </v-row>
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
  </v-container>
</template>

<script>
import GenericService from "../../services/GenericService";
import StocksService from "../../services/StocksService";
import ModifyMinimumStocksDialog from "../../components/ModifyMinimumStocksDialog";
import StockReportsDialog from "../../components/StockReportsDialog";
import StocksTable from "../../components/Tables/StocksTable";
import Pagination from "../../components/Pagination";
import Spinner from "../../components/Spinner";
import DeleteDialog from "../../components/Dialogs/DeleteDialog";
import DepositMigrationDialog from "../../components/DepositMigrationDialog";
import { getCurrentDate, formatDate } from '../../helpers/dateHelper';

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
      totalPages: 0
    },
    depositsFilterParams:{
      depositoName: "",
      perfilId: "",
      sucursalId: "",
      page: 1,
      size: 100000
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
    destinationDepositForMigrations: {}
  }),

  components: {
    ModifyMinimumStocksDialog,
    DepositMigrationDialog,
    StockReportsDialog,
    StocksTable,
    Pagination,
    Spinner,
    DeleteDialog
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterParams.perfilId = this.loguedUser.perfil;
    this.depositsFilterParams.perfilId = this.loguedUser.perfil;
    if(this.loguedUser.perfil > 1){
      this.filterParams.sucursalId = this.loguedUser.sucursal.id;
      this.depositsFilterParams.sucursalId = this.loguedUser.sucursal.id;
    }
    this.filterObjects();
    this.getOtherModels();
  },

  methods: {
    filterObjects(page) {
      if(page) this.filterParams.page = page;
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
          if(this.migration.length > 0){
            this.migration.filter(el => {
              this.stocks.filter(e => {
                if(el.id === e.id){
                  e.selected = true;
                }
              })
            })
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
          if(this.migration.length > 0){
            this.migration.filter(el => {
              this.stocks.filter(e => {
                if(el.id === e.id){
                  e.selected = true;
                }
              })
            })
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
          this.realDeposits = this.depositos.filter(el => el.id !== 0);
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
        size: 100000
      }
      filterParams.perfilId = this.loguedUser.perfil;
      if(this.loguedUser.perfil > 1){
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

          this.saveHistorial(stockWithRestrictions, "Cambio masivo en límite de existencias mínimas");

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
        size: 100000
      }
      filterParams.perfilId = this.loguedUser.perfil;
      if(this.loguedUser.perfil > 1){
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
          

          this.saveHistorial(affectedProducts, "Movimiento masivo de stock entre depósitos");

          this.$store.commit("stocks/resetStates");
          setTimeout(()=>{this.filterObjects(this.typeList);}, 500);
        });
    },

    addToMigration(object){
      this.migration.push(object);
      this.stocks.filter(el => el.id === object.id)[0].selected = true;
      this.$refs.stockTable.$forceUpdate();
    },

    removeOfMigration(object){
      this.migration = this.migration.filter(el => el.id !== object.id);
      this.stocks.filter(el => el.id === object.id)[0].selected = false;
      this.$refs.stockTable.$forceUpdate();
    },

    migrateStockToOtherDeposit(){
      if(this.migration.length > 0){
        this.loaded = false;
        this.migration.forEach(el => {
          el.deposito = this.destinationDepositForMigrations;
          el.algorim = el.producto.codigoBarra + el.deposito.id;
          GenericService(this.tenant, this.service, this.token)
          .update(el);
        })
        
        this.saveHistorial(this.migration, "Migración de productos");
        
        this.migration = [];
        this.destinationDepositForMigrations = {};

        setTimeout(()=>{this.filterObjects(this.typeList);}, 500);
      }else{
        this.$errorAlert("Debe seleccionar al menos 1 producto para migrar su stock de depósito");
      }
    },

    saveHistorial(stocks, str){
      const stockHistory = {
        stocks: stocks,
        descripcion: str,
        fecha: formatDate(getCurrentDate()),
        usuario:this.loguedUser.nombre,
        sucursal: this.loguedUser.sucursal
      }

      GenericService(this.tenant, 'historialStock', this.token)
      .save(stockHistory);
    },

    openDialog(param){
      switch (param) {
        case "minimumStockRestriction":{
          this.$store.commit("stocks/dialogMutation");

          break;
        }
        case "stockMigration":{
          const deposits = this.depositos.filter((el) => el.id !== 0);
          this.$store.commit("stocks/allDepositsMutation", deposits);
          this.$store.commit("stocks/depositMigrationDialogMutation");

          break;
        }
        default:{
          this.$store.commit('stocks/stockReportsDialogMutation');

          break;
        }
      }
    },

    setAtributesValues(atributes){
      let str = atributes.reduce((acc, element) => {
        if(element.valor){
          return acc + element.valor + ",";
        }else{
          return acc + element.valorNumerico.toString() + ",";
        }
      }, "");

      return str;
    },

    modifyAlgorim(){
      this.loaded = false;
      GenericService(this.tenant, this.service, this.token)
      .getAll(0, 100000)
      .then(data => {
        let stockForModify = data.data.content;
        stockForModify.forEach(el => {
          el.algorim = el.producto.codigoBarra + el.deposito.id;
        })
        GenericService(this.tenant, this.service, this.token)
        .saveAll(stockForModify)
        .then(()=>{
          this.filterObjects();
        })
        .catch(err => {
          console.log(err);
        })
      })
    },

    checkStocks(){
      GenericService(this.tenant, this.service, this.token)
      .getAll(0, 100000)
      .then(data => {
        console.log(data.data.content);
      })
    }
  },
};
</script>