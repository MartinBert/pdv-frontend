<template>
  <v-container style="min-width: 96%
  margin-left:2px
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
            <v-col>
              <v-text-field
                type="text"
                v-model="object.nombre"
                :counter="50"
                label="Descripción"
                required
                :rules="[(v) => !!v || 'Campo requerido...']"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                type="number"
                v-model="object.porcentaje"
                :counter="50"
                label="Porcentaje"
                required
                :rules="[(v) => !!v || 'Campo requerido...']"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-autocomplete
                :items="ivaTypes"
                item-text="text"
                item-value="value"
                v-model="object.tipo"
              />
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
    valid: true,
    ivaTypes: [
      { text: "Iva compras", value: true },
      { text: "Iva ventas", value: false },
    ],
    object: {
      tipo: false,
    },
    loaded: false,
    tenant: "",
    service: "ivas",
    token: localStorage.getItem("token"),
    errorStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
  }),

  components: {
    Spinner,
    Error,
  },

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
        .then((data) => {
          this.object = data.data;
          this.loaded = true;
        });
    },

    save() {
      this.$refs.form.validate();
      this.loaded = false;
      this.object.sucursales = [this.loguedUser.sucursal];
      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(() => {
          this.$router.push({ name: "ivas" });
        })
        .catch((error) => {
          if (error.response.status == 500) {
            this.errorStatus = true;
            this.loaded = true;
          }
        });
    },

    back() {
      this.$router.push({ name: "ivas" });
    },
  },
};
</script>
