<template>
  <div id="library">
    <vue-headful title="Biblioteca | Intercambio de Libros" />
    <h1>Biblioteca</h1>
    <bookstable v-on:booksList="getBooks" :books="books" />
    <p v-if="anyResult">No se han encontrado ningún resultado.</p>
  </div>
</template>

<script>
import bookstable from "@/components/BooksTable.vue";
import axios from "axios";

export default {
  name: "Library",
  components: {
    bookstable
  },
  data() {
    return {
      books: [],
      anyResult: false
    };
  },
  methods: {
    getBooks(search) {
      var self = this;

      axios
        .get("http://localhost:3000/books", {
          params: {
            search: search.theSearch,
            field: search.theField
          }
        })
        .then(function(response) {
          self.books = response.data.data;
          self.anyResult = false;

          setTimeout(() => {
            if (response.data.data.length === 0) {
              self.anyResult = true;
            }
          }, 1200);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  created() {
    this.getBooks();
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

#library {
  margin-top: 5rem;
}

h1 {
  margin-bottom: 3rem;
  text-align: center;
}

p {
  text-align: center;
  position: relative;
  animation-name: animation;
  animation-duration: 1s;
}

@media (min-width: 700px) {
  #library {
    margin-top: 8rem;
  }
  p {
    font-size: 1.1rem;
  }
}
</style>
