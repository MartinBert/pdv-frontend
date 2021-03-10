<template>
  <v-container>
    <v-form class="mb-3">
      <v-row>
        <v-col>
          <v-btn class="primary" @click="newObject()" raised>Nuevo</v-btn>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.personaSocialReason"
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
            v-model="filterParams.personaName"
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
            v-model="filterParams.personaCuit"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            placeholder="Cuit"
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
            <th>Razón Social</th>
            <th>CUIT</th>
            <th>Detalles</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody v-for="object in objects" :key="object.id">
          <tr>
            <td>{{object.nombre}}</td>
            <td>{{object.razonSocial}}</td>
            <td>{{object.cuit}}</td>
            <td>
                <v-icon title="Stock" @click="showStock(object.id)">mdi-text-box</v-icon>
            </td>
            <td>
              <a title="Editar"><img src="/../../images/icons/edit.svg" @click="edit(object.id)" width="30" height="30"/></a>
              <a title="Eliminar"><img src="/../../images/icons/delete.svg" @click="openDelete(object.id)" width="30" height="30"/></a>
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
  </v-container>
</template>

<script>
import GenericService from "../../services/GenericService";

export default {
  data: () => ({
    objects: [],
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    filterParams: {
      sucursalId: "",
      personaSocialReason: "",
      personaName: "",
      personaCuit: "",
      personaDirection: "",
      personaContactName: "",
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
    if(this.loguedUser.perfil > 1){
      this.filterParams.sucursalId = this.loguedUser.sucursal.id
    }
    this.filterObjects();
  },
  methods: {

    filterObjects() {
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.objects = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
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
          this.filterObjects();
        });
    }
  }
};
</script>