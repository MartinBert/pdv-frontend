<template>
  <v-card min-width="100%">
    <v-snackbar v-model="snackError" :color="'#E53935'" :timeout="3000" :top="true">{{errorMessage}}</v-snackbar>
    <div v-if="loaded">
      <v-form ref="form" v-model="valid" :lazy-validation="false" class="mt-5">
        <v-row class="ma-1">
          <v-col>
            <v-select
              type="text"
              :items="empresas"
              item-text="alias"
              item-value="id"
              v-model="object.empresa"
              :return-object="true"
              label="Empresa"
              required
              :rules="[v => !!v || 'Campo requerido...']"
            ></v-select>
          </v-col>
          <v-col>
            <v-text-field
              type="text"
              v-model="object.nombre"
              :counter="50"
              label="Nombre de sucursal"
              required
              :rules="[v => !!v || 'Campo requerido...']"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field type="text"
            v-model="object.telefono" 
            :counter="50" 
            label="Teléfono" 
            required
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field type="text"
            v-model="object.telefonoAlternativo" 
            :counter="50" 
            label="Teléfono alternativo" 
            required
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
        </v-row>
        <v-row class="ma-1">
          <v-col>
            <v-text-field type="text" 
            v-model="object.provincia" 
            :counter="50" 
            label="Provincia"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field type="text" 
            v-model="object.ciudad" 
            :counter="50" 
            label="Ciudad"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field type="text" 
            v-model="object.direccion" 
            :counter="50" 
            label="Dirección"
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
        <v-row class="mt-5"></v-row>
        <v-row class="mt-5"></v-row>
        <v-row class="mt-5"></v-row>
        <v-row class="mt-5"></v-row>
        <v-row class="mt-5">
          <v-col class="text-center">
            <h4>Completar en caso de que la sucursal no realice sus actividades comerciales bajo la misma informacion fiscal que la empresa</h4>
          </v-col>
        </v-row>

        <v-row class="ml-1 mr-1 mb-1">
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
            ></v-select>
          </v-col>
          <v-col>
            <v-text-field
              type="text"
              v-model="object.cuit"
              :counter="50"
              label="CUIT"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field type="date"
            v-model="object.fechaInicioAct" 
            :counter="50" 
            label="Fecha de inicio de actividad" 
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field type="text"
            v-model="object.ingBruto" 
            :counter="50" 
            label="Número de ingresos brutos" 
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              type="text"
              v-model="object.razonSocial"
              :counter="50"
              label="Razón social"
            ></v-text-field>
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
</template>
<script>
import GenericService from "../../services/GenericService";
export default {
  data: () => ({
    valid: true,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    tipopersona: [
      { id: 1, text: "Física" },
      { id: 2, text: "Jurídica" }
    ],
    filterParams:{
      empresas: {
        perfilId: "",
        empresaId: "",
        empresaName: "", 
        empresaCuit: "",
        empresaSocialReason: "",
        page: 1,
        size: 100000
      },
      condicionesFiscales: {
        condicionFiscalName: "",
        page: 1,
        size: 100000
      }
    },
    condicioniva: [],
    object: {},
    empresas: [],
    loaded: false,
    tenant: "",
    service: "sucursales",
    token: localStorage.getItem("token"),
    snackError: false,
    errorMessage: ""
  }),

  mounted() {
    this.tenant = this.$route.params.tenant;
    if (this.$route.params.id && this.$route.params.id > 0) {
      this.getObject(this.$route.params.id);
    } else {
      this.loaded = true;
    }
    this.filterParams.empresas.perfilId = this.loguedUser.perfil;
    if(this.loguedUser.perfil > 1){
      this.filterParams.empresas.empresaId = this.loguedUser.empresa.id;
    }
    this.filterObjects()
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

    filterObjects(){
      this.loaded = false
      GenericService(this.tenant, "empresas", this.token)
        .filter(this.filterParams.empresas)
        .then(data => {
          this.empresas = data.data.content;
        });

      GenericService(this.tenant, "condicionesFiscales", this.token)
        .filter(this.filterParams.condicionesFiscales)
        .then(data => {
          this.condicioniva = data.data.content.filter(el => el.id !== 3)
          this.loaded = true;
        });
    },

    save() {

      if(!this.object.condicionIva || !this.object.cuit || !this.object.fechaInicioAct || !this.object.ingBruto || !this.object.razonSocial){
        this.object.condicionIva = this.object.empresa.condicionIva;
        this.object.cuit = this.object.empresa.cuit;
        this.object.fechaInicioAct = this.object.empresa.fechaInicioAct;
        this.object.ingBruto = this.object.empresa.ingBruto;
        this.object.razonSocial = this.object.empresa.razonSocial;
      }

      this.$refs.form.validate();
      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(() => {
          this.$router.push({ name: "sucursales" });
        })
        .catch(error => {
          if (error.response.status == 500) {
            this.snackError = true;
            this.errorMessage = "Ocurrio un error";
          }
        });
    },

    back() {
      this.$router.push({ name: "sucursales" });
    }
  }
};
</script>