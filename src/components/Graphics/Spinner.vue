<template>
  <v-container class="d-flex justify-center text-center">
    <RotateLoader color="#3f51b5" />
  </v-container>
</template>
<script>
import RotateLoader from "vue-spinner/src/RotateLoader.vue";
export default {
  components: {
    RotateLoader,
  },
};
</script>
