<template>
  <v-card min-width="100%">
    <v-snackbar v-model="snackError" :color="'#E53935'" :timeout="3000" :top="true">{{errorMessage}}</v-snackbar>
    <div v-if="loaded">
      <v-form ref="form" v-model="valid" :lazy-validation="false" class="mt-5">
        <v-row class="ma-1">
            <v-col> 
              <v-text-field 
              type="text"
              v-model="object.nombre"
              :counter="50"
              label="Nombre"
              required
              :rules="[v => !!v || 'Campo requerido...']"
            ></v-text-field>
            </v-col>
            <v-col> 
              <v-autocomplete
                :items="planes_pago"
                v-model="object.planPago"
                multiple
                item-text="nombre"
                label="Planes de pago"
                :return-object="true"
                :rules="[v => !!v || 'Campo requerido...']"
              ></v-autocomplete>
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
    object: {},
    planes_pago: [],
    loaded: false,
    filterParams: {
      sucursalId: "",
      planPagoName: "",
      page: 1,
      size: 100000,
      totalPages: 0
    },
    tenant: "",
    service: "mediosPago",
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
    if(this.loguedUser.perfil > 1){
      this.filterParams.sucursalId = this.loguedUser.sucursal.id;
    }
    this.filterObjects();
  },

  methods: {
    filterObjects(){
      GenericService(this.tenant, "planesPago", this.token)
      .filter(this.filterParams)
      .then(data => {
        this.planes_pago = data.data.content;
      })
    },

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
      this.object.sucursal = this.loguedUser.sucursal;
      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(() => {
          this.$router.push({ name: "mediosPago" });
        })
        .catch(error => {
          if (error.response.status == 500) {
            this.snackError = true;
            this.errorMessage = "Ocurrio un error";
          }
        });
    },

    back() {
      this.$router.push({ name: "mediosPago" });
    }
  }
};
</script>