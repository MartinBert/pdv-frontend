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
      </v-row>
    </v-form>

    <!-- List -->
    <v-simple-table style="background-color: transparent;">
      <template v-slot:default>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Razón Social</th>
            <th>CUIT</th>
            <th>Detalles</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody v-for="object in objects" :key="object.id">
          <tr>
            <td>{{object.id}}</td>
            <td>{{object.nombre}}</td>
            <td>{{object.razonSocial}}</td>
            <td>{{object.cuit}}</td>
            <td>
                <v-icon title="Stock" @click="showStock(object.id)">mdi-text-box</v-icon>
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
      @input="filterObjects(filterString, paginate.page - 1, paginate.size)"
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
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    paginate: {
      page: 1,
      size: 10,
      totalPages: 0
    },
    loaded: false,
    tenant: "",
    service: "distribuidores",
    token: localStorage.getItem("token"),
    dialogDeleteObject: false
  }),
  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterObjects(this.filterString, this.paginate.page - 1, this.paginate.size);
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

      GenericService(this.tenant, this.service, this.token)
        .filter({id, param, page, size})
        .then((data) => {
          this.objects = data.data.content;
          this.paginate.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },

    newObject() {
      this.$router.push({ name: "distribuidoresForm", params: { id: 0 } });
    },

    edit(id) {
      this.$router.push({ name: "distribuidoresForm", params: { id: id } });
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
    }
  }
};
</script>