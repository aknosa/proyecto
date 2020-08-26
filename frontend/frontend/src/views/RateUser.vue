<template>
  <div id="rating">
    <vue-headful title="Valoración de Usuario | Intercambio de Libros" />
    <h1>Valoración de usuario</h1>
    <p>
      ¿Cómo valorarías el intercambio de libros con
      <b>{{ user.name }}</b>?
    </p>
    <div id="stars">
      <star-rating
        v-model="rating"
        :rating="user.userRating"
        active-color="#96bb7c"
        @rating-selected="setRating"
      ></star-rating>
    </div>
  </div>
</template>

<script>
import { config } from "../api/utils";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "RateUser",
  data() {
    return {
      user: {},
      rating: 0
    };
  },
  methods: {
    getUserById() {
      var self = this;

      axios
        .get(
          "http://localhost:3000/users/" + this.$route.params.user_id,
          config
        )
        .then(function(response) {
          self.user = response.data.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    setRating() {
      axios
        .post(
          "http://localhost:3000/request/" +
            this.$route.params.exchange_id +
            "/votes",
          { userRating: this.rating },
          config
        )
        .then(response => {
          Swal.fire(
            "¡Valorado!",
            `Has puntuado a ${this.user.name} con un ${this.rating}/5.`,
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
    top: -60px;
  }
  100% {
    opacity: 1;
    top: 0px;
  }
}

#rating {
  margin-top: 5rem;
}

h1 {
  text-align: center;
  margin-bottom: 5rem;
}

p {
  text-align: center;
  margin: 0 0.6rem;
}

#stars {
  margin: 2rem auto;
  width: 270px;
}

p,
#stars {
  position: relative;
  animation-name: animation;
  animation-duration: 1s;
}

@media (min-width: 700px) {
  #rating {
    margin-top: 8rem;
  }
  p {
    font-size: 1.3rem;
  }
}
</style>
