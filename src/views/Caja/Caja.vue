<template>
  <v-container>
    <v-form class="mb-3">
      <v-row>
        <v-col>
          <v-btn class="primary" @click="newObject()" raised>REALIZAR ARQUEO</v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-container>
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
      <v-pagination
        v-model="filterParams.page"
        :length="filterParams.totalPages"
        next-icon="mdi-chevron-right"
        prev-icon="mdi-chevron-left"
        :page="filterParams.page"
        :total-visible="8"
        @input="filterObjects()"
        v-if="filterParams.totalPages > 1"
      ></v-pagination>
    </v-container>

    <Spinner v-if="!loaded"/>

    <CajaDetails />
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import CajaDetails from '../../components/CajaDetails';
import Spinner from '../../components/Spinner';

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
    Spinner
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    if(this.loguedUser.perfil > 1){
      this.filterParams.sucursalId = this.loguedUser.sucursal.id;
    }
    this.filterObjects()
  },

  methods: {

    filterObjects() {
      this.loaded = false;
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
          this.filterObjects();
        });
    },

    seeDetail(object){
      this.$store.commit('eventual/mutateEventualDialog');
      this.$store.commit('eventual/addEventual', object);
    },
  },
};
</script>