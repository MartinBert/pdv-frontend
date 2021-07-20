<template>
  <v-container style="min-width: 100%;">
    <v-form class="mb-0">
      <v-row>
        <v-col cols="1">
          <v-btn class="primary" @click="newObject()" raised>Nuevo</v-btn>
        </v-col>
        <v-col cols="3">
          <v-file-input
            v-model="file"
            class="mt-0"
            placeholder="Importar medios de pago"
            accept=".xlsx, xls"
            @change="onChange($event)"
          ></v-file-input>
        </v-col>
        <v-col cols="6"></v-col>
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.medioPagoName"
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
    <v-data-table :headers="headers" :items="mediosPago" class="elevation-6">
      <template v-slot:[`item.planPago`]="{ item }">
        <Detail :objectsArray="item.planPago" v-on:seeDetails="seeDetails" />
      </template>
      <template v-slot:[`item.sumaEnCierreDeCaja`]="{ item }">
        <Add
          :object="item"
          v-on:add="addCloseBox"
          v-if="!item.sumaEnCierreDeCaja"
        />
        <Checked
          :object="item"
          v-on:uncheck="uncheckCloseBox"
          v-if="item.sumaEnCierreDeCaja"
        />
      </template>
      <template v-slot:[`item.acciones`]="{ item }">
        <Edit :itemId="item.id" v-on:editItem="editItem" />
        <Delete :itemId="item.id" v-on:deleteItem="deleteItem" />
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import Edit from "../Buttons/Edit";
import Delete from "../Buttons/Delete";
import Detail from "../Buttons/Detail";
import Add from "../Buttons/Add";
import Checked from "../Buttons/Checked";
import GenericService from "../../services/GenericService";
export default {
  data: () => ({
    mediosPago: [],
    filterParams: {
      sucursalId: "",
      medioPagoName: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "mediosPago",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    seePlansDialog: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    headers: [
      { text: "Nombre", value: "nombre" },
      { text: "Plan de Pago", value: "planPago", sortable: false },
      {
        text: "Suma Arqueo de caja",
        value: "sumaEnCierreDeCaja",
        sortable: false,
      },
      { text: "Aplica en cierre z", value: "aplicaCierreZ", sortable: false },
      { text: "Acciones", value: "acciones", sortable: false },
    ],
  }),
  components: {
    Edit,
    Delete,
    Detail,
    Add,
    Checked,
  },
  mounted() {
    this.tenant = this.$route.params.tenant;
    if (this.loguedUser.perfil > 1) {
      this.filterParams.sucursalId = this.loguedUser.sucursal.id;
    }
    this.filterObjects();
  },
  methods: {
    filterObjects(page) {
      if (page) this.filterParams.page = page;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.mediosPago = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          if (this.filterParams.totalPages < this.filterParams.page) {
            this.filterParams.page = 1;
          }
          this.loaded = true;
        });
    },
    newObject() {
      this.$router.push({ name: "mediosPagoForm", params: { id: 0 } });
    },

    editItem(itemId) {
      this.$emit("editItem", itemId);
    },

    deleteItem(itemId) {
      this.$emit("deleteItem", itemId);
    },

    addCloseBox(object) {
      this.$emit("addCloseBox", object, "addCloseBox");
    },

    uncheckCloseBox(object) {
      this.$emit("uncheckCloseBox", object, "uncheckCloseBox");
    },

    addZClosure(object) {
      this.$emit("addZClosure", object, "addZClosure");
    },

    uncheckZClosure(object) {
      this.$emit("uncheckZClosure", object, "uncheckZClosure");
    },

    seeDetails(objects) {
      this.$emit("seeDetails", objects);
    },
  },
};
</script>
