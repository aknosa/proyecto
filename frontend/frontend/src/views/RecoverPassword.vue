<template>
  <div id="recover">
    <vue-headful title="Recuperación de Contraseña | Intercambio de Libros" />
    <h1>Recuperación de Contraseña</h1>
    <div class="form" v-if="sendEmailForm===1">
      <form>
        <label for="email">Email de tu cuenta:</label>
        <input v-model="email" name="email" type="email" />
      </form>
      <div class="button">
        <button @click="sendPasswordRecoveryRequest()">Enviar</button>
      </div>
    </div>
    <div class="form" v-else-if="sendEmailForm===2">
      <form>
        <label for="recoverCode">Código de recuperación:</label>
        <input v-model="recoverCode" name="recoverCode" type="text" />
        <label for="newPassword">Nueva contraseña:</label>
        <input v-model="newPassword" name="newPassword" type="password" />
        <label for="newPasswordRepeated">Vuelve a escribir tu nueva contraseña:</label>
        <input v-model="newPasswordRepeated" name="newPasswordRepeated" type="password" />
      </form>
      <div class="button">
        <button @click="resetPasswordRequest()">Actualizar</button>
      </div>
    </div>
    <spinnercustom v-else></spinnercustom>
  </div>
</template>

<script>
import spinnercustom from "@/components/SpinnerCustom";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "RecoverPassword",
  data() {
    return {
      email: "",
      newPassword: "",
      newPasswordRepeated: "",
      recoverCode: "",
      sendEmailForm: 1
    };
  },
  components: {
    spinnercustom
  },
  methods: {
    resetPasswordRequest() {
      if (this.newPassword === this.newPasswordRepeated) {
        axios
          .post("http://localhost:3000/users/reset-password", {
            recoverCode: this.recoverCode,
            newPassword: this.newPassword
          })
          .then(response => {
            this.sendEmailForm = "";

            setTimeout(() => {
              Swal.fire(
                "¡Actualizada!",
                "Has cambiado tu contraseña.",
                "success"
              );
              this.recoverCode = "";
              this.newPassword = "";
              this.newPasswordRepeated = "";
              this.sendEmailForm = 1;
              this.$router.push("/login");
            }, 1000);
          })
          .catch(error => {
            this.sendEmailForm = "";

            setTimeout(() => {
              this.sendEmailForm = 2;
              Swal.fire({
                icon: "error",
                text: error.response.data.message,
                showConfirmButton: false,
                timer: 4000
              });
            }, 1000);
          });
      } else {
        this.sendEmailForm = "";

        setTimeout(() => {
          this.sendEmailForm = 2;
          Swal.fire({
            icon: "error",
            text: "Debe escribir dos veces tu nueva contraseña y que coincidan",
            showConfirmButton: false,
            timer: 2500
          });
        }, 1000);
      }
    },
    sendPasswordRecoveryRequest() {
      axios
        .post("http://localhost:3000/users/recover-password", {
          email: this.email
        })
        .then(response => {
          this.sendEmailForm = "";

          setTimeout(() => {
            Swal.fire(
              "Petición enviada",
              "Se envió un email a la cuenta asociada con instrucciones."
            );
            this.sendEmailForm = 2;
          }, 1000);
        })
        .catch(error => {
          this.sendEmailForm = "";

          setTimeout(() => {
            Swal.fire({
              icon: "error",
              text: error.response.data.message,
              showConfirmButton: false,
              timer: 4000
            });
            this.sendEmailForm = 1;
          }, 1000);
        });
    }
  }
};
</script>

<style scoped>
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

#recover {
  margin-top: 5rem;
}

h1 {
  text-align: center;
  margin-bottom: 6rem;
}

.form {
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

.button {
  text-align: right;
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
  #recover {
    margin-top: 8rem;
  }
  .form {
    margin: 5rem auto;
    width: 50%;
  }
  input {
    font-size: 1.25rem;
  }
}

@media (min-width: 1000px) {
  .form {
    width: 30%;
  }
  input {
    font-size: 1.25rem;
  }
}
</style>