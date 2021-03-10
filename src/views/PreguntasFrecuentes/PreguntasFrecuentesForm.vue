<template>
  <v-card min-width="100%">
    <v-snackbar v-model="snackError" :color="'#E53935'" :timeout="3000" :top="true">{{errorMessage}}</v-snackbar>
    <div v-if="loaded">
      <v-form ref="form" v-model="valid" :lazy-validation="false" class="mt-5">
        <v-row class="ma-1">
          <v-col cols="12">
            <v-text-field
              outlined
              rounded
              type="text"
              v-model="object.pregunta"
              label="Escriba aquí la pregunta"
              placeholder=" "
              required
              :rules="[v => !!v || 'Campo requerido...']"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
            outlined
              rounded
              type="text"
              v-model="object.respuesta"
              label="Escriba aquí la respuesta"
              placeholder=" "
              required
              :rules="[v => !!v || 'Campo requerido...']"
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
    object: {},
    loaded: false,
    tenant: "",
    service: "preguntasFrecuentes",
    token: localStorage.getItem("token"),
    snackError: false,
    errorMessage: "",
    loguedUser: JSON.parse(localStorage.getItem("userData"))
  }),

  mounted() {
    this.tenant = this.$route.params.tenant;
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

    save() {
      this.$refs.form.validate();
      this.object.sucursales = [this.loguedUser.sucursal];
      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(() => {
          this.$router.push({ name: "preguntasFrecuentes" });
        })
        .catch(error => {
          if (error.response.status == 500) {
            this.snackError = true;
            this.errorMessage = "Ocurrio un error";
          }
        });
    },

    back() {
      this.$router.push({ name: "preguntasFrecuentes" });
    }
  }
};
</script>