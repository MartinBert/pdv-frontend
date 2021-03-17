<template>
  <v-container>
    <v-form class="mb-3">
      <v-row>
        <v-col cols="6">
          <v-btn class="primary" @click="newObject()" raised v-if="loguedUser.perfil == 1">Nuevo</v-btn>
        </v-col>
        <v-col cols="3"></v-col>
        <v-col cols="3">
          <v-text-field
            v-model="filterParams.preguntaFrecuenteQuestion"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            placeholder="Buscar pregunta"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <PreguntasFrecuentesTable
      :items="preguntasFrecuentes"
      v-if="loaded"
    />
    <Pagination
      :page="filterParams.page"
      :totalPages="filterParams.totalPages"
      :totalVisible="7"
      v-on:changePage="filterObjects"
      v-if="loaded"
    />
    <Spinner v-if="!loaded" />
  </v-container>
</template>

<script>
import GenericService from "../../services/GenericService";
import PreguntasFrecuentesTable from '../../components/Tables/PreguntasFrecuentesTable';
import Pagination from '../../components/Pagination';
import Spinner from '../../components/Spinner';
export default {
  data: () => ({
    preguntasFrecuentes: [],
    filterParams: {
      preguntaFrecuenteQuestion: "",
      preguntaFrecuenteResponse: "",
      page: 1,
      size: 7,
      totalPages: 0
    },
    loaded: false,
    tenant: "",
    service: "preguntasFrecuentes",
    token: localStorage.getItem("token"),
    dialogDeleteObject: false,
    loguedUser: JSON.parse(localStorage.getItem("userData"))
  }),

  components: {
    PreguntasFrecuentesTable,
    Pagination,
    Spinner
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterObjects()
  },

  methods: {
    filterObjects(page) {
      if(page) this.filterParams.page = page;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.preguntasFrecuentes = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },

    newObject() {
      this.$router.push({ name: "preguntasFrecuentesForm", params: { id: 0 } });
    },

    edit(id) {
      this.$router.push({ name: "preguntasFrecuentesForm", params: { id: id } });
    },

    deleteItem(id) {
      this.idObjet = id;
      this.deleteDialogStatus = true;
    },

    deleteConfirmation(result) {
      return result ? this.deleteObject() : (this.deleteDialogStatus = false);
    },

    deleteObject() {
      this.deleteDialogStatus = false;
      GenericService(this.tenant, this.service, this.token)
        .delete(this.idObjet)
        .then(() => {
          this.filterObjects();
        })
        .catch(() => {
          this.$errorAlert(
            "El registro se encuentra asociado a otros elementos en el sistema"
          );
        });
    },
  },
};
</script>