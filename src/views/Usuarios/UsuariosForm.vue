<template>
  <v-card min-width="100%">
    <Error :errorStatus="errorStatus"/>
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
          <v-row v-if="loguedUser.perfil === 1" class="ma-1">
          <v-col class="d-flex col-6">
            <v-select
              :items="empresas"
              v-model="object.empresa"
              item-text="alias"
              label="Empresa"
              :return-object="true"
              @change="get('sucursales')"
            >
            </v-select>
          </v-col>
        </v-row>
        <v-row class="ma-1">
          <v-col class="d-flex col-6">
            <v-select
              :items="listenenItems.sucursales"
              v-model="object.sucursal"
              item-text="nombre"
              label="Sucursal"
              :return-object="true"
              @change="get('puntos_venta')"              
            >
            </v-select>
          </v-col>
        </v-row>
        <v-row class="ma-1">
          <v-col class="d-flex col-6">
            <v-select
              :items="listenenItems.puntos_venta"
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
    <Spinner v-if="!loaded"/>
  </v-card>
</template>
<script>
import GenericService from "../../services/GenericService";
import Spinner from '../../components/Graphics/Spinner';
import Error from '../../components/Error';
export default {
  data: () => ({
    valid:true,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    perfiles: [],
    object: {},
    perfil: {},
    empresas: [],
    listenenItems: { sucursales: [], puntos_venta: [] },
    loaded: false,
    changePassword: false,
    filterParams: {
      perfiles: {
        perfilId: "",
        perfilName: "",
        page: 1,
        size: 100000
      },
      empresas: {
        perfilId: "",
        empresaId: "",
        empresaName: "", 
        empresaCuit: "",
        empresaSocialReason: "",
        page: 1,
        size: 100000
      }
    },
    tenant: "",
    service: "usuarios",
    token: localStorage.getItem("token"),
    errorStatus: false,
  }),

  components:{
    Spinner,
    Error
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    if (this.$route.params.id && this.$route.params.id > 0) {
      this.getObject(this.$route.params.id);
    } else {
      this.loaded = true;
    }
    this.filterParams.perfiles.perfilId = this.loguedUser.perfil;
    this.filterParams.empresas.perfilId = this.loguedUser.perfil;
    if(this.loguedUser.perfil > 1){
      this.filterParams.empresas.empresaId = this.loguedUser.empresa.id;
    }
    this.getAllObjects();
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
    getAllObjects(){
      GenericService(this.tenant, "perfiles", this.token)
      .filter(this.filterParams.perfiles)
      .then(data => {
        this.perfiles = data.data.content;
      });

      GenericService(this.tenant, "empresas", this.token)
      .filter(this.filterParams.empresas)
      .then(data => {
        this.empresas = data.data.content;
        if(this.loguedUser.perfil !== 1){
          this.object.empresa = this.empresas[0];
          this.get('sucursales');
        }
      });

    },

    get(param){
      if(param === "sucursales"){
        this.listenenItems.sucursales = this.object.empresa.sucursales;
      }else{
        this.listenenItems.puntos_venta = this.object.sucursal.puntosVenta;
      }
    },

    save() {
      this.$refs.form.validate();
      this.loaded = false;
      this.object.password = this.object.setPassword;
      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(() => {
          this.$router.push({ name: "usuarios" });
        })
        .catch(error => {
          if (error.response.status == 500) {
            this.errorStatus = true;
            this.loaded = true;
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