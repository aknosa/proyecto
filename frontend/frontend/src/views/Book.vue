<template>
  <div id="bookInfo">
    <vue-headful title="Info Libro | Intercambio de Libros" />
    <img :src="getImageName(book.image)" />
    <h2>{{ book.title }}</h2>
    <h3>De: {{ book.author }}</h3>
    <div id="user">
      <ul @click="toUser(book.book_owner_id)">
        <li>
          <b>Propietario del libro:</b>
          {{ book.book_owner_name }}
        </li>
        <li>
          <b>Localidad del Propietario:</b>
          {{ book.book_owner_location }}
        </li>
      </ul>
    </div>
    <div id="information">
      <ul>
        <li>
          <b>Género:</b>
          {{ book.genre }}
        </li>
        <li>
          <b>Sinopsis:</b>
          {{ book.synopsis }}
        </li>
        <li>
          <b>Biografía del autor:</b>
          {{ book.author_biography }}
        </li>
        <li>
          <b>Decripción del libro:</b>
          {{ book.description }}
        </li>
        <li>
          <b>Añadido:</b>
          {{ format(new Date(book.creation_date), "dd/MM/yyyy") }}
        </li>
      </ul>
    </div>
    <div id="button" v-show="otherUser">
      <button @click="exchangeRequest()">Solicitar intercambio</button>
    </div>
  </div>
</template>

<script>
import { format } from "date-fns";
import axios from "axios";
import { isLoggedIn, getAuthToken, tokenData } from "../api/utils";
import { config } from "../api/utils";
import Swal from "sweetalert2";

export default {
  name: "Book",
  props: ["id"],
  data() {
    return {
      book: [],
      otherUser: false,
      token: getAuthToken(),
      format,
      bookOwnerId: ""
    };
  },
  methods: {
    exchangeRequest() {
      Swal.fire({
        title: "¿Quieres mandar una solicitud de intercambio?",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "No",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí"
      }).then(result => {
        if (result.value) {
          Swal.fire(
            "¡Enviada!",
            "Tu solicitud de intercambio ha sido enviada.",
            "success"
          );
          this.sendExchangeRequest();
        }
      });
    },
    sendExchangeRequest() {
      var self = this;

      axios
        .post("http://localhost:3000/books/" + this.id + "/request", "", config)
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getBookById() {
      var self = this;

      axios
        .get("http://localhost:3000/books/" + this.id)
        .then(function(response) {
          self.book = response.data.data;
          self.bookOwnerId = response.data.data.book_owner_id;
          self.isOtherUser();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getImageName(name) {
      return process.env.VUE_APP_STATIC + name;
    },
    isOtherUser() {
      let idUser = tokenData(this.token);
      if (idUser !== this.bookOwnerId && isLoggedIn()) {
        this.otherUser = true;
      } else {
        this.otherUser = false;
      }
    },
    toUser(id) {
      this.$router.push("/user/" + id);
    }
  },
  created() {
    this.getBookById();
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
    transform: scale(0.9, 0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1, 1);
  }
}

#bookInfo {
  margin-top: 5rem;
  margin-bottom: 5rem;
  text-align: center;
  animation-name: animation;
  animation-duration: 1s;
}

#bookInfo img {
  object-fit: cover;
  max-width: 100%;
  margin-top: 2rem;
  margin-bottom: 2rem;
  width: 220px;
  height: 300px;
}

h2 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

#bookInfo #user ul {
  list-style: none;
  text-align: left;
  font-size: 0.9rem;
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0;
  margin-inline-end: 0;
  padding-inline-start: 0;
  margin: 2rem 0.5rem 2rem 0.5rem;
  background-color: #f7ffbd;
  border-radius: 10px;
  cursor: pointer;
}

#bookInfo #user ul li {
  padding: 0.25rem;
}

#bookInfo #information ul {
  text-align: left;
  font-size: 0.9rem;
  margin-right: 0.5rem;
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
  margin-top: 3rem;
  transition: all 1s;
}

button:hover {
  color: #905858;
  border-color: #905858;
}

@media (min-width: 700px) {
  #bookInfo {
    background-color: #f7ffbd;
    width: 600px;
    margin: 10rem auto 0rem auto;
    padding: 1rem;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    margin-bottom: 8rem;
  }
  #bookInfo #user ul {
    margin: 2rem auto 2rem auto;
    text-align: center;
    border: 2px solid #5d3a3a;
    background-color: white;
    width: 70%;
    transition: all 0.5s;
  }
  #bookInfo #user ul:hover {
    transform: scale(1.1, 1.1);
  }
  #bookInfo #user ul li {
    text-align: left;
  }
  #information {
    margin-bottom: 2rem;
  }
  button {
    background-color: #f7ffbd;
  }
  #bookInfo img {
    border-radius: 25px;
  }
}
</style>
