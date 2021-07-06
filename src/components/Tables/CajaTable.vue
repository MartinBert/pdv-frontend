<template>
  <v-container>
    <v-data-table style="background-color: transparent" :headers="headers" :items="objects">
      <template v-slot:[`item.acciones`]="{ item }">
         <Detail :object="item" v-on:seeDetails="seeDetails" />
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
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
    headers:[
      {text:"Fecha", value:"fecha"},
      {text:"Descripcion", value:"descripcion"},
      {text:"Detalles",value:"detalles"}
    ]
  }),
  components: {
    Detail,
  },
  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterObjects();
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
    seeDetails(object) {
      this.$emit("seeDetails", object);
    },
  },
};
</script>