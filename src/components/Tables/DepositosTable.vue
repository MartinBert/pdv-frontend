<template>
  <v-container style="min-width: 100%">
    <v-data-table :headers="headers" :items="depositos" class="elevation-6">
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
      <template v-slot:[`item.deposito`]="{ item }">
        <Checked
          :object="item"
          v-on:uncheck="uncheck"
          v-if="item.selected === true"
        />
        <Add :object="item" v-on:add="add" v-else />
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
      { text: "Deposito Determinado", value: "deposito[0].valor" },
      { text: "Migrar", value: "deposito", sortable: false },
      { text: "Cantidad", value: "cantidad"},
      { text: "Acciones", value: "acciones", sortable: false },
    ],
  }),
  components: {
    Add,
    Checked,
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
    add(object) {
      this.$emit("add", object);
    },
    uncheck(object) {
      this.$emit("uncheck", object);
    },
    editItem(itemId) {
      this.$emit("editItem", itemId);
    },
    deleteItem(itemId) {
      this.$emit("deleteItem", itemId);
    },
    selectDefaultDeposit(object) {
      this.$emit("selectDefaultDeposit", object);
    },
  },
};
</script>
