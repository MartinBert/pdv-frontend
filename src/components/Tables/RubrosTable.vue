<template>
  <v-container>
    <v-data-table :headers="headers" :items="rubros">
      
    </v-data-table>
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
export default {
  data:()=>({

    filterParams: {
      rubroName: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    headers:[
      {text:"Nombre", value:"nombre"},
      {text:"Acciones", value:"acciones" , sortable: false}
    ],
    rubros:[],
    loaded: false,
    tenant: "",
    service: "rubros",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
  }),
  components: {
    
  },
    mounted() {
    this.tenant = this.$route.params.tenant;
    this.items();
  },
  methods: {
    items(page) {
      if (page) this.filterParams.page = page;
      GenericService(this.tenant, "rubros", this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.rubros = data.data.content;
          console.log(this.rubros);
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },
  },
};
</script>