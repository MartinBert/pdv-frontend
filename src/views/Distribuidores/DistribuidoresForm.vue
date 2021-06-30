<template>
  <v-container style="min-width: 100%;">
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
                :items="tipopersona"
                item-text="text"
                item-value="id"
                v-model="object.tipoPersona"
                label="Tipo de persona"
                required
                :rules="[(v) => !!v || 'Campo requerido...']"
              ></v-select>
            </v-col>
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
                v-model="object.nombre"
                :counter="50"
                label="Nombre"
                required
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                type="number"
                v-model="object.cuit"
                :counter="50"
                label="CUIT o DNI"
                required
                :rules="[(v) => !!v || 'Campo requerido...']"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-3">
            <v-col>
              <v-text-field
                type="text"
                v-model="object.direccion"
                :counter="50"
                label="Dirección"
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
            <v-col>
              <v-text-field
                type="text"
                v-model="object.telefono"
                :counter="50"
                label="Teléfono"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                type="text"
                v-model="object.telefonoAlternativo"
                :counter="50"
                label="Teléfono alternativo"
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
    object: {},
    loaded: false,
    tenant: "",
    service: "distribuidores",
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
    this.getCondicionesIva();
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

    getCondicionesIva() {
      GenericService(this.tenant, "condicionesFiscales", this.token)
        .getAll()
        .then((data) => {
          this.condicioniva = data.data.content;
        });
    },

    save() {
      this.$refs.form.validate();
      this.loaded = false;
      this.object.sucursales = [this.loguedUser.sucursal];
      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(() => {
          this.$router.push({ name: "distribuidores" });
        })
        .catch((error) => {
          if (error.response.status == 500) {
            this.errorStatus = true;
            this.loaded = true;
          }
        });
    },

    back() {
      this.$router.push({ name: "distribuidores" });
    },
  },
};
</script>
