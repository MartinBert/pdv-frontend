<template>
  <v-container style="min-width: 100%;">
    <v-form class="mb-3">
      <v-row>
        <v-col>
          <v-btn class="primary" @click="newObject()" raised
            >REALIZAR ARQUEO</v-btn
          >
          <v-btn
            class="primary ml-1"
            @click="closure('z')"
            raised
            :disabled="clientIp ? false : true"
            >REALIZAR CIERRE Z CONTROLADOR FISCAL</v-btn
          >
          <v-btn
            class="primary ml-1"
            @click="closure('x')"
            raised
            :disabled="clientIp ? false : true"
            >REALIZAR CIERRE X CONTROLADOR FISCAL</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
    <v-data-table
      class="elevation-6"
      :headers="headers"
      :items="objects"
      hide-default-footer
    >
      <template v-slot:[`item.detalles`]="{ item }">
        <Detail :object="item" v-on:seeDetails="seeDetails" />
      </template>
    </v-data-table>
    <Pagination
      :page="filterParams.page"
      :totalPages="filterParams.totalPages"
      :totalVisible="7"
      v-on:changePage="filterObjects"
    />
  </v-container>
</template>
<script>
import Pagination from "../Pagination";
import axios from "axios";
import GenericService from "../../services/GenericService";
import Detail from "../Buttons/Detail";
export default {
  data: () => ({
    objects: [],
    filterParams: {
      sucursalId: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "caja",
    token: localStorage.getItem("token"),
    dialogDeleteObject: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    clientIp: "",
    headers: [
      { text: "Fecha", value: "fecha" },
      { text: "Número", value: "numeroCorrelativo" },
      { text: "Descripcion", value: "descripcion" },
      { text: "Detalles", value: "detalles", sortable: false },
    ],
  }),
  components: {
    Detail,
    Pagination,
  },
  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterParams.sucursalId = this.loguedUser.sucursal.id
    this.filterObjects();
    this.getClientIpForFiscalController();
  },
  methods: {
    filterObjects(page) {
      if (page) this.filterParams.page = page;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.objects = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },
    newObject() {
      this.$router.push({ name: "cajaForm", params: { id: 0 } });
    },
    async closure(type) {
      // const clientIp = this.loguedUser.puntoVenta.ipLocal;
      axios
        .post(`http://${this.clientIp}/${type}_closure`)
        .then(() => {
          this.$successAlert(`Cierre ${type} realizado`);
          this.loaded = true;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    seeDetails(object) {
      this.$emit("seeDetails", object);
    },
    getClientIpForFiscalController() {
      axios.get("https://api.ipify.org?format=json").then((data) => {
        this.clientIp = data.data.ip;
      });
    },

  },
};
</script>
