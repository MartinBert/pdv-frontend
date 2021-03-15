<template>
  <v-container>
    <Error :errorStatus="errorStatus"/>
      <v-card min-width="100%" v-if="loaded">
        <div>
          <v-form ref="form" v-model="valid" :lazy-validation="false" class="mt-5">
            <v-row class="ma-1">
                <v-col class="col-6"> 
                  <v-text-field 
                  type="text"
                  v-model="object.nombre"
                  :counter="50"
                  label="Nombre"
                  required
                  :rules="[v => !!v || 'Campo requerido...']"
                ></v-text-field>
                </v-col>   
            </v-row>
            <v-row class="ma-1">
              <v-col>     
                <v-autocomplete
                  :items="documentos"
                  v-model="object.documentos"
                  item-text="nombre"
                  item-value="id"
                  :return-object="true"
                  label="Documentos asociados"
                  :rules="[v => !!v || 'Campo requerido...']"
                  multiple
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
      <Spinner v-if="!loaded"/>
  </v-container>
</template>

<script>
import GenericService from "../../services/GenericService";
import Error from '../../components/Error';
import Spinner from '../../components/Spinner';

export default {
  data: () => ({
    valid: true,
    tipoIdentificacion:[
      {"id": 1, "text": "CUIT"},
      {"id": 2, "text": "DNI"}
    ],
    object: {
      activo: true,
    },
    documentos: [],
    loaded: false,
    tenant: "",
    service: "condicionesFiscales",
    token: localStorage.getItem("token"),
    errorStatus: false
  }),

  components:{
    Error,
    Spinner
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.getDocumentos(0, 200000);
    if (this.$route.params.id && this.$route.params.id > 0) {
      this.getObject(this.$route.params.id);
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

    getDocumentos(page, size){
      GenericService(this.tenant, "documentosComerciales", this.token)
        .getAll(page, size)
        .then(data => {
          this.documentos = data.data.content;
          this.loaded = true;
        });
    },

    save() {
      this.$refs.form.validate();
      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(() => {
          this.$router.push({ name: "condicionesFiscales" });
        })
        .catch(error => {
          if (error.response.status == 500) {
            this.errorStatus = true;
          }
        });
    },

    back() {
      this.$router.push({ name: "condicionesFiscales" });
    }
  }
};
</script>