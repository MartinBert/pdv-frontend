<template>
  <v-container
    style="min-width: 98%;
   margin-right: 40px;
  "
  >
    <v-card>
      <Error :errorStatus="errorStatus" />
      <div v-if="loaded">
        <v-form ref="form" class="mt-5">
          <v-row class="ma-1">
            <v-col class="col-6">
              <v-text-field
                type="text"
                v-model="object.nombreImpresora"
                :counter="50"
                label="Nombre"
                required
                :rules="[(v) => !!v || 'Campo requerido...']"
              ></v-text-field>
            </v-col>
            <v-col class="col-6">
              <v-select
                type="text"
                :items="items"
                v-model="object.valor"
                :counter="50"
                label="Tamaño del papel"
                required
                :rules="[(v) => !!v || 'Campo requerido...']"
              ></v-select>
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
    object: {},
    items: ["80mm"],
    loaded: false,
    tenant: "",
    service: "impresoras",
    token: localStorage.getItem("token"),
    errorStatus: false,
    filterParams: {
      page: 1,
      size: 10,
      totalPages: 0,
    },
  }),

  components: {
    Spinner,
    Error,
  },

  mounted() {
    this.getObject();
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
      this.object.impresoraPredeterminada = false;
      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(() => {
          this.$router.push({ name: "impresoras", params: { id: 0 } });
          console.log(this.object);
        })
        .catch((error) => {
          if (error.response.status == 500) {
            this.errorStatus = true;
            this.loaded = true;
          }
        });
    },

    back() {
      this.$router.push({ name: "impresoras" });
    },
  },
};
</script>
