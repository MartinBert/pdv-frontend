<template>
  <v-container>
    <v-form class="mb-3">
      <v-row>
        <v-col>
          <v-btn class="primary" @click="newObject()" raised>REALIZAR ARQUEO</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <CajaTable
      :items="objects"
      v-on:seeDetails="seeDetails"
      v-if="loaded"
    />
    <Pagination
      :page="filterParams.page"
      :totalPages="filterParams.totalPages"
      :totalVisible="7"
      v-on:changePage="filterObjects"
      v-if="loaded"
    />
    <Spinner v-if="!loaded"/>
    <CajaDetails/>
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import CajaDetails from '../../components/Details/CajaDetails';
import Spinner from '../../components/Graphics/Spinner';
import CajaTable from '../../components/Tables/CajaTable';
import Pagination from '../../components/Pagination';
export default {
  data: () => ({
    objects: [],
    filterParams: {
      sucursalId: "",
      page: 1,
      size: 10,
      totalPages: 0
    },
    loaded: false,
    tenant: "",
    service: "caja",
    token: localStorage.getItem("token"),
    dialogDeleteObject: false,
    loguedUser: JSON.parse(localStorage.getItem("userData"))
  }),

  components:{
    CajaDetails,
    Spinner,
    CajaTable,
    Pagination
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    if(this.loguedUser.perfil > 1){
      this.filterParams.sucursalId = this.loguedUser.sucursal.id;
    }
    this.filterObjects()
  },

  methods: {
    filterObjects(page) {
      if(page) this.filterParams.page = page;
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

    seeDetails(object){
      this.$store.commit('details/mutateDialog');
      this.$store.commit('details/addObjectToDetail', object);
    },
  },
};
</script>