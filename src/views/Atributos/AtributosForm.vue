<template>
  <v-container 
  style="min-width: 98%;
  margin-right:40px;
  "
  >
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
              <v-select
                type="text"
                :items="clasificacion.tipoAtributos"
                item-text="text"
                item-value="id"
                v-model="clasificacion.tipoAtributo"
                label="Tipo de atributo"
                required
                :rules="[(v) => !!v || 'Campo requerido...']"
              ></v-select>
            </v-col>
            <v-col v-if="clasificacion.tipoAtributo === 1">
              <v-text-field
                type="text"
                v-model="object.valor"
                label="Texto"
              ></v-text-field>
            </v-col>
            <v-col v-if="clasificacion.tipoAtributo === 2">
              <v-text-field
                type="text"
                oninput="this.value=this.value.replace(/[^0-9.]/g,'');"
                v-model="object.valor"
                label="Valor numérico"
              ></v-text-field>
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
    clasificacion: {
      tipoAtributos: [
        { id: 1, text: "Texto" },
        { id: 2, text: "Numérico" },
      ],
      tipoAtributo: "",
    },
    object: {},
    loaded: false,
    tenant: "",
    service: "atributos",
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
      this.loaded = false;
      this.$refs.form.validate();
      this.object.sucursales = [this.loguedUser.sucursal];
      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(() => {
          this.$router.push({ name: "atributos" });
        })
        .catch((error) => {
          if (error.response.status == 500) {
            this.errorStatus = true;
            this.loaded = true;
          }
        });
    },

    back() {
      this.$router.push({ name: "atributos" });
    },
  },
};
</script>
