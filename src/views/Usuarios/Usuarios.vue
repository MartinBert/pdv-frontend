<template>
  <v-container style="min-width: 99%;
  margin-left:25px;
  ">
    <v-card min-width="100%">
      <v-row>
        <v-col style="margin: 2px;">
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
        <v-col cols="3">
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
      <UsuariosTable
        :items="usuarios"
        v-on:editItem="edit"
        v-on:deleteItem="deleteItem"
        v-if="loaded"
      />
      <Pagination
        :page="filterParams.page"
        :totalPages="filterParams.totalPages"
        :totalVisible="7"
        v-on:changePage="filterObjects"
        v-if="loaded"
      />
      <Spinner v-if="!loaded" />
      <DeleteDialog
        :status="deleteDialogStatus"
        v-on:deleteConfirmation="deleteConfirmation"
      />
    </v-card>
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import UsuariosTable from "../../components/Tables/UsuariosTable";
import Pagination from "../../components/Pagination";
import Spinner from "../../components/Graphics/Spinner";
import DeleteDialog from "../../components/Dialogs/DeleteDialog";
export default {
  data: () => ({
    usuarios: [],
    filterParams: {
      perfilId: "",
      empresaId: "",
      sucursalSocialReason: "",
      perfilName: "",
      puntoVentaName: "",
      usuarioName: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "usuarios",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
  }),

  components: {
    UsuariosTable,
    Pagination,
    Spinner,
    DeleteDialog,
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterParams.perfilId = this.loguedUser.perfil;
    if (this.loguedUser.perfil > 1) {
      this.filterParams.empresaId = this.loguedUser.empresa.id;
    }
    this.filterObjects();
  },

  methods: {
    filterObjects(page) {
      if (page) this.filterParams.page = page;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.usuarios = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          if (this.filterParams.totalPages < this.filterParams.page) {
            this.filterParams.page = 1;
          }
          this.loaded = true;
        });
    },

    newObject() {
      this.$router.push({ name: "usuariosForm", params: { id: 0 } });
    },

    edit(id) {
      this.$router.push({ name: "usuariosForm", params: { id: id } });
    },

    deleteItem(id) {
      this.idObjet = id;
      this.deleteDialogStatus = true;
    },

    deleteConfirmation(result) {
      return result ? this.deleteObject() : (this.deleteDialogStatus = false);
    },

    deleteObject() {
      this.deleteDialogStatus = false;
      GenericService(this.tenant, this.service, this.token)
        .delete(this.idObjet)
        .then(() => {
          this.filterObjects();
        })
        .catch(() => {
          this.$errorAlert(
            "El registro se encuentra asociado a otros elementos en el sistema"
          );
        });
    },
  },
};
</script>
