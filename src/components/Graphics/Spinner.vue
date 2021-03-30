<template>
  <v-container class="d-flex justify-center text-center" style="margin-top:10%">
    <BounceLoader color="#3f51b5"/>
  </v-container>
</template>
<script>
import BounceLoader from "vue-spinner/src/BounceLoader.vue";
export default {
  components: {
    BounceLoader,
  },
};
</script>
