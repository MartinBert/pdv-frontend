<template>
  <v-dialog v-model="$store.state.eventual.eventualDialog">
    <v-card>
      <v-card-title class="d-flex justify-center">
        <span>Generar reportes de ventas</span>
      </v-card-title>
      <v-card-text>
        <v-btn class="primary" raised>Todas las ventas</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "VentasReportsDialog",
};
</script>
