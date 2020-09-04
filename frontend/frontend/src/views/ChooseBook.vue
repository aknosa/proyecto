<template>
  <div id="exchange">
    <vue-headful title="Intercambio | Intercambio de Libros" />
    <h1>Escoge un Libro de su Biblioteca</h1>
    <div id="cancel">
      <!-- <h4>O puedes rechazar la solicitud aquí:</h4> -->
      <button @click="sendRejection()">Rechazar Intercambio</button>
    </div>
    <exchangebooks :user="user" :books="books" v-on:bookData="showBookModal" />
    <!-- MODAL PARA CONFIRMAR INTERCAMBIO -->
    <div v-show="seeConfirmationModal" class="modal">
      <div class="modalBox">
        <h3>Especifica lugar, fecha y hora del intercambio</h3>
        <p v-show="errorMsg">*Faltan datos</p>
        <form>
          <label for="place">Lugar:</label>
          <input v-model="place" name="place" type="text" />
          <label for="date">Fecha y hora:</label>
          <input v-model="date" name="date" type="datetime-local" />
        </form>
        <div class="options">
          <button @click="seeConfirmationModal =! seeConfirmationModal">Cancelar</button>
          <button @click="validatingData()">Enviar</button>
        </div>
      </div>
    </div>
    <!-- MODAL PARA CONFIRMAR INTERCAMBIO -->
  </div>
</template>

<script>
import exchangebooks from "@/components/ExchangeBooks.vue";
import axios from "axios";
import { config, getAuthToken } from "../api/utils";
import Swal from "sweetalert2";

export default {
  name: "ChooseBook",
  components: {
    exchangebooks
  },
  data() {
    return {
      user: {},
      books: [],
      date: "",
      place: "",
      offeredBookId: "",
      seeConfirmationModal: false,
      errorMsg: false
    };
  },
  methods: {
    /* Con esta función consigo información de cada uno de los libros del usuario para 
     que elija uno a intercambiar */
    getUserById() {
      axios
        .get("http://localhost:3000/users/" + this.$route.params.user_id, {
          headers: { Authorization: getAuthToken() }
        })
        .then(response => {
          this.user = response.data.data;
          this.books = response.data.data.books;
        })
        .catch(error => {
          console.log(error);
        });
    },
    // Función que muestra el modal de confirmación
    showBookModal(bookId) {
      this.offeredBookId = bookId;
      this.seeConfirmationModal = true;
    },
    // Función que comprueba que ninguno de los parametros estén vacíos
    validatingData() {
      if (this.place === "" || this.date === "") {
        this.errorMsg = true;
      } else {
        this.sendConfirmation();
      }
    },
    // Función que activa el sweetalert2 para preguntar si desea continuar con el intercambio
    sendConfirmation() {
      Swal.fire({
        title: "¿Deseas confirmar el intercambio?",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "No",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí"
      }).then(result => {
        if (result.value) {
          this.confirmationRequest();
        }
      });
    },
    // Petición para confirmar el intercambio
    confirmationRequest() {
      axios
        .post(
          "http://localhost:3000/request/" +
            this.$route.params.exchange_id +
            "/confirm",
          {
            offeredBookId: this.offeredBookId,
            place: this.place,
            date: this.date
          },
          {
            headers: { Authorization: getAuthToken() }
          }
        )
        .then(response => {
          Swal.fire(
            "¡Intercambio confimado!",
            "El lugar, la fecha y la hora del intercambio han sido enviados al otro propietario.",
            "success"
          );
          this.seeConfirmationModal = false;
        })
        .catch(error => {
          Swal.fire({
            icon: "error",
            text: error.response.data.message,
            showConfirmButton: false,
            timer: 4000
          });
        });
    },
    sendRejection() {
      Swal.fire({
        title: "¿Deseas rechazar el intercambio?",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "No",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí"
      }).then(result => {
        if (result.value) {
          this.rejectionRequest();
        }
      });
    },
    rejectionRequest() {
      axios
        .post(
          "http://localhost:3000/request/" +
            this.$route.params.exchange_id +
            "/reject",
          "",
          {
            headers: { Authorization: getAuthToken() }
          }
        )
        .then(response => {
          Swal.fire(
            "El intercambio ha sido rechazado",
            "Has rechazado la solicitud de intercambio.",
            "success"
          );
        })
        .catch(error => {
          Swal.fire({
            icon: "error",
            text: error.response.data.message,
            showConfirmButton: false,
            timer: 4000
          });
        });
    }
  },
  created() {
    this.getUserById();
  }
};
</script>

<style scoped>
@keyframes animation {
  0% {
    opacity: 0;
    transform: scale(0.9, 0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1, 1);
  }
}

@keyframes animation2 {
  0% {
    opacity: 0;
    top: -60px;
  }
  100% {
    opacity: 1;
    top: 0px;
  }
}

#exchange {
  margin-top: 5rem;
  margin-bottom: 3rem;
}

h1 {
  text-align: center;
  margin-bottom: 5rem;
}

button {
  display: inline-block;
  padding: 0.5em 1em;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
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

#cancel {
  text-align: center;
  margin-bottom: 4rem;
}

#cancel button {
  border: 0.16em solid #f0134d;
  color: #f0134d;
  margin-top: 1rem;
  font-size: 1.1rem;
  position: relative;
  animation-name: animation2;
  animation-duration: 1s;
}

#cancel button:hover {
  color: #ff6f5e;
  border-color: #ff6f5e;
}

.modal {
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
}
.modalBox {
  background-color: white;
  border-radius: 25px;
  margin: 30% auto;
  padding: 1.5rem;
  width: 80%;
  border: 1px solid #888;
  animation-name: animation;
  animation-duration: 1s;
}

.modal .modalBox h3 {
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.modal p {
  text-align: center;
  color: #f0134d;
}

.modal .modalBox form {
  text-align: left;
}

label {
  font-size: 0.8rem;
}

.modal .modalBox input {
  border: none;
  border-bottom: 5px solid #96bb7c;
  width: 95%;
  transition: all 0.5s;
  margin-bottom: 0.3rem;
}

.modal .modalBox input:focus {
  border-bottom: 5px solid #905858;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  transition: background-color 5000s ease-in-out 0s;
}

.options button {
  padding: 0.25em 1em;
  margin: 0 0.3rem;
  font-size: 0.7rem;
  text-align: center;
  transition: all 0.15s;
  margin-top: 2rem;
}

@media (min-width: 700px) {
  #exchange {
    margin-top: 8rem;
  }
  .modalBox {
    margin: 20% auto;
    width: 60%;
  }
}

@media (min-width: 1000px) {
  .modalBox {
    width: 50%;
  }
  .modal .modalBox h3 {
    font-size: 1.3rem;
  }
  .options button {
    font-size: 1rem;
  }
}

@media (min-width: 1300px) {
  .modalBox {
    width: 35%;
  }
}
</style>