<template>
    <v-container>
        <v-snackbar v-model="errorStatus" :color="'#E53935'" :timeout="3000" :top="true">{{errorMessage}}</v-snackbar>
    </v-container>
</template>
<script>
export default {
  name: "Error",
  props: {
    errorMessage: String,
    errorStatus: Boolean
  },
};
</script>
