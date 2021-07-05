<template>
  <v-container style="min-width: 99%;
  margin-left:25px;
  ">
    <v-card min-width="100%">
      <Error :errorStatus="errorStatus" />
      <div v-if="loaded">
        <v-form
          ref="form"
          v-model="valid"
          :lazy-validation="false"
          class="mt-5"
        >
          <v-row class="ma-1">
            <v-col class="col-6">
              <v-text-field
                type="text"
                v-model="object.nombre"
                :maxlength="50"
                :counter="50"
                label="Nombre"
                required
                :rules="[(v) => !!v || 'Campo requerido']"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-1">
            <v-col class="col-6">
              <v-text-field
                type="text"
                v-model="object.direccion"
                :maxlength="50"
                :counter="50"
                label="Dirección"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-1">
            <v-col class="col-6">
              <v-text-field
                type="text"
                v-model="object.telefono"
                :maxlength="50"
                :counter="50"
                label="Telefono"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-1" v-if="loguedUser.perfil <= 2">
            <v-col class="col-6">
              <v-autocomplete
                :items="sucursales"
                item-text="nombre"
                v-model="object.sucursales"
                :return-object="true"
                label="Sucursal"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <div class="ma-1">
            <v-col class="col-6">
              <v-btn
                class="mr-4"
                color="primary"
                @click="save"
                :disabled="!valid"
                >Guardar</v-btn
              >
              <v-btn color="default" @click="back()">Cancelar</v-btn>
            </v-col>
          </div>
        </v-form>
      </div>
      <Spinner v-if="!loaded" />
    </v-card>
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import Spinner from "../../components/Graphics/Spinner";
import Error from "../../components/Error";
export default {
  data: () => ({
    sucursales: [],
    valid: true,
    object: {},
    loaded: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    tenant: "",
    service: "depositos",
    token: localStorage.getItem("token"),
    errorStatus: false,
  }),

  components: {
    Spinner,
    Error,
  },

  mounted() {
    if (this.loguedUser.perfil > 1) {
      this.sucursales = this.loguedUser.empresa.sucursales;
    }
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
        .then((data) => {
          this.object = data.data;
          this.loaded = true;
        });
    },

    save() {
      this.loaded = false;
      this.$refs.form.validate();
      if (this.loguedUser.perfil > 2) {
        this.object.sucursales = this.loguedUser.sucursal;
      }
      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(() => {
          this.$router.push({ name: "depositos" });
        })
        .catch((error) => {
          if (error.response.status == 500) {
            this.errorStatus = true;
            this.loaded = true;
          }
        });
    },

    back() {
      this.$router.push({ name: "depositos" });
    },
  },
};
</script>
