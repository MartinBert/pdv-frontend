<template>
  <v-container>
    <v-data-table :headers="headers" :items="atributos">

    </v-data-table>
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
export default {
  data: () => ({
    atributos: [],
    headers:[
      {text:"Id",value:"id"},
      {text:"Text", value:"valor"},
      {text:"Valor Numerico", value:"valorNumerico"},
      {text:"Acciones", value:"acciones" , sortable:false}

      ],
    filterParams: {
      atributoValor: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "atributos",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
  }),
  
  mounted() {
    this.tenant = this.$route.params.tenant;
    this.items();
  },
  methods: {
    items(page){
       if (page) this.filterParams.page = page;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.atributos = data.data.content;
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
  },
};
</script>
