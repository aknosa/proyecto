<template>
  <div id="app">
    <menucustom />
    <router-view />
    <footercustom />
  </div>
</template>

<script>
import menucustom from "@/components/MenuCustom.vue";
import footercustom from "@/components/FooterCustom.vue";

export default {
  name: "App",
  components: {
    footercustom,
    menucustom
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Raleway:wght@300;400;500;600&display=swap");

* {
  margin: 0;
  box-sizing: border-box;
}

input:focus {
  outline: none;
}

button:focus {
  outline: none;
}

#app {
  font-family: "Raleway", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #222222;
  position: relative;
  min-height: 100vh;
  padding-bottom: 2rem;
}
</style>
