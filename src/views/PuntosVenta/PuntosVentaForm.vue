<template>
  <v-card min-width="100%">
    <v-snackbar v-model="snackError" :color="'#E53935'" :timeout="3000" :top="true">{{errorMessage}}</v-snackbar>
    <div v-if="loaded">
      <v-form ref="form" v-model="valid" :lazy-validation="false" class="mt-5">
        <v-row class="ma-1">
          <v-col>
            <v-text-field type="text"
            v-model="object.nombre" 
            :counter="50" 
            label="Nombre" 
            required
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field type="number"
            v-model="object.idFiscal"
            :counter="4" 
            label="ID Fiscal" 
            required
            ></v-text-field>
          </v-col>
          <v-col>
            <v-select
              type="text"
              :items="sucursales"
              item-text="nombre"
              item-value="id"
              v-model="object.sucursal"
              :return-object="true"
              label="Sucursales donde funciona"
              required
              :rules="[v => !!v || 'Campo requerido...']"
            ></v-select>
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
    valid: true,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    sucursales: [],
    object: {},
    loaded: false,
    tenant: "",
    service: "punto_ventas",
    token: localStorage.getItem("token"),
    snackError: false,
    errorMessage: ""
  }),

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterObjects(this.loguedUser.perfil, '', 0, 100000);
    if (this.$route.params.id && this.$route.params.id > 0) {
      this.getObject(this.$route.params.id);
    } else {
      this.loaded = true;
    }
    
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

    filterObjects(idPerfil, stringParam, page, size){
      this.loaded = false
      let idSucursal;

      switch (idPerfil) {
        case 1:
            idSucursal = '';
          break;
      
        default:
            idSucursal = this.loguedUser.sucursal.id;
          break;
      }

      GenericService(this.tenant, "sucursales", this.token)
        .filter({idPerfil, idSucursal, stringParam, page, size})
        .then(data => {
          this.sucursales = data.data.content;
          this.loaded = true;
        });
    },

    save() {
      this.$refs.form.validate();
      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(() => {
          this.$router.push({ name: "puntosVenta" });
        })
        .catch(error => {
          if (error.response.status == 500) {
            this.snackError = true;
            this.errorMessage = "Ocurrio un error";
          }
        });
    },

    back() {
      this.$router.push({ name: "puntosVenta" });
    }
  }
};
</script>