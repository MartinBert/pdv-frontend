<template>
  <v-app id="inspire">
    <router-view></router-view>
  </v-app>
</template>
<script>
export default {
  name: "App"
};
</script>
<style>
@import '/../css/custom-styles.css';


@font-face {
  font-family: "Login";
  src: local("login"), url('/../fonts/login.otf') format("truetype");
}
</style>
