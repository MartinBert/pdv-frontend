<template>
  <v-container>
    <v-snackbar
      v-model="errorStatus"
      :color="'#E53935'"
      :timeout="3000"
      :top="true"
      >Ocurrió un error</v-snackbar
    >
  </v-container>
</template>
<script>
export default {
  name: "Error",
  props: {
    errorStatus: Boolean,
  },
};
</script>
