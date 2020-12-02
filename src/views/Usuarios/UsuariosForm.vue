<template>
  <v-card min-width="100%">
    <v-snackbar v-model="snackError" :color="'#E53935'" :timeout="3000" :top="true">{{errorMessage}}</v-snackbar>
    <div v-if="loaded">
      <v-form ref="form" v-model="valid" :lazy-validation="false" class="mt-5">
        <v-row class="ma-1">
          <v-col class="col-6">
            <v-text-field
              type="text"
              v-model="object.nombre"
              :maxlength="50"
              :counter="50"
              label="Nombre"
              required
              :rules="[v => !!v || 'Campo requerido']"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="ma-1">
          <v-col class="d-flex col-6">
            <v-select
              :items="perfiles"
              v-model="object.perfil"
              item-text="nombre"
              label="Perfil"
              required
              :return-object="true"              
              :rules="[v => !!v || 'Campo requerido']"
            >
            </v-select>
          </v-col>
        </v-row>
          <v-row class="ma-1">
          <v-col class="d-flex col-6">
            <v-select
              :items="empresas"
              v-model="object.empresa"
              item-text="alias"
              label="Empresa"
              :return-object="true"
            >
            </v-select>
          </v-col>
        </v-row>
        <v-row class="ma-1">
          <v-col class="d-flex col-6">
            <v-select
              :items="sucursales"
              v-model="object.sucursal"
              item-text="nombre"
              label="Sucursal"
              :return-object="true"              
            >
            </v-select>
          </v-col>
        </v-row>
        <v-row class="ma-1">
          <v-col class="d-flex col-6">
            <v-select
              :items="puntos_venta"
              v-model="object.puntoVenta"
              item-text="nombre"
              label="Punto de venta"
              :return-object="true"
            >
            </v-select>
          </v-col>
        </v-row>
        <v-row class="ma-1">
          <v-col class="col-6">
            <v-text-field
              type="text"
              v-model="object.username"
              :maxlength="50"
              :counter="50"
              label="Nombre de usuario"
              required
              :rules="[v => !!v || 'Campo requerido']"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="ma-1">
          <v-col class="col-6" v-if="!object.id || changePassword">
            <v-text-field
              type="text"
              v-model="object.setPassword"
              :maxlength="50"
              :counter="50"
              label="Contraseña"
              required
              :rules="[v => !!v || 'Campo requerido']"
            ></v-text-field>
          </v-col>
          <v-col class="col-6" v-if="object.id">
            <v-btn
              class="mr-4"
              @click="resetPassword()"
              color="primary"
              type="button"
              style="margin-top: 13px;"
            >Restaurar contraseña</v-btn>
          </v-col>
        </v-row>

        <div class="ma-1">
          <v-col class="col-6">
            <v-btn class="mr-4" color="primary" @click="save" :disabled="!valid">Guardar</v-btn>
            <v-btn color="default" @click="back()">Cancelar</v-btn>
          </v-col>
        </div>
      </v-form>
    </div>
    <div v-if="!loaded">
      <v-row class="ma-1">
        <v-col class="col-12" style="text-align:center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script>
import GenericService from "../../services/GenericService";

export default {
  data: () => ({
    valid:true,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    perfiles: [],
    object: {},
    perfil: {},
    empresas: [],
    sucursales: [],
    puntos_venta: [],
    loaded: false,
    changePassword: false,
    tenant: "",
    service: "usuarios",
    token: localStorage.getItem("token"),
    snackError: false,
    errorMessage: ""
  }),

  mounted() {
    this.tenant = this.$route.params.tenant;
    if (this.$route.params.id && this.$route.params.id > 0) {
      this.getObject(this.$route.params.id);
    } else {
      this.loaded = true;
    }
    this.getAllObjects('', 0, 100000);
  },

  methods: {
    getObject(id) {
      GenericService(this.tenant, this.service, this.token)
        .get(id)
        .then(data => {          
          this.object = data.data;
          this.loaded = true;
        });
    },

    getAllObjects(param, page, size){
      let id;
      if(this.loguedUser.perfil !== 1){
        id = this.loguedUser.empresa.id;
      }else{
        id = '';
      }

      const filterParam = {id, param, page, size}

      GenericService(this.tenant, "perfiles", this.token)
      .filter(filterParam)
      .then(data => {
        this.perfiles = data.data.content;
      });

      GenericService(this.tenant, "empresas", this.token)
      .filter(filterParam)
      .then(data => {
        this.empresas = data.data.content;
        this.sucursales = this.empresa.sucursales;
        this.puntos_venta = this.sucursales.puntosVenta;
      });

    },

    save() {
      this.$refs.form.validate();
      this.object.password = this.object.setPassword;
      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(() => {
          this.$router.push({ name: "usuarios" });
        })
        .catch(error => {
          if (error.response.status == 500) {
            this.snackError = true;
            this.errorMessage = error.response.data;
          }
        });
    },

    back() {
      this.$router.push({ name: "usuarios" });
    },

    resetPassword() {
      this.changePassword = !this.changePassword;
    },
  }
};
</script>