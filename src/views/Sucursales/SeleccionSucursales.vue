<template>
  <v-card min-width="100%">
      <v-card-title>
          <div class="text-center" style="width:100%">
              Seleccione su sucursal de operación
          </div>
      </v-card-title>
      <v-card-text>
          <form @submit.prevent="changeLoguedUserData()">
              <v-autocomplete
                :items="loguedUser.empresa.sucursales"
                v-model="loguedUser.sucursal"
                :return-object="true"
                item-text="razonSocial"
                label="Seleccione una sucursal de operación"
                @change="handleChange()"
                required
              />
              <v-autocomplete
                :items="puntosVenta"
                v-model="loguedUser.puntoVenta"
                :return-object="true"
                item-text="nombre"
                label="Seleccione un punto de venta de operación"
                required
              />
              <v-btn type="submit" class="primary">
                  GUARDAR
              </v-btn>
          </form>
      </v-card-text>
  </v-card>
</template>
<script>
import { successAlert } from '../../helpers/alerts';

export default {
  data: () => ({
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    loaded: false,
    puntosVenta: [],
  }),

  methods: {
    handleChange(){
        this.puntosVenta = this.loguedUser.sucursal.puntosVenta;
    },

    changeLoguedUserData(){
        localStorage.setItem("userData", JSON.stringify(this.loguedUser));
        successAlert("Cambios aplicados");
    }
  }
};
</script>