<template>
  <v-container>
    <v-form class="mb-3">
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="3">
          <v-text-field
            v-model="filterString"
            v-on:input="filterObjects(filterString, paginate.page - 1, paginate.size)"
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
            v-on:input="filterObjects(filterDate, paginate.page - 1, paginate.size)"
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
            <th>ID</th>
            <th>Nombre y apellido</th>
            <th>Contacto</th>
            <th>Fecha</th>
            <th>Mensaje</th>
          </tr>
        </thead>
        <tbody v-for="object in objects" :key="object.id">
          <tr>
            <td>{{ object.id }}</td>
            <td>{{ object.nameAndLastName }}</td>
            <td>{{ object.contactPhoneOrEmail}}</td>
            <td>{{ object.date}}</td>
            <td>
              <button type="button">
                <img
                  src="/../../images/icons/eye.svg"
                  @click="seeDetail(object.message)"
                  width="40"
                  height="40"
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

    <!-- Paginate -->
    <v-pagination
      v-model="paginate.page"
      :length="paginate.totalPages"
      next-icon="mdi-chevron-right"
      prev-icon="mdi-chevron-left"
      :page="paginate.page"
      :total-visible="8"
      @input="filterObjects(filterString, paginate.page - 1, paginate.size)"
      v-if="paginate.totalPages > 1"
    ></v-pagination>
    <!-- End Paginate -->

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
    filterString: '',
    filterDate: null,
    paginate: {
      page: 1,
      size: 10,
      totalPages: 0,
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
    this.filterObjects(this.filterString, this.paginate.page - 1, this.paginate.size)
  },

  methods: {

    filterObjects(param, page, size) {
      this.loaded = false;
      let id;

      if(this.loguedUser.perfil < 3){
        id = "";
      }else{
        id = this.loguedUser.sucursal.id;
      }

      if(param === this.filterDate){
        param = formatDate(param);
        this.filterString = '';
      }else{
        this.filterDate = null;
      }

      GenericService(this.tenant, this.service, this.token)
        .filter({id, param, page, size})
        .then((data) => {
          this.objects = data.data.content;
          this.paginate.totalPages = data.data.totalPages;
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
          this.filterObjects(this.filterString, this.paginate.page - 1, this.paginate.size);
        });
    },

    seeDetail(message){
      this.$store.commit('eventual/addEventual', message);
      this.$store.commit('eventual/mutateEventualDialog');
    }
  },
};
</script>