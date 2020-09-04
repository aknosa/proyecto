<template>
  <div id="app">
    <menucustom v-on:logout="doingLogout" :is-login="isLogin" :id="id" />
    <router-view v-on:login="doingLogin" />
    <footercustom />
  </div>
</template>

<script>
import menucustom from "@/components/MenuCustom.vue";
import footercustom from "@/components/FooterCustom.vue";
import { isLoggedIn, getAuthToken, tokenData } from "@/api/utils";

export default {
  name: "App",
  components: {
    footercustom,
    menucustom
  },
  data() {
    return {
      isLogin: false,
      id: tokenData(getAuthToken())
    };
  },
  methods: {
    doingLogin() {
      this.isLogin = true;
      let token = getAuthToken();
      let userId = tokenData(token);
      this.id = userId;
    },
    doingLogout() {
      this.isLogin = false;
    },
    getLogin() {
      this.isLogin = isLoggedIn();
    }
  },
  created() {
    this.getLogin();
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

button {
  cursor: pointer;
}
</style>
