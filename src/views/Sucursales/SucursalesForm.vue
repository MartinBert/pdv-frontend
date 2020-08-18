<template>
  <v-card min-width="100%">
    <v-snackbar v-model="snackError" :color="'#E53935'" :timeout="3000" :top="true">{{errorMessage}}</v-snackbar>
    <div v-if="loaded">
      <v-form ref="form" v-model="valid" :lazy-validation="false" class="mt-5">
        <v-row class="ma-1">
          <v-col>
            <v-select
              type="text"
              :items="empresas"
              item-text="alias"
              item-value="id"
              v-model="object.empresa"
              :return-object="true"
              label="Empresa"
              required
              :rules="[v => !!v || 'Campo requerido...']"
            ></v-select>
          </v-col>
          <v-col>
            <v-text-field
              type="text"
              v-model="object.nombre"
              :counter="50"
              label="Nombre de sucursal"
              required
              :rules="[v => !!v || 'Campo requerido...']"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field type="text"
            v-model="object.telefono" 
            :counter="50" 
            label="Teléfono" 
            required
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field type="text"
            v-model="object.telefonoAlternativo" 
            :counter="50" 
            label="Teléfono alternativo" 
            required
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              type="text"
              v-model="object.email"
              :counter="50"
              label="Email"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="ma-3">
          <v-col>
            <v-text-field type="text" 
            v-model="object.provincia" 
            :counter="50" 
            label="Provincia"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field type="text" 
            v-model="object.ciudad" 
            :counter="50" 
            label="Ciudad"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field type="text" 
            v-model="object.direccion" 
            :counter="50" 
            label="Dirección"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              type="text"
              v-model="object.nombreContacto"
              :counter="50"
              label="Nombre de contacto"
            ></v-text-field>
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
    tipopersona: [
      { id: 1, text: "Física" },
      { id: 2, text: "Jurídica" }
    ],
    condicioniva: [],
    object: {},
    empresas: [],
    loaded: false,
    tenant: "",
    service: "sucursales",
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
    this.getCondicionesIva();
    this.getEmpresas();
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

    getCondicionesIva(){
      GenericService(this.tenant, "condicionesFiscales", this.token)
        .getAll()
        .then(data => {
          this.condicioniva = data.data.content;
          console.log(this.condicioniva);
        });
    },

    getEmpresas(){
      GenericService(this.tenant, "empresas", this.token)
        .getAll()
        .then(data => {
          this.empresas = data.data.content;
        });
    },

    save() {
      this.$refs.form.validate();
      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(() => {
          this.$router.push({ name: "sucursales" });
        })
        .catch(error => {
          if (error.response.status == 500) {
            this.snackError = true;
            this.errorMessage = "Ocurrio un error";
          }
        });
    },

    back() {
      this.$router.push({ name: "sucursales" });
    }
  }
};
</script>