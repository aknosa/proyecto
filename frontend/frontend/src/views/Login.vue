<template>
  <div id="login">
    <vue-headful title="Login | Intercambio de Libros" />
    <h1>Iniciar Sesión</h1>
    <spinnercustom v-show="isLoading"></spinnercustom>
    <div id="form" v-show="!isLoading">
      <p v-show="errorMsg">*{{message}}</p>
      <form>
        <label for="email">Email:</label>
        <input v-model="email" name="email" type="email" />
        <label for="password">Password:</label>
        <input v-model="password" name="password" type="password" />
      </form>
      <div id="button">
        <button @click="loginUser()">Login</button>
      </div>
      <p>
        Si has olvidado tu contraseña, pulsa
        <router-link :to="{name: 'RecoverPassword'}">aquí</router-link>.
      </p>
    </div>
  </div>
</template>

<script>
import { login } from "../api/utils";
import Swal from "sweetalert2";
import spinnercustom from "../components/SpinnerCustom";

export default {
  name: "Login",
  components: {
    spinnercustom
  },
  data() {
    return {
      email: "",
      password: "",
      errorMsg: false,
      message: "",
      isLoading: false
    };
  },
  methods: {
    async loginUser() {
      if (this.email === "" || this.password === "") {
        this.errorMsg = true;
        this.message = "Falta poner el email y/o la contraseña";
      } else {
        try {
          await login(this.email, this.password);
          this.isLoading = true;
          this.$emit("login");
          setTimeout(() => {
            this.$router.push("/");
          }, 1000);
        } catch (error) {
          setTimeout(() => {
            this.errorMsg = true;
            this.message = error.response.data.message;
            this.isLoading = false;
          }, 1000);
          this.isLoading = true;
        }
      }
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

@keyframes animation {
  0% {
    opacity: 0;
    top: -60px;
  }
  100% {
    opacity: 1;
    top: 0px;
  }
}

#login {
  margin-top: 5rem;
}

p:first-child {
  text-align: center;
  color: #f0134d;
  margin-bottom: 2rem;
}

h1 {
  text-align: center;
}

#form {
  width: 90%;
  margin: 3rem 0 6rem 0.5rem;
  position: relative;
  animation-name: animation;
  animation-duration: 1s;
}

form {
  display: flex;
  flex-direction: column;
  width: 100%;
}

#button {
  text-align: right;
}

input {
  border: none;
  border-bottom: 5px solid #96bb7c;
  margin-top: 1rem;
  margin-bottom: 2rem;
  font-weight: 300;
  transition: all 0.5s;
}

input:focus {
  border-bottom: 5px solid #905858;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  transition: background-color 5000s ease-in-out 0s;
}

button {
  display: inline-block;
  padding: 0.5em 3em;
  border: 0.16em solid #96bb7c;
  box-sizing: content-box;
  text-decoration: none;
  text-transform: uppercase;
  font-weight: 400;
  color: #96bb7c;
  text-align: center;
  transition: all 0.15s;
  background-color: white;
  font-weight: 600;
  margin-top: 2rem;
  transition: all 1s;
}

button:hover {
  color: #905858;
  border-color: #905858;
}

p {
  margin-top: 3rem;
  text-align: right;
}

@media (min-width: 700px) {
  #login {
    margin-top: 8rem;
  }
  #form {
    margin: 5rem auto;
    width: 50%;
  }
  input {
    font-size: 1.25rem;
  }
  p {
    font-size: 1.2rem;
  }
}

@media (min-width: 1000px) {
  #form {
    width: 30%;
  }
  input {
    font-size: 1.25rem;
  }
}
</style>
