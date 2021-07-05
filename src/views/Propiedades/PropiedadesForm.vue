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
            <v-col cols="6">
              <v-text-field
                type="text"
                v-model="object.nombre"
                :counter="50"
                label="Nombre de propiedad"
                required
                :rules="[(v) => !!v || 'Campo requerido...']"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                :items="clasificacion.tipoAtributos"
                v-model="clasificacion.tipoAtributo"
                label="Tipo de atributos"
                item-text="text"
                item-value="id"
                required
              ></v-autocomplete>
            </v-col>
            <v-col v-if="clasificacion.tipoAtributo == 1">
              <v-autocomplete
                :items="atributosTexto"
                v-model="object.atributos"
                multiple
                label="Atributos de tipo texto"
                item-text="valor"
                :return-object="true"
                required
              ></v-autocomplete>
            </v-col>
            <v-col v-if="clasificacion.tipoAtributo == 2">
              <v-autocomplete
                :items="atributosNumero"
                v-model="object.atributos"
                multiple
                label="Atributos de valor numérico"
                item-text="valorNumerico"
                :return-object="true"
                required
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
    valid: true,
    atributosTexto: [],
    atributosNumero: [],
    clasificacion: {
      tipoAtributos: [
        { id: 1, text: "Texto" },
        { id: 2, text: "Numérico" },
      ],
      tipoAtributo: "",
    },
    filterParams: {
      atributoValor: "",
      page: 1,
      size: 100000,
    },
    object: {},
    loaded: false,
    tenant: "",
    service: "propiedades",
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
    this.getAtributes();
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

    getAtributes() {
      GenericService(this.tenant, "atributos", this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.atributosTexto = data.data.content.filter(
            (el) => el.valor != undefined || el.valor != null
          );
          this.atributosNumero = data.data.content.filter(
            (el) => el.valor === undefined || el.valor === null
          );
        });
    },

    save() {
      this.$refs.form.validate();
      this.loaded = false;
      this.object.sucursales = [this.loguedUser.sucursal];
      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(() => {
          this.$router.push({ name: "propiedades" });
        })
        .catch((error) => {
          if (error.response.status == 500) {
            this.errorStatus = true;
            this.loaded = true;
          }
        });
    },

    back() {
      this.$router.push({ name: "propiedades" });
    },
  },
};
</script>
