<template>
<v-container>
  <v-container class="d-flex justify-center align-center">
    <v-btn class="primary">
        <a href="/../../files/Manual.pdf" target="_blank"><p class="btn-file">Manual del sistema</p></a>
    </v-btn>
  </v-container>
  <v-row>
    <v-col>
      asdfasd
    </v-col>
  </v-row>
</v-container>
</template>

<script>

export default {
  mounted() {
    this.tenant = this.$route.params.tenant;
  },
};
</script>
<style>
  .btn-file{
    text-decoration: none;
    color: white;
  }
</style>