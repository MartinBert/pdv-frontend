<template>
  <v-container>
    <v-form class="mb-3">
      <v-row>
        <v-col cols="6">
          <v-btn class="primary" @click="newObject()" raised>Nuevo</v-btn>
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
            <th>ID</th>
            <th>Nombre</th>
            <th>Porcentaje</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody v-for="object in objects" :key="object.id">
          <tr>
            <td>{{ object.id }}</td>
            <td>{{ object.nombre }}</td>
            <td>{{ object.porcentaje }}</td>
            <td>
              <a title="Editar"
                ><img
                  src="/../../images/icons/ico_10.svg"
                  @click="edit(object.id)"
                  width="40"
                  height="40"
              /></a>
              <a title="Eliminar"
                ><img
                  src="/../../images/icons/ico_11.svg"
                  @click="openDelete(object.id)"
                  width="40"
                  height="40"
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
      idPerfil: "",
      idSucursal: "",
      stringParam: "",
      page: 1,
      size: 10,
      totalPages: 0
    },
    loaded: false,
    tenant: "",
    service: "ivas",
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

      GenericService(this.tenant, this.service, this.token)
        .filter({idPerfil, idSucursal, stringParam, page, size})
        .then((data) => {
          this.objects = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },

    newObject() {
      this.$router.push({ name: "ivasForm", params: { id: 0 } });
    },

    edit(id) {
      this.$router.push({ name: "ivasForm", params: { id: id } });
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
  },
};
</script>
