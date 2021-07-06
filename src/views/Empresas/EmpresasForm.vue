<template>
  <v-container  style="min-width: 98%;
  margin-right:40px;
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
              <v-select
                type="text"
                :items="condicioniva"
                item-text="nombre"
                item-value="id"
                v-model="object.condicionIva"
                :counter="50"
                :return-object="true"
                label="Condición frente al IVA"
                required
                :rules="[(v) => !!v || 'Campo requerido...']"
              ></v-select>
            </v-col>
            <v-col>
              <v-text-field
                type="text"
                v-model="object.razonSocial"
                :counter="50"
                label="Razón social"
                required
                :rules="[(v) => !!v || 'Campo requerido...']"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                type="text"
                v-model="object.alias"
                :counter="50"
                label="Nombre de fantasía / Alias"
                required
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                type="text"
                v-model="object.cuit"
                :counter="50"
                label="CUIT o DNI"
                required
                :rules="[(v) => !!v || 'Campo requerido...']"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-1">
            <v-col class="col-3">
              <v-text-field
                type="date"
                v-model="object.fechaInicioAct"
                :counter="50"
                label="Fecha de inicio de actividad"
                required
                :rules="[(v) => !!v || 'Campo requerido...']"
              ></v-text-field>
            </v-col>
            <v-col class="col-3">
              <v-text-field
                type="text"
                v-model="object.ingBruto"
                :counter="50"
                label="Ingresos brutos"
                required
                :rules="[(v) => !!v || 'Campo requerido...']"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                type="text"
                v-model="object.logo"
                :counter="50"
                label="URL de logo"
                required
                :rules="[(v) => !!v || 'Campo requerido...']"
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
    tipopersona: [
      { id: 1, text: "Física" },
      { id: 2, text: "Jurídica" },
    ],
    condicioniva: [],
    object: {
      tipoPersona: 2,
    },
    filterParams: {
      condicionFiscalName: "",
      page: 1,
      size: 100000,
    },
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    loaded: false,
    tenant: "",
    service: "empresas",
    token: localStorage.getItem("token"),
    errorStatus: false,
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
    this.getIvaConditions();
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

    getIvaConditions() {
      GenericService(this.tenant, "condicionesFiscales", this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.condicioniva = data.data.content.filter((el) => el.id !== 3);
        });
    },

    save() {
      this.$refs.form.validate();
      this.loaded = false;
      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(() => {
          this.$router.push({ name: "empresas" });
        })
        .catch((error) => {
          if (error.response.status == 500) {
            this.errorStatus = true;
            this.loaded = true;
          }
        });
    },

    back() {
      this.$router.push({ name: "empresas" });
    },
  },
};
</script>
