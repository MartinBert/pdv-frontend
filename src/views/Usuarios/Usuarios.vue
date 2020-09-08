<template>
  <v-container>
    <h3>Usuarios</h3>
    <v-form class="mb-3">
      <v-row>
        <v-col cols="6">
          <v-btn class="primary" @click="newObject()" raised>Nuevo</v-btn>
        </v-col>
        <v-col cols="3"></v-col>
        <v-col cols="3">
          <v-text-field
            v-model="filterString"
            v-on:input="filterObjects(filterString)"
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
    <v-simple-table style="background-color: transparent;">
      <template v-slot:default>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Perfil</th>
            <th>Empresa</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody v-for="object in objects" :key="object.id">
          <tr>
            <td>{{object.id}}</td>
            <td>{{object.nombre}}</td>
            <td>{{object.username}}</td>
            <td>{{object.perfil.nombre}}</td>
            <td>
              <span v-if="object.empresa == null">Todas</span>
              <span v-if="object.empresa != null">{{object.empresa.alias}}</span>
            </td>
            <td>
              <a title="Editar"><img src="/../../images/icons/ico_10.svg" @click="edit(object.id)" width="40" height="40"/></a>
              <a title="Eliminar"><img src="/../../images/icons/ico_11.svg" @click="openDelete(object.id)" width="40" height="40"/></a>
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

    <!-- Paginate -->
    <v-pagination
      v-model="paginate.page"
      :length="paginate.totalPages"
      next-icon="mdi-chevron-right"
      prev-icon="mdi-chevron-left"
      :page="paginate.page"
      :total-visible="8"
      @input="changePage"
      v-if="paginate.totalPages > 1"
    ></v-pagination>
    <!-- End Paginate -->

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
  </v-container>
</template>

<script>
import GenericService from "../../services/GenericService";

export default {
  data: () => ({
    objects: [],
    filterString: "",
    paginate: {
      page: 1,
      size: 10,
      totalPages: 0
    },
    loaded: false,
    tenant: "",
    service: "usuarios",
    token: localStorage.getItem("token"),
    dialogDeleteObject: false
  }),
  mounted() {
    this.tenant = this.$route.params.tenant;
    this.getAll(this.paginate.page - 1, this.paginate.size);
  },
  methods: {
    getAll: function(page, size) {
      this.objects = [];
      this.loaded = false;
      GenericService(this.tenant, this.service, this.token)
        .getAll(page, size)
        .then(data => {
          this.objects = data.data.content;
          this.paginate.totalPages = data.data.totalPages;
          this.loaded = true;
          console.log(this.objects)
        });
    },

    changePage: function(page) {
      this.getAll(page - 1, this.paginate.size);
    },

    newObject: function() {
      this.$router.push({ name: "usuariosForm", params: { id: 0 } });
    },

    edit: function(id) {
      this.$router.push({ name: "usuariosForm", params: { id: id } });
    },

    filterObjects: function(filter){
      var f ={
        nombre:filter
      }
      GenericService(this.tenant, this.service, this.token)
        .filter(f)
        .then(data => {
          this.objects = data.data.content;
        });
    },

    openDelete: function(id) {
      this.idObjet = id;
      this.dialogDeleteObject = true;
    },

    deleteObject: function() {
      this.dialog = true;
      this.dialogDeleteObject = false;
      GenericService(this.tenant, this.service, this.token)
        .delete(this.idObjet)
        .then(() => {
          this.getAll(this.paginate.page - 1, this.paginate.size);
        });
    }
  }
};
</script>