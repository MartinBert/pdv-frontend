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
                v-model="object.idFiscal"
                :counter="4"
                label="ID Fiscal"
                required
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                type="text"
                v-model="object.ipLocal"
                :counter="50"
                label="IPV4 Local"
                required
              ></v-text-field>
            </v-col>
            <v-col>
              <v-select
                type="text"
                :items="sucursales"
                item-text="nombre"
                item-value="id"
                v-model="sucursal"
                :return-object="true"
                label="Sucursales donde funciona"
                required
                multiple
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
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    sucursales: [],
    object: {},
    sucursal: [],
    loaded: false,
    tenant: "",
    filterParams: {
      sucursalName: "",
      sucursalSocialReason: "",
      sucursalDirection: "",
      sucursalId: "",
      page: 1,
      size: 100000,
    },
    service: "punto_ventas",
    token: localStorage.getItem("token"),
    errorStatus: false,
  }),

  components: {
    Spinner,
    Error,
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterObjects();
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
          this.sucursal = [this.object.sucursales];
          this.loaded = true;
        });
    },

    filterObjects() {
      this.loaded = false;
      GenericService(this.tenant, "sucursales", this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.sucursales = data.data.content;
          this.loaded = true;
        });
    },

    save() {
      this.$refs.form.validate();
      this.loaded = false;
      this.sucursal.forEach((el) => {
        this.object.sucursal = el;
        GenericService(this.tenant, this.service, this.token)
          .save(this.object)
          .catch((error) => {
            if (error.response.status == 500) {
              this.errorStatus = true;
              this.loaded = true;
            }
          });
      });

      this.$router.push({ name: "puntosVenta" });
    },

    back() {
      this.$router.push({ name: "puntosVenta" });
    },
  },
};
</script>
