<template>
  <div id="validate">
    <vue-headful title="Validación de Usuario | Intercambio de Libros" />
    <h1>Validación de Usuario</h1>
    <p>
      <b>¡Perfecto!</b> Ya estás registrado en Intercambio de Libros. Para hacer login puedes pulsar
      <router-link :to="{name: 'Login'}">aquí</router-link>.
    </p>
    <h3 v-if="showError">*Error: {{errorMsg}}</h3>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ValidateUser",
  data() {
    return {
      showError: false,
      errorMsg: ""
    };
  },
  methods: {
    async validatingUser() {
      let registrationCode = this.$route.params.code;
      try {
        const response = await axios.get(
          "http://localhost:3000/users/validate/" + registrationCode
        );
      } catch (error) {
        this.showError = true;
        console.log(error);
        this.errorMsg = error.response.data.message;
      }
    }
  },
  created() {
    this.validatingUser();
  }
};
</script>

<style scoped>
#validate {
  margin-top: 5rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

p {
  margin-top: 1rem;
  font-size: 0.9rem;
  margin-left: 0.9rem;
  margin-right: 0.9rem;
}

h3 {
  margin-left: 0.9rem;
  margin-right: 0.9rem;
  margin-top: 1rem;
  color: #f0134d;
}

@media (min-width: 700px) {
  #validate {
    margin-top: 8rem;
    text-align: center;
  }
  #validate h1 {
    text-align: left;
    margin-left: 3rem;
    font-size: 3rem;
  }
  #validate p {
    text-align: left;
    margin-left: 3rem;
    font-size: 1.15rem;
  }
  h3 {
    text-align: left;
    margin-left: 3rem;
  }
}
</style>