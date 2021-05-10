<template>
  <v-row align="center" justify="center" class="backgroundclass">
    <v-col cols="12">
      <v-container fluid absolute style="width:20%">
        <div class="card-login">
          <v-flex>
          <div class="toolbarclass"></div>
            <v-form @submit.prevent="onSubmit" novalidate align="center">
              <v-text-field
                prepend-inner-icon="mdi-account"
                :error-messages="errors"
                type="email"
                v-model.trim="username"
                placeholder="Usuario"
                dense
                dark
                autofocus
                class="ml-5 mr-5 pt-5 pl-5 pr-5 input-login"
                required
              />
              <v-text-field
                :error-messages="errors"
                prepend-inner-icon="mdi-lock"
                type="password"
                v-model.trim="password"
                placeholder="Contraseña"
                dense
                dark
                class="ml-5 mr-5 pt-3 pl-5 pr-5 input-login"
                required
              />
              <button type="submit" class="button-login mb-5 mt-3">LOGIN</button>
            </v-form>
          </v-flex>
        </div>
      </v-container>
    </v-col>
    <div>
      <img src="https://micuenta.donweb.com/img/sectigo_positive_md.png">
    </div>
  </v-row>
</template>
<script>
import axios from "axios";
export default {
  data: function() {
    return {
      username: "",
      password: "",
      errors: "",
    };
  },

  methods: {
    onSubmit: function() {
      if (this.password) {
        axios
        .post(
          `${process.env.VUE_APP_SERVER}/${this.$route.params.tenant}/auth/login`,
          {
            username: this.username,
            password: this.password
          }
        )
        .then(res => {
          if (res.status == 200) {
            localStorage.setItem(
              process.env.VUE_APP_TOKEN,
              res.data.Authorization
            );
            this.$emit("authenticated", true);
            this.$router.push({ path: "/" + this.$route.params.tenant});          
          }
        })
        .then(()=>{
          axios.get(`${process.env.VUE_APP_SERVER}/${this.$route.params.tenant}/api/usuarios/getLogued`,
          { headers: { Authorization: "Bearer " + localStorage.getItem('token') }})
          .then(data => {
            if(data.data.perfil.id > 1){
              const userData = {
                "id": data.data.id,
                "nombre": data.data.nombre,
                "perfil": data.data.perfil.id,
                "sucursal": data.data.sucursal,
                "puntoVenta": data.data.puntoVenta,
                "empresa": data.data.empresa
              }
              console.log(userData);
              localStorage.setItem("userData", JSON.stringify(userData));            
            }else{
              const userData = {
                "perfil": data.data.perfil.id,
              }
              localStorage.setItem("userData", JSON.stringify(userData));
            }
          })
        })
        .catch((err) => {
          this.errors = "Credenciales inválidas";
          console.log(err.response);
        });
      }
    },
  },
}
</script>