<template>
  <v-container>
    <v-form class="mb-3">
      <v-row>
        <v-col cols="6">
          <v-btn class="primary" @click="newObject()" raised>REALIZAR ARQUEO</v-btn>
        </v-col>
        <v-col cols="3"></v-col>
        <v-col cols="3">
          <v-text-field
            v-model="filterParams.stringParam"
            v-on:input="filterObjects(loguedUser.perfil, filterParams.stringParam, filterParams.page - 1, filterParams.size)"
            dense
            outlined
            rounded
            class="text-left"
            placeholder="Búsqueda"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>

    <!-- List -->
    <v-simple-table style="background-color: transparent">
      <template v-slot:default>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Detalles</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody v-for="object in objects" :key="object.id">
          <tr>
            <td>{{ object.fecha }}</td>
            <td>{{ object.descripcion }}</td>
            <td>
              <button type="button">
                <img
                  src="/../../images/icons/details.svg"
                  @click="seeDetail(object)"
                  width="30"
                  height="30"
                />
              </button>
            </td>
            <td>
              <a title="Editar"
                ><img
                  src="/../../images/icons/edit.svg"
                  @click="edit(object.id)"
                  width="30"
                  height="30"
              /></a>
              <a title="Eliminar"
                ><img
                  src="/../../images/icons/delete.svg"
                  @click="openDelete(object.id)"
                  width="30"
                  height="30"
              /></a>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <!-- End List -->

    <!-- Loader -->
    <div class="text-center" style="margin-top: 15px" v-if="!loaded">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <!-- End Loader -->

    <!-- filterParams -->
    <v-pagination
      v-model="filterParams.page"
      :length="filterParams.totalPages"
      next-icon="mdi-chevron-right"
      prev-icon="mdi-chevron-left"
      :page="filterParams.page"
      :total-visible="8"
      @input="filterObjects(loguedUser.perfil, filterParams.stringParam, filterParams.page - 1, filterParams.size)"
      v-if="filterParams.totalPages > 1"
    ></v-pagination>
    <!-- End filterParams -->

    <CajaDetails />
  </v-container>
</template>

<script>
import GenericService from "../../services/GenericService";
import CajaDetails from '../../components/CajaDetails';

export default {
  data: () => ({
    objects: [],
    filterParams: {
      fourthLongParam: "",
      thirdLongParam: "",
      stringParam: "",
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
    CajaDetails
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterObjects(this.loguedUser.perfil, this.filterParams.stringParam, this.filterParams.page - 1, this.filterParams.size)
  },

  methods: {

    filterObjects(fourthLongParam, stringParam, page, size) {
      this.loaded = false;
      let thirdLongParam;
      if(this.loguedUser.perfil < 3){
        thirdLongParam = "";
      }else{
        thirdLongParam = this.loguedUser.sucursal.id;
      }

      GenericService(this.tenant, this.service, this.token)
        .filter({fourthLongParam, thirdLongParam,stringParam, page, size})
        .then((data) => {
          this.objects = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },

    newObject() {
      this.$router.push({ name: "cajaForm", params: { id: 0 } });
    },

    edit(id) {
      this.$router.push({ name: "cajaForm", params: { id: id } });
    },

    openDelete(id) {
      this.idObjet = id;
      this.dialogDeleteObject = true;
    },

    deleteObject() {
      this.dialog = true;
      this.dialogDeleteObject = false;
      GenericService(this.tenant, this.service, this.token)
        .delete(this.idObjet)
        .then(() => {
          this.filterObjects(this.loguedUser.perfil, this.filterParams.stringParam, this.filterParams.page - 1, this.filterParams.size);
        });
    },

    seeDetail(object){
      this.$store.commit('eventual/mutateEventualDialog');
      this.$store.commit('eventual/addEventual', object);
    },
  },
};
</script>