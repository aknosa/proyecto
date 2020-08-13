<template>
  <div>
    <h2>Libros:</h2>
    <ul>
      <li v-for="(book, index) in books" :key="book.id">
        <img :src="getImageName(book.image)" @click="toBook(book.id)" />
        <p>
          <b>Título:</b>
          {{book.title}}
        </p>
        <p>
          <b>Autor:</b>
          {{book.author}}
        </p>
        <button v-if="seeProfile" @click="sendBookInfo(index)">Editar</button>
        <button v-if="seeProfile">Borrar</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { getAuthToken, tokenData } from "../api/utils";

export default {
  name: "UserDataBooks",
  data() {
    return {
      seeProfile: false,
      token: getAuthToken()
    };
  },
  props: {
    books: Array
  },
  methods: {
    sendBookInfo(index) {
      let bookInfo = this.books[index];
      this.$emit("bookData", bookInfo);
    },
    getImageName(name) {
      return process.env.VUE_APP_STATIC + name;
    },
    toBook(id) {
      this.$router.push("/book/" + id);
    },
    getAllProfile() {
      let ownId = tokenData(this.token);
      let profileId = this.$route.params.id;
      if (ownId === Number(profileId)) {
        this.seeProfile = true;
      } else {
        this.seeProfile = false;
      }
    }
  },
  created() {
    this.getAllProfile();
  }
};
</script>

<style scoped>
h2 {
  margin-top: 4rem;
  margin-bottom: 1.5rem;
  text-align: center;
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
  padding: 1rem;
  border: 5px solid #905858;
  border-radius: 25px;
}

ul li p {
  padding: 0.5rem;
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
    justify-content: space-around;
    max-width: 1200px;
    margin: 0 auto 8rem auto;
  }
  ul li {
    width: 40%;
    border: none;
    border-radius: 0;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    background-color: #f7ffbd;
  }
  img {
    transition: all 0.5s;
  }
  img:hover {
    transform: scale(1.1, 1.1);
  }
  button {
    background-color: #f7ffbd;
  }
}

@media (min-width: 1000px) {
  ul li {
    width: 30%;
  }
}
</style>