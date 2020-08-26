<template>
  <div>
    <div id="books">
      <h3>Libros de {{user.name}}:</h3>
      <ul>
        <li v-for="(book, index) in books" :key="book.id">
          <figure>
            <img :src="getImageName(book.image)" />
          </figure>
          <p>
            <b>Título:</b>
            {{book.title}}
          </p>
          <p>
            <b>Autor:</b>
            {{book.author}}
          </p>
          <p>
            <b>Género:</b>
            {{book.genre}}
          </p>
          <p>
            <b>Sinopsis:</b>
            {{ book.synopsis }}
          </p>
          <p>
            <b>Biografía del autor:</b>
            {{ book.author_biography }}
          </p>
          <p>
            <b>Decripción del libro:</b>
            {{ book.description }}
          </p>
          <div id="button">
            <button @click="sendBookId(index)">Intercambiar</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExchangeBooks",
  props: {
    user: Object,
    books: Array
  },
  methods: {
    // Función para conseguir que se vea la imagen del libro
    getImageName(name) {
      return process.env.VUE_APP_STATIC + name;
    },
    sendBookId(index) {
      let bookId = this.books[index].id;
      this.$emit("bookData", bookId);
    }
  }
};
</script>

<style scoped>
#books h3 {
  text-align: center;
  margin-bottom: 2rem;
}

ul {
  text-align: center;
  list-style: none;
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0;
  margin-inline-end: 0;
  padding-inline-start: 0;
}

ul li {
  margin: 1rem;
  padding: 1rem 0.25rem 1rem 0.25rem;
  border: 5px solid #905858;
  border-radius: 25px;
}

ul li p {
  text-align: left;
  font-size: 0.9rem;
  margin-left: 0.4rem;
  padding-top: 0.25rem;
}

ul li img {
  object-fit: cover;
  max-width: 100%;
  margin-top: 2rem;
  margin-bottom: 2rem;
  width: 150px;
  height: 204px;
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

@media (min-width: 700px) {
  ul {
    display: flex;
    flex-wrap: wrap;
  }
  ul li {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: none;
    border-radius: 0;
    width: 42%;
    background-color: #f7ffbd;
    margin: 2rem auto 2rem auto;
    padding: 1rem;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  button {
    background-color: #f7ffbd;
  }
}

@media (min-width: 1000px) {
  ul {
    max-width: 1400px;
    margin: auto;
  }
  ul li {
    width: 30%;
  }
}

@media (min-width: 1300px) {
  ul li {
    width: 27%;
  }
}
</style>