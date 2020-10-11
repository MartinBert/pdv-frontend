<template>
  <v-card min-width="100%">
    <v-snackbar v-model="snackError" :color="'#E53935'" :timeout="3000" :top="true">{{errorMessage}}</v-snackbar>
    <div v-if="loaded">
      <v-form ref="form" v-model="valid" :lazy-validation="false" class="mt-5">
        <v-row class="ma-1" v-if="urlId == 0">
            <v-col>
                <v-autocomplete
                    :items="productos"
                    v-model="object.producto"
                    multiple
                    item-text="nombre"
                    label="Productos"
                    :return-object="true"
                    :rules="[v => !!v || 'Campo requerido...']"
                ></v-autocomplete>
            </v-col>
            <v-col>
                <v-autocomplete
                    :items="depositos"
                    v-model="object.deposito"
                    multiple
                    item-text="nombre"
                    label="Depositos"
                    :return-object="true"
                    :rules="[v => !!v || 'Campo requerido...']"
                ></v-autocomplete>
            </v-col>
            <v-col>
                <v-text-field
                    type="number"
                    :counter="50"
                    v-model="object.cantidad"
                    placeholder="Cantidad"
                    required
                    :rules="[v => !!v || 'Campo requerido...']"
                ></v-text-field>
            </v-col>
        </v-row>
        <v-row class="ma-1"  v-if="urlId > 0">
            <v-col>
                <v-autocomplete
                    disabled
                    :items="productos"
                    v-model="object.producto"
                    item-text="nombre"
                    label="Productos"
                    :return-object="true"
                    :rules="[v => !!v || 'Campo requerido...']"
                ></v-autocomplete>
            </v-col>
            <v-col>
                <v-autocomplete
                    disabled
                    :items="depositos"
                    v-model="object.deposito"
                    item-text="nombre"
                    label="Depositos"
                    :return-object="true"
                    :rules="[v => !!v || 'Campo requerido...']"
                ></v-autocomplete>
            </v-col>
            <v-col>
                <v-text-field
                    type="number"
                    v-model="object.cantidad"
                    :counter="50"
                    placeholder="Cantidad"
                    required
                    :rules="[v => !!v || 'Campo requerido...']"
                ></v-text-field>
            </v-col>
        </v-row>
        <div class="ma-1">
          <v-col class="col-6">
            <v-btn class="mr-4" color="primary" @click="save" :disabled="!valid">Guardar</v-btn>
            <v-btn color="default" @click="back()">Cancelar</v-btn>
            <v-btn color="default" @click="getDepositosForSucursal()">Cancelar</v-btn>
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
import StocksService from '../../services/StocksService';
export default {
  data: () => ({
    valid: true,
    urlId: 0,
    object: {},
    depositos: [],
    productos: [],
    loguedUser: '',
    loaded: false,
    tenant: "",
    service: "stock",
    token: localStorage.getItem("token"),
    snackError: false,
    errorMessage: ""
  }),

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.urlId = this.$route.params.id;
    if (this.$route.params.id && this.$route.params.id > 0) {
      this.getObject(this.$route.params.id);
    } else {
      this.loaded = true;
    }
    this.getOtherModels();
    this.getUserLogued();
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

    getDepositosForSucursal(id){
      StocksService(this.tenant, "depositos", this.token)
      .getDepositosForSucursal(id)
      .then(data => {
        console.log(data);
        this.depositos = data.data.content;
      })
    },

    save() {
      this.$refs.form.validate();
      if(this.urlId > 0){
        GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(() => {
          this.$router.push({ name: "stock" });
        })
        .catch(error => {
          if (error.response.status == 500) {
            this.snackError = true;
            this.errorMessage = "Ocurrio un error";
          }
        });
      }else{
          var stocks = [];
          this.object.deposito.forEach(ele =>{
                this.object.producto.forEach(el => {
                    let obj = {
                        producto: el,
                        deposito: ele,
                        cantidad: this.object.cantidad,
                        sucursal: this.loguedUser.sucursal,
                        algorim: el.nombre+ele.id
                    }
                    stocks.push(obj);
                })
          })
          
          GenericService(this.tenant, this.service, this.token)
          .saveAll(stocks)
          .then(()=>{
              this.$router.push({ name: "stock" });
          })
      }
    },

    back() {
      this.$router.push({ name: "stock" });
    },

    getOtherModels(page, size) {
      GenericService(this.tenant, "depositos", this.token)
        .getAll(page, size)
        .then(data => {
          console.log(data);
          this.depositos = data.data.content;
        });

      GenericService(this.tenant, "productos", this.token)
        .getAll(page, size)
        .then(data => {
          this.productos = data.data.content;
        });
    },

    getUserLogued(){
      GenericService(this.tenant, this.service, this.token)
      .getLoguedUser()
      .then(data => {
        this.loguedUser = data.data;
        this.getDepositosForSucursal(this.loguedUser.sucursal.id);
      })
    }
  }
};
</script>