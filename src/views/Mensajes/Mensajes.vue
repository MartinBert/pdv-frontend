<template>
  <v-container>
    <v-form class="mb-3">
      <v-row>
        <v-spacer></v-spacer>
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
        <v-col cols="3">
          <v-text-field
            type="date"
            v-model="filterDate"
            v-on:input="filterObjects(loguedUser.perfil, filterParams.stringDateParam, filterParams.page - 1, filterParams.size)"
            dense
            outlined
            rounded
            class="text-left"
            placeholder="Búsqueda"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>

    <!-- List -->
    <v-simple-table style="background-color: transparent">
      <template v-slot:default>
        <thead>
          <tr>
            <th>Nombre y apellido</th>
            <th>Contacto</th>
            <th>Fecha</th>
            <th>Mensaje</th>
          </tr>
        </thead>
        <tbody v-for="object in objects" :key="object.id">
          <tr>
            <td>{{ object.nameAndLastName }}</td>
            <td>{{ object.contactPhoneOrEmail}}</td>
            <td>{{ object.date}}</td>
            <td>
              <button type="button">
                <img
                  src="/../../images/icons/details.svg"
                  @click="seeDetail(object.message)"
                  width="30"
                  height="30"
                />
              </button>
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

    <!-- Dialog Detail-->
    <v-dialog v-model="$store.state.eventual.eventualDialog" width="500">
      <v-card>
        <v-card-title class="d-flex justify-center">
          <h2>Mensaje</h2>
        </v-card-title>
        <v-card-text>
          <h4>{{$store.state.eventual.eventual}}</h4>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- End Dialog Detail -->
  </v-container>
</template>

<script>
import { formatDate } from '../../helpers/dateHelper';
import GenericService from "../../services/GenericService";

export default {
  data: () => ({
    objects: [],
    filterDate: null,
    filterParams: {
      idPerfil: "",
      idSucursal: "",
      stringParam: "",
      stringDateParam: "",
      page: 1,
      size: 10,
      totalPages: 0
    },
    loaded: false,
    tenant: "",
    service: "mensajes",
    token: localStorage.getItem("token"),
    dialogDeleteObject: false,
    loguedUser: JSON.parse(localStorage.getItem("userData"))
  }),
  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterObjects(this.loguedUser.perfil, this.filterParams.stringParam, this.filterParams.page - 1, this.filterParams.size)
  },

  methods: {

    filterObjects(idPerfil, stringParam, page, size) {
      this.loaded = false;
      let idSucursal;

      switch (idPerfil) {
        case 1:
            idSucursal = '';
          break;
      
        default:
            idSucursal = this.loguedUser.sucursal.id;
          break;
      }

      if(stringParam === this.filterParams.stringDateParam){
        stringParam = formatDate(stringParam);
        this.filterParams.stringParam = '';
      }else{
        this.filterParams.stringDateParam = null;
      }

      GenericService(this.tenant, this.service, this.token)
        .filter({idPerfil, idSucursal, stringParam, page, size})
        .then((data) => {
          this.objects = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },

    newObject() {
      this.$router.push({ name: "mensajesForm", params: { id: 0 } });
    },

    edit(id) {
      this.$router.push({ name: "mensajesForm", params: { id: id } });
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

    seeDetail(message){
      this.$store.commit('eventual/addEventual', message);
      this.$store.commit('eventual/mutateEventualDialog');
    }
  },
};
</script>