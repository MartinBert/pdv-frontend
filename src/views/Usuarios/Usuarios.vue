<template>
  <v-container>
    <h3>Usuarios</h3>
      <v-row>
        <v-col cols="1">
          <v-btn class="primary" @click="newObject()" raised>Nuevo</v-btn>
        </v-col>
        <v-col cols="2">
          <v-autocomplete
          :items="empresas"
          v-model="empresa"
          item-text="razonSocial"
          label="Filtrar por empresa"
          :return-object="true"
          @change="
            filterOptions(
              'c.empresa.id',
              empresa.id,
              paginate.page - 1,
              paginate.size
            )
          "
          ></v-autocomplete>
        </v-col>
        <v-col cols="2">
          <v-autocomplete
            :items="sucursales"
            v-model="sucursal"
            item-text="razonSocial"
            label="Filtrar por sucursal"
            :return-object="true"
            @change="
              filterOptions(
                'c.sucursal.id',
                sucursal.id,
                paginate.page - 1,
                paginate.size
              )
            "
          ></v-autocomplete>
        </v-col>
        <v-col cols="3">
          <v-autocomplete
            :items="puntosVenta"
            v-model="puntoVenta"
            item-text="nombre"
            label="Filtrar por punto de venta"
            :return-object="true"
            @change="
              filterOptions(
                'c.puntoVenta.id',
                puntoVenta.id,
                paginate.page - 1,
                paginate.size
              )
            "
          ></v-autocomplete>
        </v-col>
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
      <v-row>
        <v-col>
          <v-btn class="success" @click="cleanFilters()">Limpiar filtros</v-btn>
        </v-col>
      </v-row>

    <!-- List -->
    <v-simple-table style="background-color: transparent">
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
            <td
              v-if="
                loguedUser.perfil.id === 1 ||
                loguedUser.empresa.id === object.empresa.id
              "
            >
              {{ object.id }}
            </td>
            <td
              v-if="
                loguedUser.perfil.id === 1 ||
                loguedUser.empresa.id === object.empresa.id
              "
            >
              {{ object.nombre }}
            </td>
            <td
              v-if="
                loguedUser.perfil.id === 1 ||
                loguedUser.empresa.id === object.empresa.id
              "
            >
              {{ object.username }}
            </td>
            <td
              v-if="
                loguedUser.perfil.id === 1 ||
                loguedUser.empresa.id === object.empresa.id
              "
            >
              {{ object.perfil.nombre }}
            </td>
            <td
              v-if="
                loguedUser.perfil.id === 1 ||
                loguedUser.empresa.id === object.empresa.id
              "
            >
              <span v-if="object.empresa == null">Todas</span>
              <span v-if="object.empresa != null">{{
                object.empresa.alias
              }}</span>
            </td>
            <td
              v-if="
                loguedUser.perfil.id === 1 ||
                loguedUser.empresa.id === object.empresa.id
              "
            >
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

    <!-- Paginate -->
    <v-pagination
      v-model="paginate.page"
      :length="paginate.totalPages"
      next-icon="mdi-chevron-right"
      prev-icon="mdi-chevron-left"
      :page="paginate.page"
      :total-visible="8"
      @input="changePage(paginate.page - 1, paginate.size)"
      v-if="paginate.totalPages > 1"
    ></v-pagination>
    <!-- End Paginate -->

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
import UsuariosService from "../../services/UsuariosService";

export default {
  data: () => ({
    objects: [],
    filterString: "",
    paginate: {
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "usuarios",
    token: localStorage.getItem("token"),
    dialogDeleteObject: false,
    loguedUser: {},
    empresas: [],
    sucursales: [],
    puntosVenta: [],
    empresa: null,
    sucursal: null,
    puntoVenta: null,
  }),

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.getUserLogued();
    this.getModels();
    this.getAll(this.paginate.page - 1, this.paginate.size);
  },

  methods: {
    getAll(page, size) {
      this.objects = [];
      this.loaded = false;
      GenericService(this.tenant, this.service, this.token)
        .getAll(page, size)
        .then((data) => {
          this.objects = data.data.content;
          this.paginate.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },

    getModels() {
      GenericService(this.tenant, "empresas", this.token)
        .getAll()
        .then((data) => {
          this.empresas = data.data.content;
        });
      GenericService(this.tenant, "sucursales", this.token)
        .getAll()
        .then((data) => {
          this.sucursales = data.data.content;
        });
      GenericService(this.tenant, "punto_ventas", this.token)
        .getAll()
        .then((data) => {
          this.puntosVenta = data.data.content;
        });
    },

    changePage(page, size) {
      if (this.sucursal) {
        this.filterUsersForSucursal(this.sucursal.id, page, size);
      } else {
        this.getAll(page, size);
      }
    },

    newObject() {
      this.$router.push({ name: "usuariosForm", params: { id: 0 } });
    },

    edit(id) {
      this.$router.push({ name: "usuariosForm", params: { id: id } });
    },

    filterObjects(filter) {
      this.empresa = null;
      this.sucursal = null;
      this.puntoVenta = null;
      
      if(filter === ""){
        this.getAll(this.paginate.page - 1, this.paginate.size);
      }
      
      let f = { nombre: filter };
      GenericService(this.tenant, this.service, this.token)
        .filter(f)
        .then((data) => {
          this.objects = data.data.content;
        });
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
          this.getAll(this.paginate.page - 1, this.paginate.size);
        });
    },

    getUserLogued() {
      GenericService(this.tenant, this.service, this.token)
        .getLoguedUser()
        .then((data) => {
          this.loguedUser = data.data;
        });
    },

    filterOptions(filterParam, id, page, size) {
      UsuariosService(this.tenant, this.service, this.token)
        .filterUsersForSucursal(filterParam, id, page, size)
        .then((data) => {
          this.objects = data.data.content;
          this.paginate.totalPages = data.data.totalPages;
        });
    },

    cleanFilters(){
      this.empresa = null;
      this.sucursal = null;
      this.puntoVenta = null;
      this.filterString = "";
      this.getAll(this.paginate.page - 1, this.paginate.size)
    }
  },
};
</script>