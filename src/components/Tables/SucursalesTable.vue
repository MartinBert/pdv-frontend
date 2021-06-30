<template>
  <v-container style="min-width: 100%;">
    <v-data-table :headers="headers" :items="sucursales" class="elevation-6">
      <template v-slot:[`item.detalles`]="{ item }">
         <Detail :object="item" v-on:seeDetails="seeDetails" />
      </template>
      <template v-slot:[`item.acciones`]="{ item }">
        <Edit :itemId="item.id" v-on:editItem="editItem" />
        <Delete :itemId="item.id" v-on:deleteItem="deleteItem" />
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import Edit from "../Buttons/Edit";
import Delete from "../Buttons/Delete";
import Detail from "../Buttons/Detail";
export default {
  data: () => ({
    sucursales: [],
    perfil: 0,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    filterParams: {
      sucursalName: "",
      sucursalSocialReason: "",
      sucursalDirection: "",
      sucursalId: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "sucursales",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    headers:[
      {text:"Nombre", value:"nombre"},
      {text:"Telefono", value:"telefono"},
      {text:"Email", value:"email"},
      {text:"Direcion", value:"direccion"},
      {text:"Detalles", value:"detalles",sortable:false},
      {text:"Acciones", value:"acciones",sortable:false}
    ]
  }),
  components: {
   Edit,
   Delete,
   Detail,
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
          this.sucursales = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          if (this.filterParams.totalPages < this.filterParams.page) {
            this.filterParams.page = 1;
          }
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
