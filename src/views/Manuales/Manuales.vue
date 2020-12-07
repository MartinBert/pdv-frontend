<template>
  <v-container>
    <v-container>
      <v-row>
        <v-col class="text-center" cols="12"><h2>Sección de manuales y contacto</h2></v-col>
        <v-col class="text-center" cols="12">
          <h4>En esta sección encontrará documentación útil para el buen uso del sistema y temas relacionados. También podrá contactarse con nosotros a través del formulario "Contacto" para hacernos saber sus dudas.</h4>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col cols="12" class="d-flex justify-center">
          <a href="/../../files/Manual.pdf" target="_blank">
            <v-btn class="primary">MANUAL DEL SISTEMA</v-btn>
          </a>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="d-flex justify-center">
      <form @submit.prevent="onSubmit()" class="contact-form">
        <span class="text-center"><h3>Contacto</h3></span>
        <v-text-field
          class="mt-5"
          outlined
          type="text"
          label="Nombre y apellido"
          placeholder=" "
          required
          v-model="object.nameAndLastName"
        ></v-text-field>
        <v-text-field
        outlined
          type="text"
          label="Email o número al que responderemos"
          placeholder=" "
          required
          v-model="object.contactPhoneOrEmail"
        ></v-text-field>
        <v-textarea
        outlined
          type="text"
          label="Mensaje"
          placeholder=" "
          counter
          rows="3"
          v-model="object.message"
          required
        ></v-textarea>
        <div class="d-flex justify-end">
          <v-btn class="primary" type="submit">
            ENVIAR
          </v-btn>
        </div>
      </form>
    </v-container>
    <v-container class="d-flex">
      <v-row>
        <v-col cols="12" class="text-center">
          <h4>¡Sígenos en nuestras redes para más información!</h4>
        </v-col>
        <v-col cols="12" class="d-flex justify-center">
          <a href="https://www.facebook.com/prysoftarg" target="_blank">
            <img src="/../../images/icons/facebook.svg" width="40" height="40" class="mr-5"/>
          </a>
          <a href="https://api.whatsapp.com/send?phone=5493482273235" class="btn btn-secondary btn-md" target="_blank">
            <img src="/../../images/icons/whatsapp.svg" width="40" height="40" class="mr-5"/>
          </a>
          <a href="https://www.instagram.com/prysoft/?hl=es-la" target="_blank">
            <img src="/../../images/icons/instagram.svg" width="40" height="40" />
          </a>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>
<script>
import GenericService from '../../services/GenericService';
import { successAlert2 } from '../../helpers/alerts';
import { getCurrentDate, formatDate } from '../../helpers/dateHelper';

export default {
  mounted() {
    this.tenant = this.$route.params.tenant;
  },

  data(){
    return {
      service: "mensajes",
      token: localStorage.getItem('token'),
      object: {
        nameAndLastName: '',
        contactPhoneOrEmail: '',
        message: '',
      }
    }
  },

  methods:{
    onSubmit(){
      this.object.date = formatDate(getCurrentDate());
      GenericService(this.tenant, this.service, this.token)
      .save(this.object)
      .then(()=>{
        successAlert2("Mensaje enviado", "Responderemos a la brevedad");
        this.object = {}
      })
    }
  }
};
</script>
<style>
.contact-form{
  border: solid 1px grey;
  border-radius: 15px;
  width: 700px;
  padding: 35px;
}
</style>