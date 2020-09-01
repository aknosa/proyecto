<template>
  <div>
    <div id="nav">
      <router-link :to="{name: 'Home'}">
        <figure>
          <img src="../assets/casa.png" />
        </figure>
      </router-link>
      <router-link :to="{name: 'Library'}">Biblioteca</router-link>
      <router-link v-show="!isLogin" :to="{name: 'Login'}">Login</router-link>
      <router-link v-show="!isLogin" :to="{name: 'Register'}">Registro</router-link>
      <router-link v-show="isLogin" :to="{name: 'AddBook'}">Publicar</router-link>
      <router-link v-if="isLogin" :to="{name: 'Profile', params: {id:tokenData(this.token)}}">Perfil</router-link>
      <button v-show="isLogin" @click="logoutUser()">
        <figure>
          <img src="../assets/entrar.png" />
        </figure>
      </button>
    </div>
  </div>
</template>

<script>
import { logout, getAuthToken, tokenData } from "../api/utils";
import { isLoggedIn } from "../api/utils";

export default {
  name: "MenuCustom",
  props: {
    isLogin: Boolean
  },
  data() {
    return {
      //logged: this.isLogin,
      //notLogged: true,
      token: getAuthToken(),
      tokenData
    };
  },
  methods: {
    logoutUser() {
      logout();
      this.$router.push("/login");
      this.$emit("logout");
      //location.reload();
    }
    // getLogin() {
    //   this.logged = this.isLogin;
    //   this.notLogged = !isLoggedIn();
    // }
  }
  // created() {
  //   this.getLogin();
  // }
};
</script>

<style scoped>
#nav {
  padding: 15px;
  background-color: #96bb7c;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-content: center;
  z-index: 9999;
}

a:not(:first-child),
a:not(:last-child) {
  line-height: 2;
}

#nav a {
  font-weight: bold;
  display: block;
  color: #f7ffbd;
  text-decoration: none;
  font-size: 0.8rem;
}

#nav a:hover {
  color: #905858;
  transition: color 0.5s;
}

#nav a.router-link-exact-active {
  color: #5d3a3a;
}

/* #nav a.router-link-exact-active figure {
  border-bottom: 3px solid #5d3a3a;
} */

#nav figure img {
  width: 15px;
  position: relative;
  top: 2px;
}

#nav figure {
  transition: all 0.25s;
}

#nav figure:hover {
  transform: translateY(-4px);
}

button {
  border: none;
  background-color: transparent;
  transition: all 0.25s;
  cursor: pointer;
}

@media (min-width: 600px) {
  #nav {
    height: 60px;
  }
  #nav a {
    font-size: 1.25rem;
  }
  #nav figure img {
    width: 25px;
    position: relative;
    top: 4px;
  }
}

@media (min-width: 1000px) {
  /* #nav figure img {
    width: 25px;
  } */
}
</style>