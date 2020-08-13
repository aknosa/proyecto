<template>
  <div id="register">
    <vue-headful title="Registro | Intercambio de Libros" />
    <h1>Registrar Cuenta</h1>
    <div id="form">
      <p v-show="errorMsg">*Tienes campos vacíos</p>
      <form>
        <label for="name">Nombre y apellido(s):</label>
        <input v-model="name" type="text" name="name" />
        <label for="location">Localidad:</label>
        <input v-model="location" name="location" type="text" />
        <label for="email">Email:</label>
        <input v-model="email" name="email" type="email" />
        <label for="password">Password:</label>
        <input v-model="password" name="password" type="password" />
      </form>
      <div id="button">
        <button @click="validatingData()">Registrarse</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Register",
  data() {
    return {
      name: "",
      location: "",
      email: "",
      password: "",
      errorMsg: false,
      createUser: false
    };
  },
  methods: {
    validatingData() {
      if (
        this.name === "" ||
        this.location === "" ||
        this.email === "" ||
        this.password === ""
      ) {
        this.createUser = false;
        this.errorMsg = true;
      } else {
        this.errorMsg = false;
        this.createUser = true;
        this.addNewUser();
      }
    },
    addNewUser() {
      if (this.createUser === true) {
        var self = this;
        axios
          .post("http://localhost:3000/users", {
            name: self.name,
            location: self.location,
            email: self.email,
            password: self.password
          })
          .then(function(response) {
            console.log(response);
          })
          .catch(function(error) {
            console.log(error);
          });
        this.createUser = false;
        this.name = "";
        this.location = "";
        this.email = "";
        this.password = "";
      }
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

#register {
  margin-top: 5rem;
}

h1 {
  text-align: center;
}

p {
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

#form {
  width: 90%;
  margin: 3rem 0 7rem 0.5rem;
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
  #register {
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
