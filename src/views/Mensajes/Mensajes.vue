<template>
  <v-container>
    <v-form class="mb-3">
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.mensajeMessage"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            placeholder="Mensaje"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            type="text"
            v-model="filterParams.mensajeDate"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            placeholder="Fecha"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            type="text"
            v-model="filterParams.mensajeNameAndLastName"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            placeholder="Nombre y apellido"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            type="text"
            v-model="filterParams.mensajeContactPhoneOrEmail"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            placeholder="Email o teléfono de contacto"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
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
    <div class="text-center" style="margin-top: 15px" v-if="!loaded">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
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
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
export default {
  data: () => ({
    objects: [],
    filterDate: null,
    filterParams: {
      mensajeNameAndLastName: "",
      mensajeContactPhoneOrEmail: "",
      mensajeMessage: "",
      mensajeDate: "",
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
          this.filterObjects();
        });
    },

    seeDetail(message){
      this.$store.commit('eventual/addEventual', message);
      this.$store.commit('eventual/mutateEventualDialog');
    }
  },
};
</script>