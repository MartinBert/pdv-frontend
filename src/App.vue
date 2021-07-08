<template>
  <v-app id="inspire">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component"/>
      </transition>
    </router-view>
  </v-app>
</template>
<style>
@import '/../css/custom-styles.css';

.fade-enter-from,
.fade-leave-to{
  opacity: 0;
}


.fade-enter-active,
.fade-leave-active{
 transition: opacity 0.5s ease-out;
}
</style>
