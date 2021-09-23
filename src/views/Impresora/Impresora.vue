<template>
  <v-container fluid>
    <v-card min-width="100%">
       <h1 style="text-align: center;">Configuracion Impresora</h1>
      <v-row align="center">
         <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col
          cols="8"
        >
        <v-select
          :items="items"
          label="Tamaño Papel"
        ></v-select>
          <v-text-field
            v-model="firstname"
            :rules="nameRules"
            :counter="50"
            label="Nombre Impresora"
            required
          ></v-text-field>
        </v-col>
        <v-col
          cols="8"
        >
        </v-col>
        <v-btn>
            Guardar
        </v-btn>
      </v-row>
    </v-container>
  </v-form>
      </v-row>
       <v-row>
          <v-col cols="12">
            <div class="horizontalSeparator"></div>
          </v-col>
        </v-row>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    items: ["80 mm "],
  }),
};
</script>
