<template>
  <div>
    <div id="nav">
      <router-link :to="{name: 'Home'}">Home</router-link>
      <router-link :to="{name: 'Library'}">Biblioteca</router-link>
      <router-link v-show="notLogged" :to="{name: 'Login'}">Login</router-link>
      <router-link v-show="notLogged" :to="{name: 'Register'}">Registro</router-link>
      <router-link v-show="logged" :to="{name: 'AddBook'}">Publicar</router-link>
      <router-link v-if="logged" :to="{name: 'Profile', params: {id: tokenData(this.token)}}">Perfil</router-link>
      <button v-show="logged" @click="logoutUser()">Logout</button>
    </div>
  </div>
</template>

<script>
import { logout, getAuthToken, tokenData } from "../api/utils";
import { isLoggedIn } from "../api/utils";

export default {
  name: "MenuCustom",
  data() {
    return {
      logged: false,
      notLogged: true,
      token: getAuthToken(),
      tokenData
    };
  },
  methods: {
    logoutUser() {
      logout();
      this.$router.push("/login");
      location.reload();
    },
    getLogin() {
      this.logged = isLoggedIn();
      this.notLogged = !isLoggedIn();
    }
  },
  created() {
    this.getLogin();
  }
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
  line-height: 2;
  z-index: 9999;
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
  text-decoration: underline;
}

button {
  border: none;
  border-radius: 50px;
  background-color: #f7ffbd;
  color: #5d3a3a;
  transition: all 0.5s;
  cursor: pointer;
}

button:hover {
  transform: translateY(-4px);
}

@media (min-width: 600px) {
  #nav a {
    font-size: 1.25rem;
  }
  button {
    font-size: 1rem;
  }
}
</style>