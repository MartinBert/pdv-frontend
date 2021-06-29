<template>
  <v-container>
    <v-data-table>

    </v-data-table>
  </v-container>
</template>
<script>
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
    headers:[
      {text:"Nombre",value:"nombre"},
      {text:"Razon Social", value:"razonSocial"},
      {text:"Cuit", value:"cuit"},
      {text:"Detalles", value:"detalles"},
      {text:"", value:""}
    ]
  }),
  components: {
    //Edit,
    //Delete,
    //Detail,
  },
  methods: {
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
