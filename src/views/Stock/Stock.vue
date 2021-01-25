<template>
  <v-container>
    <v-form>
      <v-row>
        <v-col cols="8">
          <v-btn class="primary" @click="newObject()" raised>Nuevo</v-btn>
          <v-btn class="primary ml-1" @click="openStocksDialog()" raised
            >MANEJO DE EXISTENCIAS MÍNIMAS</v-btn
          >
          <v-btn class="primary ml-1" @click="openDepositMigrationDialog()"
            >MIGRAR STOCK ENTRE DEPÓSITOS</v-btn
          >
        </v-col>
        <v-col cols="2">
          <v-autocomplete
            :items="depositos"
            item-text="nombre"
            item-value="id"
            label="Depósito"
            v-model="typeList"
            @change="filterObjects(filterString, paginate.page - 1, paginate.size, typeList)"
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="filterString"
            v-on:input="
              filterObjects(
                filterString,
                paginate.page - 1,
                paginate.size,
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
            <th>ID</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Cantidad mínima</th>
            <th>Depósito</th>
            <th>Acciones</th>
            <th class="text-center">Migrar a otro depósito</th>
          </tr>
        </thead>
        <tbody v-for="object in objects" :key="object.id">
          <tr>
            <td>{{ object.id }}</td>
            <td>{{ object.producto.nombre }}</td>
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
      v-model="paginate.page"
      :length="paginate.totalPages"
      next-icon="mdi-chevron-right"
      prev-icon="mdi-chevron-left"
      :page="paginate.page"
      :total-visible="8"
      @input="
        filterObjects(filterString, paginate.page - 1, paginate.size, typeList)
      "
      v-if="paginate.totalPages > 1"
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
import DepositMigrationDialog from "../../components/DepositMigrationDialog";
import { errorAlert } from '../../helpers/alerts';
import { getCurrentDate, formatDate } from '../../helpers/dateHelper';

export default {
  data: () => ({
    objects: [],
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    filterString: "",
    paginate: {
      page: 1,
      size: 10,
      totalPages: 0,
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
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterObjects(
      this.filterString,
      this.paginate.page - 1,
      this.paginate.size,
      this.typeList
    );
    this.getOtherModels("", 0, 100000);
  },

  methods: {
    filterObjects(param, page, size, typeList) {
      let id;
      if (this.loguedUser.perfil < 3) {
        id = "";
      } else {
        id = this.loguedUser.sucursal.id;
      }

      if (typeList === 0) {
        this.search(id, param, page, size);
      } else {
        this.searchForDeposit(id, param, page, size, typeList);
      }
    },

    getOtherModels(param, page, size) {
      let id;
      if (this.loguedUser.perfil < 3) {
        id = "";
      } else {
        id = this.loguedUser.sucursal.id;
      }

      GenericService(this.tenant, "depositos", this.token)
        .filter({ id, param, page, size })
        .then((data) => {
          this.depositos = data.data.content;
          this.depositos.push({
            id: 0,
            nombre: "Todos",
          });
          this.realDeposits = this.depositos.filter(el => el.id !== 0);
        });
    },

    search(id, param, page, size) {
      GenericService(this.tenant, this.service, this.token)
        .filter({ id, param, page, size })
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
          this.paginate.totalPages = data.data.totalPages;
          if (this.paginate.totalPages < this.paginate.page) {
            this.paginate.page = 1;
          }
          this.loaded = true;
        });
    },

    searchForDeposit(id, param, page, size, typeList) {
      const idParam = typeList;

      StocksService(this.tenant, "stock", this.token)
        .filterStockForDepositId({ id, param, page, size, idParam })
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
          this.paginate.totalPages = data.data.totalPages;
          if (this.paginate.totalPages < this.paginate.page) {
            this.paginate.page = 1;
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
            this.filterString,
            this.paginate.page - 1,
            this.paginate.size,
            this.typeList
          );
        });
    },

    openStocksDialog() {
      this.$store.commit("stocks/dialogMutation");
    },

    openDepositMigrationDialog() {
      const deposits = this.depositos.filter((el) => el.id !== 0);
      this.$store.commit("stocks/allDepositsMutation", deposits);
      this.$store.commit("stocks/depositMigrationDialogMutation");
    },

    applyMassiveStocksRestrictions() {
      this.$store.commit("stocks/dialogMutation");
      this.loaded = false;

      const param = "";
      const page = 0;
      const size = 100000;

      let id;

      if (this.loguedUser.perfil < 3) {
        id = "";
      } else {
        id = this.loguedUser.sucursal.id;
      }

      GenericService(this.tenant, this.service, this.token)
        .filter({ id, param, page, size })
        .then((data) => {
          let stockWithRestrictions = data.data.content.map((el) => {
            el.cantidadMinima = this.$store.state.stocks.minimumQuantity;
            return el;
          });

          console.log(stockWithRestrictions);

          stockWithRestrictions.forEach((el) => {
            GenericService(this.tenant, this.service, this.token).save(el);
          });

          this.$store.commit("stocks/resetStates");
          this.filterObjects(
            this.filterString,
            this.paginate.page - 1,
            this.paginate.size
          );
        });
    },

    applyMassiveChangesInDeposits() {
      this.loaded = false;

      const param = "";
      const page = 0;
      const size = 100000;

      let id;
      let depositToModifyId = this.$store.state.stocks.selectedDeposits[0].id;
      let newDepositForProducts = this.$store.state.stocks.selectedDeposits[1];

      if (this.loguedUser.perfil < 3) {
        id = "";
      } else {
        id = this.loguedUser.sucursal.id;
      }

      GenericService(this.tenant, this.service, this.token)
        .filter({ id, param, page, size })
        .then((data) => {
          let affectedProducts = data.data.content.filter(
            (el) => el.deposito.id == depositToModifyId
          );

          affectedProducts.forEach((el) => {
            el.deposito = newDepositForProducts;
            GenericService(this.tenant, this.service, this.token).save(el);
          });

          const stockHistory = {
            stocks: affectedProducts,
            descripcion: "Movimiento masivo de stock entre depósitos",
            fecha: formatDate(getCurrentDate()),
            usuario:this.loguedUser.nombre,
            sucursal: this.loguedUser.sucursal
          }

          GenericService(this.tenant, 'historialStock', this.token)
          .save(stockHistory);

          this.$store.commit("stocks/resetStates");
          setTimeout(()=>{this.filterObjects(this.filterString, this.paginate.page - 1, this.paginate.size, this.typeList);}, 500);
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
          GenericService(this.tenant, this.service, this.token)
          .save(el);
        })
        
        const stockHistory = {
          stocks: this.migration,
          descripcion: "Migración de productos",
          fecha: formatDate(getCurrentDate()),
          usuario:this.loguedUser.nombre,
          sucursal: this.loguedUser.sucursal
        }

        GenericService(this.tenant, 'historialStock', this.token)
        .save(stockHistory);
        
        this.migration = [];
        this.destinationDepositForMigrations = {};

        setTimeout(()=>{this.filterObjects(this.filterString, this.paginate.page - 1, this.paginate.size, this.typeList);}, 500);
      }else{
        errorAlert("Debe seleccionar al menos 1 producto para migrar su stock de depósito");
      }
    }
  },
};
</script>