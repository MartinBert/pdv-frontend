<template>
  <v-container>
    <v-data-table :headers="headers" :items="clientes">
      
    </v-data-table>
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
//import Edit from "../Buttons/Edit";
//import Delete from "../Buttons/Delete";
//import Detail from "../Buttons/Detail";
export default {
  data: () => ({
    clientes: [],
    filterParams: {
      sucursalId: "",
      personaSocialReason: "",
      personaName: "",
      personaCuit: "",
      personaDirection: "",
      personaContactName: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "clientes",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    headers: [
      { text: "Nombre", value: "nombre" },
      { text: "Razon Social", value: "razonSocial" },
      { text: "Cuit", value: "cuit" },
      { text: "Detalles", value: "detalles" },
      { text: "Acciones", value: "acciones" },
    ],
  }),
  components: {
    //Edit,
    //Delete,
    //Detail,
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
          this.clientes = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },
    editItem(itemId) {
      this.$emit("editItem", itemId);
    },
    deleteItem(itemId) {
      this.$emit("deleteItem", itemId);
    },
    seeDetails(object) {
      this.$emit("seeDetails", object);
    },
  },
};
</script>
