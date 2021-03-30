<template>
  <v-card min-width="100%">
    <Error :errorStatus="errorStatus"/>
    <div v-if="loaded">
      <v-form ref="form" v-model="valid" :lazy-validation="false" class="mt-5">
        <v-row class="ma-1">
            <v-col class="col-3"> 
              <v-text-field 
              type="text"
              v-model="object.nombre"
              :counter="50"
              label="Nombre"
              required
              :rules="[v => !!v || 'Campo requerido...']"
            ></v-text-field>
            </v-col>
            <v-col class="col-3"> 
              <v-text-field 
              type="text"
              v-model="object.codigoDocumento"
              :counter="3"
              label="Código del comprobante"
              required
              :rules="[v => !!v || 'Campo requerido...']"
            ></v-text-field>
            </v-col>
            <v-col class="col-3"> 
              <v-text-field 
              type="number"
              v-model="object.ivaCat"
              :counter="1"
              label="Tipo IVA"
              required
              :rules="[v => !!v || 'Campo requerido...']"
            ></v-text-field>
            </v-col>
            <v-col class="col-3"> 
              <v-text-field 
              type="text"
              v-model="object.letra"
              label="Letra"
              required
              :rules="[v => !!v || 'Campo requerido...']"
            ></v-text-field>
            </v-col>
        </v-row>
        <v-row class="ma-1">
          <v-col cols="12" sm="6" md="6">
            <v-radio-group 
            label="Tipo de documento"
            v-model="object.tipo" 
            column 
            required
            :rules="[v => !!v || 'Campo requerido...']"
            >
              <v-radio
                label="Fiscal"
                color="red"
                value="true"
              ></v-radio>
              <v-radio
                label="No fiscal"
                color="secondary"
                value="false"
              ></v-radio>
            </v-radio-group>
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
    <Spinner v-if="!loaded"/>
  </v-card>
</template>
<script>
import GenericService from "../../services/GenericService";
import Spinner from '../../components/Graphics/Spinner';
import Error from '../../components/Error';
export default {
  data: () => ({
    valid: true,
    object: {
      activo: true,
    },
    loaded: false,
    tenant: "",
    service: "documentosComerciales",
    token: localStorage.getItem("token"),
    errorStatus: false,
  }),

  components:{
    Spinner,
    Error
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
        .then(data => {
          this.object = data.data;
          this.loaded = true;
        });
    },

    save() {
      this.$refs.form.validate();
      this.loaded = false;
      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(() => {
          this.$router.push({ name: "documentos" });
        })
        .catch(error => {
          if (error.response.status == 500) {
            this.errorStatus = true;
            this.loaded = true;
          }
        });
    },

    back() {
      this.$router.push({ name: "documentos" });
    }
  }
};
</script>