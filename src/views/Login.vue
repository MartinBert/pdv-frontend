<template>
  <v-row align="center" justify="center" class="backgroundclass">
    <v-col cols="12">
      <v-container fluid absolute style="width:25%">
        <v-card elevation="24">
          <v-flex>
          <v-toolbar class="toolbarclass" shaped dark prominent></v-toolbar>
            <v-form @submit.prevent="onSubmit" novalidate>
              <v-text-field
                outlined
                :error-messages="errors"
                type="email"
                v-model.trim="username"
                placeholder="Ingrese su nombre de usuario"
                dense
                autofocus
                class="ml-5 mr-5 mt-5"
                required
              />
              <v-text-field
                outlined
                :error-messages="errors"
                type="password"
                v-model.trim="password"
                placeholder="Ingrese su contraseña"
                dense
                class="ml-5 mr-5"
                required
              />
              <v-btn type="submit" dark class="primary ml-5 mb-5 mr-5">INGRESAR</v-btn>
            </v-form>
          </v-flex>
        </v-card>
      </v-container>
    </v-col>
  </v-row>
</template>
<script>
import axios from "axios";

export default {
  name: "login",
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
        //API CALL
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
              this.$router.push({ path: "/" + this.$route.params.tenant });
            }
          })
          .catch((err) => { console.log(err);
            this.errors = "Credenciales inválidas"
          });
      }
    },
  },
}
</script>
<style>
  .backgroundclass{
    background-image: url(https://cdn.vuetifyjs.com/images/parallax/material2.jpg);
    background-size: 200%;
    animation: movimiento 20s infinite linear alternate;
  }

  @keyframes movimiento {
    from{
      background-position: bottom left;
    }to{
      background-position: top-right;
    }
  }

  .toolbarclass{
    background-image: url(https://cdn.vuetifyjs.com/images/parallax/material2.jpg);
    background-size: 100%;
    animation: movimiento 20s infinite linear alternate;
  }

  @keyframes movimiento2 {
    from{
      background-position: bottom left;
    }to{
      background-position: top-right;
    }
  }
</style>