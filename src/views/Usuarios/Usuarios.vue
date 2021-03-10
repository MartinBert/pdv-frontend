<template>
  <v-container>
    <h3>Usuarios</h3>
      <v-row>
        <v-col>
          <v-btn class="primary" @click="newObject()" raised>Nuevo</v-btn>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.usuarioName"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            class="text-left"
            label="Nombre de usuario"
            placeholder=" "
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.sucursalSocialReason"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            class="text-left"
            label="Razón social de sucursal"
            placeholder=" "
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.puntoVentaName"
            v-on:input="filterObjects"
            dense
            outlined
            rounded
            class="text-left"
            label="Nombre de punto de venta"
            placeholder=" "
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.perfilName"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            class="text-left"
            label="Perfil"
            placeholder=" "
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </v-row>

    <!-- List -->
    <v-simple-table style="background-color: transparent">
      <template v-slot:default>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Perfil</th>
            <th>Empresa</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody v-for="object in objects" :key="object.id">
          <tr>
            <td>{{ object.nombre }}</td>
            <td>{{ object.username }}</td>
            <td>{{ object.perfil.nombre }}</td>
            <td>
              <span v-if="object.empresa == null">Todas</span>
              <span v-if="object.empresa != null">{{object.empresa.alias}}</span>
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
        <v-card-title class="d-flex justify-center"
          >¿Está seguro que desea realizar esta acción?</v-card-title
        >
        <v-card-actions class="d-flex justify-center pb-4">
          <v-btn small color="disabled" class="mr-5" @click="deleteObject"
            >Si</v-btn
          >
          <v-btn small color="disabled" @click="dialogDeleteObject = false"
            >No</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End Dialog Delete -->
  </v-container>
</template>

<script>
import GenericService from "../../services/GenericService";

export default {
  data: () => ({
    objects: [],
    filterParams: {
      perfilId: "",
      empresaId: "",
      sucursalSocialReason: "",
      perfilName: "",
      puntoVentaName: "",
      usuarioName: "",
      page: 1,
      size: 10,
      totalPages: 0
    },
    loaded: false,
    tenant: "",
    service: "usuarios",
    token: localStorage.getItem("token"),
    dialogDeleteObject: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
  }),

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterParams.perfilId = this.loguedUser.perfil;
    if(this.loguedUser.perfil > 1){
      this.filterParams.empresaId = this.loguedUser.empresa.id;
    }
    this.filterObjects();
  },

  methods: {

    filterObjects(){
      GenericService(this.tenant, this.service, this.token)
      .filter(this.filterParams)
      .then(data => {
        this.objects = data.data.content;
        this.filterParams.totalPages = data.data.totalPages;
        if(this.filterParams.totalPages < this.filterParams.page){
          this.filterParams.page = 1;
        }
        this.loaded = true;
      })
    },

    newObject() {
      this.$router.push({ name: "usuariosForm", params: { id: 0 } });
    },

    edit(id) {
      this.$router.push({ name: "usuariosForm", params: { id: id } });
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

  },
};
</script>