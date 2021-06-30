<template>
  <v-container>
    <v-data-table>
      
    </v-data-table>
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import Edit from "../Buttons/Edit";
import Delete from "../Buttons/Delete";
export default {
  data: () => ({
    perfiles: [],
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    filterParams: {
      perfilId: "",
      perfilName: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "perfiles",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
  }),
  components: {
    Edit,
    Delete,
  },
  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterParams.perfilId = this.loguedUser.perfil;
    this.filterObjects();
  },
  methods: {
    filterObjects(page) {
      if (page) this.filterParams.page = page;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.perfiles = data.data.content;
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
