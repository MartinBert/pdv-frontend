<template>
  <v-card min-width="100%">
    <v-snackbar v-model="snackError" :color="'#E53935'" :timeout="3000" :top="true">{{errorMessage}}</v-snackbar>
    <div v-if="loaded">
      <v-form ref="form" v-model="valid" :lazy-validation="false" class="mt-5">
        <v-row class="ml-1 mr-1">
            <v-col cols="12">
                <v-select
                    type="text"
                    :items="operationType"
                    item-text="text"
                    item-value="id"
                    v-model="operation"
                    label="Seleccione la operación a realizar"
                    required
                    :rules="[v => !!v || 'Campo requerido...']"
                ></v-select>
            </v-col>
        </v-row>
        <v-row class="ma-1" v-if="operation === 1">
          <v-col cols="3">
            <v-text-field
                type="number"
                v-model="object.existenciaFisica"
                label="Existencia física"
                required
                :rules="[v => !!v || 'Campo requerido...']"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field 
                type="number"
                v-model="object.salidasNoContabilizadas" 
                label="Egresos"
                required
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
                type="number"
                v-model="object.montoFacturado"
                label="Monto facturado"
                required
                :rules="[v => !!v || 'Campo requerido...']"
                disabled
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
                type="number"
                v-model="diferencia"
                label="Diferencia"
                required
                :rules="[v => !!v || 'Campo requerido...']"
                disabled
            ></v-text-field>
          </v-col>
          <v-col class="text-right">
            <span v-bind:class="detailMessage.classType">{{detailMessage.message}}</span>
          </v-col>
        </v-row>
        <div class="ma-1">
          <v-col class="col-6">
            <v-btn class="mr-4" color="primary" @click="save" :disabled="!valid">Procesar</v-btn>
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
import VentasService from "../../services/VentasService";
import { restarNumeros } from "../../helpers/mathHelper";
export default {
  data: () => ({
    valid: true,
    operationType: [
      { id: 1, text: "Arqueo de caja" },
      { id: 2, text: "Cierre Z" }
    ],
    operation: "",
    ventas: [],
    object: {
      existenciaFisica: 0,
      salidasNoContabilizadas: 0,
      montoFacturado: 0
    },
    loaded: false,
    tenant: "",
    service: "caja",
    token: localStorage.getItem("token"),
    snackError: false,
    errorMessage: "",
    loguedUser: JSON.parse(localStorage.getItem("userData"))
  }),

  mounted() {
    this.tenant = this.$route.params.tenant;
    if (this.$route.params.id && this.$route.params.id > 0) {
      this.getObject(this.$route.params.id);
    } else {
      this.loaded = true;
    }

    this.getSalesList("", 0, 100000);
  },

  computed:{
    diferencia(){
      return restarNumeros([this.object.existenciaFisica, this.object.salidasNoContabilizadas, this.object.montoFacturado]);
    },

    detailMessage(){
      if(this.diferencia < 0){
        return {classType: 'errorArqueo', message: 'Faltante de caja'};
      }else if(this.diferencia > 0){
        return {classType: 'errorArqueo', message: 'Sobrante de caja'};
      }else{
        return {classType: 'successArqueo', message: 'Los montos computados y el recuento son coincidentes'};
      }
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

    getSalesList(param, page, size){
        let id;
        if(this.loguedUser.perfil < 3){
            id = "";
        }else{
            id = this.loguedUser.sucursal.id;
        }

        VentasService(this.tenant, this.service, this.token)
        .filterNotCloseReceipts({id, param, page, size})
        .then(data => {
            this.ventas = data.data.content;
            this.object.montoFacturado = this.ventas.reduce((acc, el) => Math.round((acc + Number(el.totalVenta))*100)/100, 0);
        })
    },

    save() {
      this.object.sucursal = this.loguedUser.sucursal;
      this.object.diferencia = this.diferencia();
      this.ventas.forEach(el => {
        el.cerrado = "cerrado";
      })

      GenericService(this.tenant, "comprobantesFiscales")

      this.$refs.form.validate();
      this.object.sucursales = [this.loguedUser.sucursal];
      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(() => {
          this.$router.push({ name: "caja" });
        })
        .catch(error => {
          if (error.response.status == 500) {
            this.snackError = true;
            this.errorMessage = "Ocurrio un error";
          }
        });
    },

    back() {
      this.$router.push({ name: "caja" });
    },
  }
};
</script>
<style>
.errorArqueo{
  font-size: 1.2rem;
  border: solid 1px;
  border-radius: 15px;
  padding: 15px;
  color: red;
}
.successArqueo{
  border: solid 1px;
  border-radius: 15px;
  padding: 15px;
  font-size: 1.2rem;
  color:green;
}
</style>