<template>
  <div id="login">
    <vue-headful title="Login | Intercambio de Libros" />
    <h1>Iniciar Sesión</h1>
    <div id="form">
      <form>
        <label for="email">Email:</label>
        <input v-model="email" name="email" type="email" />
        <label for="password">Password:</label>
        <input v-model="password" name="password" type="password" />
      </form>
      <div id="button">
        <button @click="loginUser()">Login</button>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from "../api/utils";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    loginUser() {
      if (this.email === "" || this.password === "") {
        alert("Te faltan datos.");
      } else {
        login(this.email, this.password);
        setTimeout(() => {
          this.$router.push("/library");
          location.reload();
        }, 1000);
      }
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

#login {
  margin-top: 5rem;
}

h1 {
  text-align: center;
}

#form {
  width: 90%;
  margin: 3rem 0 3rem 0.5rem;
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
