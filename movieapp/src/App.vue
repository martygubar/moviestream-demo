<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>

  <router-view v-slot="{ Component, route }">
  <!-- Use any custom transition and fallback to `fade` -->
  
    <component :is="Component" />
  
</router-view>
</template>

<style>
@import '@/assets/base.css';
html {
  scroll-behavior: smooth;
}
#app { 
  margin: 0 auto;
  font-weight: normal;
  height:100%; 
  font-family: "Roboto";
}
@font-face {
    font-family: 'Roboto';
    src: url('@/assets/fonts/roboto-regular-webfont.woff2') format('woff2'),
         url('@/assets/fonts/roboto-regular-webfont.woff') format('woff');
    font-weight: normal;
    font-style: normal;

}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.75s ease-out;
}


.slide-enter-to {
  position: absolute;
  top: 0;
}


.slide-enter-from {
  position: absolute;
  top: -100%;
}


.slide-leave-to {
  position: absolute;
  bottom: -100%;
}


.slide-leave-from {
  position: absolute;
  bottom: 0;
}
</style>
