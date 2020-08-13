<template>
  <div id="library">
    <vue-headful title="Biblioteca | Intercambio de Libros" />
    <h1>Biblioteca</h1>
    <bookstable v-on:booksList="getBooks" :books="books" />
  </div>
</template>

<script>
import bookstable from "@/components/BooksTable.vue";
import axios from "axios";

export default {
  name: "Library",
  components: {
    bookstable,
  },
  data() {
    return {
      books: [],
    };
  },
  methods: {
    getBooks(search) {
      var self = this;

      axios
        .get("http://localhost:3000/books", {
          params: {
            search: search,
          },
        })
        .then(function(response) {
          self.books = response.data.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
  },
  created() {
    this.getBooks();
  },
};
</script>

<style scoped>
#library {
  margin-top: 5rem;
}

h1 {
  margin-bottom: 3rem;
  text-align: center;
}

@media (min-width: 700px) {
  #library {
    margin-top: 8rem;
  }
}
</style>
