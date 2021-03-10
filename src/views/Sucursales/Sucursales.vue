<template>
  <v-container>
    <v-form class="mb-3">
      <v-row>
        <v-col>
          <v-btn v-if="loguedUser.perfil < 3" class="primary" @click="newObject()" raised>Nuevo</v-btn>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.sucursalSocialReason"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            placeholder="Razón social"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.sucursalName"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            placeholder="Nombre"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.sucursalDirection"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            placeholder="Dirección"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>

    <!-- List -->
    <v-simple-table style="background-color: transparent;">
      <template v-slot:default>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Detalles</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody v-for="object in objects" :key="object.id">
          <tr>
            <td>{{object.nombre}}</td>
            <td>{{object.telefono}}</td>
            <td>{{object.email}}</td>
            <td>{{object.direccion}}</td>
            <td>
              <button @click="seeDetails(object)"><img
                src="/../../images/icons/details.svg"
                width="30"
                height="30"
              /></button>
            </td>
            <td>
              <a title="Editar"><img src="/../../images/icons/edit.svg" @click="edit(object.id)" width="30" height="30"/></a>
              <a title="Eliminar" v-if="loguedUser.perfil < 3"><img src="/../../images/icons/delete.svg" @click="openDelete(object.id)" width="30" height="30"/></a>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <!-- End List -->

    <!-- Loader -->
    <div class="text-center" style="margin-top:15px" v-if="!loaded">
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
      @input="filterObjects()"
      v-if="filterParams.totalPages > 1"
    ></v-pagination>
    <!-- End filterParams -->

    <!-- Dialog Delete-->
    <v-dialog v-model="dialogDeleteObject" width="500">
      <v-card>
        <v-toolbar class="d-flex justify-center" color="primary" dark>
          <v-toolbar-title>Eliminar objeto</v-toolbar-title>
        </v-toolbar>
        <v-card-title class="d-flex justify-center">¿Está seguro que desea realizar esta acción?</v-card-title>
        <v-card-actions class="d-flex justify-center pb-4">
          <v-btn small color="disabled" class="mr-5" @click="deleteObject">Si</v-btn>
          <v-btn small color="disabled" @click="dialogDeleteObject = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End Dialog Delete -->

    <!-- Dialog Details-->
    <v-dialog v-model="detailsDialog" width="500">
      <v-card>
        <v-card-title class="d-flex justify-center">Detalles de sucursal</v-card-title>
        <v-card-text>
          <v-simple-table style="background-color: transparent;">
            <template v-slot:default>
              <thead>
                <tr>
                  <th>Provincia</th>
                  <th>Ciudad</th>
                  <th>Teléfono alternativo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{$store.state.eventual.eventual.provincia}}</td>
                  <td>{{$store.state.eventual.eventual.ciudad}}</td>
                  <td>{{$store.state.eventual.eventual.telefonoAlternativo}}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- End Dialog Details -->
  </v-container>
</template>

<script>
import GenericService from "../../services/GenericService";

export default {
  data: () => ({
    objects: [],
    perfil: 0,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    filterParams: {
      sucursalName: "",
      sucursalSocialReason: "",
      sucursalDirection: "",
      sucursalId: "",
      page: 1,
      size: 10,
      totalPages: 0
    },
    loaded: false,
    tenant: "",
    service: "sucursales",
    token: localStorage.getItem("token"),
    dialogDeleteObject: false,
    detailsDialog: false
  }),

  mounted() {
    this.tenant = this.$route.params.tenant;
    if(this.loguedUser.perfil > 1){
      this.filterParams.sucursalId = this.loguedUser.sucursal.id;
    }
    this.filterObjects();
  },

  methods: {

    filterObjects(){
      this.loaded = false;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then(data => {
          this.objects = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          if(this.filterParams.totalPages < this.filterParams.page){
            this.filterParams.page = 1;
          }
          this.loaded = true;
        });
    },

    newObject() {
      this.$router.push({ name: "sucursalesForm", params: { id: 0 } });
    },

    edit(id) {
      this.$router.push({ name: "sucursalesForm", params: { id: id } });
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

    seeDetails(object){
      this.$store.commit('eventual/addEventual', object);
      this.detailsDialog = true;
    },

  }
};
</script>