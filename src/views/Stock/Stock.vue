<template>
  <v-container>
    <v-form>
      <v-row>
        <v-col cols="8">
          <v-btn class="primary" @click="newObject()" raised>Nuevo</v-btn>
          <v-btn class="primary ml-1" @click="openDialog('minimumStockRestriction')" raised
            >EXISTENCIAS MÍNIMAS</v-btn
          >
          <v-btn class="primary ml-1" @click="openDialog('stockMigration')"
            >MIGRAR STOCK</v-btn
          >
          <v-btn class="success ml-1" @click="openDialog('reports')">Reportes</v-btn>
        </v-col>
        <v-col cols="2">
          <v-autocomplete
            :items="depositos"
            item-text="nombre"
            item-value="id"
            label="Depósito"
            v-model="typeList"
            @change="filterObjects(loguedUser.perfil, filterParams.stringParam, filterParams.page - 1, filterParams.size, typeList)"
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.stringParam"
            v-on:input="
              filterObjects(
                loguedUser.perfil, 
                filterParams.stringParam,
                filterParams.page - 1,
                filterParams.size,
                typeList
              )
            "
            dense
            outlined
            rounded
            class="text-left mt-2"
            placeholder="Búsqueda"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>

    <!-- List with pagination-->
    <v-simple-table
      style="background-color: transparent"
      v-if="loaded"
      ref="tab"
    >
      <template v-slot:default>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Atributos</th>
            <th>Cantidad</th>
            <th>Cant. mínima</th>
            <th>Depósito</th>
            <th>Acciones</th>
            <th class="text-center">Migrar a otro depósito</th>
          </tr>
        </thead>
        <tbody v-for="object in objects" :key="object.id">
          <tr>
            <td>{{ object.producto.nombre }}</td>
            <td>{{ setAtributesValues(object.producto.atributos) }}</td>
            <td>{{ object.cantidad }}</td>
            <td>
              <span v-if="!object.cantidadMinima"
                >Sin existencias mínimas asignadas</span
              >
              <span v-if="object.cantidadMinima">{{
                object.cantidadMinima
              }}</span>
            </td>
            <td>{{ object.deposito.nombre }}</td>
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
            <td class="text-center">
              <button type="button" v-if="!object.selected">
                <img
                  src="/../../images/icons/add.svg"
                  @click="addToMigration(object)"
                  width="40"
                  height="40"
                />
              </button>
              <button type="button" v-if="object.selected === true">
                <img
                  src="/../../images/icons/success.svg"
                  @click="removeOfMigration(object)"
                  width="40"
                  height="40"
                />
              </button>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-pagination
      v-model="filterParams.page"
      :length="filterParams.totalPages"
      next-icon="mdi-chevron-right"
      prev-icon="mdi-chevron-left"
      :page="filterParams.page"
      :total-visible="8"
      @input="
        filterObjects(loguedUser.perfil, filterParams.stringParam, filterParams.page - 1, filterParams.size, typeList)
      "
      v-if="filterParams.totalPages > 1"
    ></v-pagination>
    <!-- End List with pagination -->

    <v-row>
      <v-col cols="12">
        <form @submit.prevent="migrateStockToOtherDeposit()">
          <v-btn class="success" type="submit">Migrar seleccionados</v-btn>
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

    <!-- Loader -->
    <div class="text-center" style="margin-top: 15px" v-if="!loaded">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <!-- End Loader -->
  </v-container>
</template>

<script>
import GenericService from "../../services/GenericService";
import StocksService from "../../services/StocksService";
import ModifyMinimumStocksDialog from "../../components/ModifyMinimumStocksDialog";
import StockReportsDialog from "../../components/StockReportsDialog";
import DepositMigrationDialog from "../../components/DepositMigrationDialog";
import { errorAlert } from '../../helpers/alerts';
import { getCurrentDate, formatDate } from '../../helpers/dateHelper';

export default {
  data: () => ({
    objects: [],
    loguedUser: JSON.parse(localStorage.getItem("userData")),
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
    service: "stock",
    token: localStorage.getItem("token"),
    dialogDeleteObject: false,
    depositos: [],
    realDeposits: [],
    typeList: 0,
    migration: [],
    destinationDepositForMigrations: {}
  }),

  components: {
    ModifyMinimumStocksDialog,
    DepositMigrationDialog,
    StockReportsDialog
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterObjects(
      this.loguedUser.perfil, 
      this.filterParams.stringParam,
      this.filterParams.page - 1,
      this.filterParams.size,
      this.typeList
    );
    this.getOtherModels(this.loguedUser.perfil, "", 0, 100000);
  },

  methods: {
    filterObjects(idPerfil, stringParam, page, size, typeList) {
      let idSucursal;
      
      switch (idPerfil) {
        case 1:
            idSucursal = '';
          break;
      
        default:
            idSucursal = this.loguedUser.sucursal.id;
          break;
      }

      if (typeList === 0) {
        this.search(idPerfil, idSucursal, stringParam, page, size);
      } else {
        this.searchForDeposit(idPerfil, idSucursal, stringParam, page, size, typeList);
      }
    },

    getOtherModels(idPerfil, stringParam, page, size) {
      let idSucursal;

      switch (idPerfil) {
        case 1:
            idSucursal = '';
          break;
      
        default:
            idSucursal = this.loguedUser.sucursal.id;
          break;
      }

      GenericService(this.tenant, "depositos", this.token)
        .filter({ idPerfil, idSucursal, stringParam, page, size })
        .then((data) => {
          this.depositos = data.data.content;
          this.depositos.push({
            id: 0,
            nombre: "Todos",
          });
          this.realDeposits = this.depositos.filter(el => el.id !== 0);
        });
    },

    search(idPerfil, idSucursal, stringParam, page, size) {
      GenericService(this.tenant, this.service, this.token)
        .filter({ idPerfil, idSucursal, stringParam, page, size })
        .then((data) => {
          this.objects = data.data.content;
          if(this.migration.length > 0){
            this.migration.filter(el => {
              this.objects.filter(e => {
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

    searchForDeposit(idPerfil, idSucursal, stringParam, page, size, typeList) {
      const idParam = typeList;

      StocksService(this.tenant, "stock", this.token)
        .filterStockForDepositId({ idPerfil, idSucursal, stringParam, page, size, idParam })
        .then((data) => {
          this.objects = data.data.content;
          if(this.migration.length > 0){
            this.migration.filter(el => {
              this.objects.filter(e => {
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

    newObject() {
      this.$router.push({ name: "stockForm", params: { id: 0 } });
    },

    edit(id) {
      this.$router.push({ name: "stockForm", params: { id: id } });
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
          this.filterObjects(
            this.loguedUser.perfil, 
            this.filterParams.stringParam,
            this.filterParams.page - 1,
            this.filterParams.size,
            this.typeList
          );
        });
    },

    applyMassiveStocksRestrictions() {
      this.$store.commit("stocks/dialogMutation");
      this.loaded = false;

      const stringParam = "";
      const page = 0;
      const size = 100000;

      let idSucursal;

      switch (this.loguedUser.perfil) {
        case 1:
            idSucursal = '';
          break;
      
        default:
            idSucursal = this.loguedUser.sucursal.id;
          break;
      }

      GenericService(this.tenant, this.service, this.token)
        .filter({ idSucursal, stringParam, page, size })
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
          this.filterObjects(
            this.loguedUser.perfil,
            this.filterParams.stringParam,
            this.filterParams.page - 1,
            this.filterParams.size,
            this.typeList
          );
        });
    },

    applyMassiveChangesInDeposits() {
      this.loaded = false;

      const stringParam = "";
      const page = 0;
      const size = 100000;

      let idSucursal;
      let depositToModifyId = this.$store.state.stocks.selectedDeposits[0].id;
      let newDepositForProducts = this.$store.state.stocks.selectedDeposits[1];

      switch (this.loguedUser.perfil) {
        case 1:
            idSucursal = '';
          break;
      
        default:
            idSucursal = this.loguedUser.sucursal.id;
          break;
      }

      GenericService(this.tenant, this.service, this.token)
        .filter({ idSucursal, stringParam, page, size })
        .then((data) => {
          let affectedProducts = data.data.content.filter(
            (el) => el.deposito.id == depositToModifyId
          );

          affectedProducts.forEach((el) => {
            el.deposito = newDepositForProducts;
            el.algorim = el.producto.nombre + el.deposito.id;
            GenericService(this.tenant, this.service, this.token).update(el);
          });
          

          this.saveHistorial(affectedProducts, "Movimiento masivo de stock entre depósitos");

          this.$store.commit("stocks/resetStates");
          setTimeout(()=>{this.filterObjects(this.loguedUser.perfil, this.filterParams.stringParam, this.filterParams.page - 1, this.filterParams.size, this.typeList);}, 500);
        });
    },

    addToMigration(object){
      this.migration.push(object);
      this.objects.filter(el => el.id === object.id)[0].selected = true;
      this.$refs.tab.$forceUpdate();
    },

    removeOfMigration(object){
      this.migration = this.migration.filter(el => el.id !== object.id);
      this.objects.filter(el => el.id === object.id)[0].selected = false;
      this.$refs.tab.$forceUpdate();
    },

    migrateStockToOtherDeposit(){
      if(this.migration.length > 0){
        this.loaded = false;
        this.migration.forEach(el => {
          el.deposito = this.destinationDepositForMigrations;
          el.algorim = el.producto.nombre + el.deposito.id;
          GenericService(this.tenant, this.service, this.token)
          .update(el);
        })
        
        this.saveHistorial(this.migration, "Migración de productos");
        
        this.migration = [];
        this.destinationDepositForMigrations = {};

        setTimeout(()=>{this.filterObjects(this.loguedUser.perfil, this.filterParams.stringParam, this.filterParams.page - 1, this.filterParams.size, this.typeList);}, 500);
      }else{
        errorAlert("Debe seleccionar al menos 1 producto para migrar su stock de depósito");
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
    }
  },
};
</script>