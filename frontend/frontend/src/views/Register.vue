<template>
  <div id="register">
    <vue-headful title="Registro | Intercambio de Libros" />
    <h1>Registrar Cuenta</h1>
    <div id="form">
      <p v-show="showErrorMsg">*{{errorMsg}}</p>
      <form>
        <label for="name">Nombre y apellido(s):</label>
        <input v-model="name" type="text" name="name" />
        <label for="location">Localidad:</label>
        <input v-model="location" name="location" type="text" />
        <label for="email">Email:</label>
        <input v-model="email" name="email" type="email" />
        <label for="password">Contraseña:</label>
        <input v-model="password" name="password" type="password" />
        <label for="passwordRepeated">Confirma tu contraseña:</label>
        <input v-model="passwordRepeated" name="passwordRepeated" type="password" />
      </form>
      <div id="button">
        <button @click="addNewUser()">Registrarse</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "Register",
  data() {
    return {
      name: "",
      location: "",
      email: "",
      password: "",
      passwordRepeated: "",
      showErrorMsg: false,
      errorMsg: ""
      //createUser: false
    };
  },
  methods: {
    // validatingData() {
    //   if (
    //     this.name === "" ||
    //     this.location === "" ||
    //     this.email === "" ||
    //     this.password === ""
    //   ) {
    //     this.createUser = false;
    //     this.showErrorMsg = true;
    //   } else {
    //     this.showErrorMsg = false;
    //     this.createUser = true;
    //     this.addNewUser();
    //   }
    // },
    addNewUser() {
      if (this.password === this.passwordRepeated) {
        axios
          .post("http://localhost:3000/users", {
            name: this.name,
            location: this.location,
            email: this.email,
            password: this.password
          })
          .then(response => {
            Swal.fire(
              "¡Usuario creado!",
              "Recibirás un email que te dará instrucciones para verificar tu cuenta.",
              "success"
            );
            showErrorMsg = false;
          })
          .catch(error => {
            this.showErrorMsg = true;
            this.errorMsg = error.response.data.message;
          });
        this.name = "";
        this.location = "";
        this.email = "";
        this.password = "";
      } else {
        this.showErrorMsg = true;
        this.errorMsg =
          "Tienes que escribir dos veces tu contraseña y que coincidan";
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
  color: #f0134d;
}

#form {
  width: 90%;
  margin: 3rem 0 7rem 0.5rem;
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
