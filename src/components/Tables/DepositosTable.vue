<template>
  <v-container style="min-width: 100%">
    <v-form class="mb-0">
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
    <v-data-table :headers="headers" :items="depositos" class="elevation-6">
      <template v-slot:[`item.deposito`]="{ item }">
        <Add :object="item" v-on:add="addDeposit" v-if="!item.deposito"/>
        <Checked :object="item" v-on:uncheck="uncheckDeposit" v-if="item.deposito"/>
      </template>
      <template v-slot:[`item.acciones`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:[`item.cantidad`]="{ item }">
        <span v-if="!item.cantidadMinima"
          >Sin existencias mínimas asignadas</span
        >
        <span v-if="item.cantidadMinima">{{ item.cantidadMinima }}</span>
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import Add from "../Buttons/Add";
import Checked from "../Buttons/Checked";
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
    headers: [
      { text: "Nombre", value: "nombre" },
      { text: "Migrar", value: "deposito", sortable: false },
      { text: "Cantidad", value: "cantidad" },
      { text: "Acciones", value: "acciones", sortable: false },
    ],
  }),
  components: {
    Add,
    Checked
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
    addDeposit(object) {
      this.$emit("add", object , "addDeposit");
    },
    uncheckDeposit(object) {
      this.$emit("uncheck", object ,"uncheckDeposit");
    },
    editItem(itemId) {
      this.$emit("editItem", itemId);
    },
    deleteItem(itemId) {
      this.$emit("deleteItem", itemId);
    },
    openStockMovementHistoryDialog() {
      this.$store.commit("stocks/stockHistoryDialogMutation");
    },
    selectDefaultDeposit(object) {
      this.$emit("selectDefaultDeposit", object);
    },
  },
};
</script>
