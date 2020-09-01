<template>
  <div>
    <h2>Libros:</h2>
    <div id="books">
      <ul>
        <li v-for="(book, index) in showedBook" :key="book.id">
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
          <button v-if="seeProfile" @click="sendDeleteInfo(index)">Borrar</button>
        </li>
      </ul>
    </div>
    <!-- PAGINACIÓN -->
    <div v-if="books.length!==0">
      <nav id="pages">
        <ul>
          <li class="otherButton">
            <button @click="previousPage" :class="{ disable: currentPage===0 }">&laquo;</button>
          </li>

          <li v-for="page in pages" :key="page" id="buttonNumber">
            <button :class="{ active: currentPage===page }" @click="goToPage(page)">{{ page + 1 }}</button>
          </li>

          <li class="otherButton">
            <button
              @click="nextPage"
              :class="{ disable: currentPage === Math.ceil(books.length/elementsPerPage) -1}"
            >&raquo;</button>
          </li>
        </ul>
      </nav>
    </div>
    <!-- PAGINACIÓN -->
  </div>
</template>

<script>
import { getAuthToken, tokenData } from "../api/utils";

export default {
  name: "UserDataBooks",
  data() {
    return {
      seeProfile: false,
      token: getAuthToken(),
      currentIndex: 0,
      elementsPerPage: 6,
      currentPage: 0
    };
  },
  props: {
    books: Array
  },
  computed: {
    showedBook() {
      let slice = this.books;

      return slice.slice(
        this.currentIndex,
        this.currentIndex + this.elementsPerPage
      );
    },
    pages() {
      let numberOfPages = Math.ceil(this.books.length / this.elementsPerPage);
      let pageArray = [];
      for (let i = 0; i < numberOfPages; i++) {
        pageArray.push(i);
      }
      if (pageArray.length === 0) {
        this.showPages = false;
      } else {
        this.showPages = true;
      }
      return pageArray;
    }
  },
  methods: {
    previousPage() {
      this.currentPage = this.currentPage - 1;
      this.currentIndex = this.currentIndex - this.elementsPerPage;
    },
    nextPage() {
      this.currentPage = this.currentPage + 1;
      this.currentIndex = this.currentIndex + this.elementsPerPage;
    },
    goToPage(page) {
      this.currentPage = page;
      this.currentIndex = page * this.elementsPerPage;
    },
    //Función que emite el evento para borrar libro
    sendDeleteInfo(index) {
      let deleteInfo = this.books[index];
      this.$emit("deleteData", deleteInfo);
    },
    //Función que emite el evento para editar libro
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

#pages {
  margin-bottom: 4rem;
  text-align: center;
}

#pages ul {
  padding: 0;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  list-style: none;
}

#pages ul li {
  border: none;
  border-radius: 0;
  margin: 0.5rem 0.25rem;
  height: 2rem;
  width: 2rem;
  animation: none;
}

#buttonNumber button {
  border: none;
  border-radius: 0;
  background-color: white;
  color: #222222;
  padding: 8px;
  border: 1px solid #ddd;
  height: 2rem;
  width: 2rem;
}

#buttonNumber button:hover:not(.active) {
  background-color: #ddd;
}

.otherButton button:hover {
  background-color: white;
  border: none;
  color: #5d3a3a;
  font-size: 1.2rem;
}

.otherButton button {
  background-color: white;
  border: none;
  color: #5d3a3a;
  font-size: 1.2rem;
}

#buttonNumber .active {
  background-color: #96bb7c;
}

.otherButton .disable {
  pointer-events: none;
  color: #ddd;
}

h2 {
  margin-top: 4rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

#books ul {
  text-align: center;
  list-style: none;
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0;
  margin-inline-end: 0;
  padding-inline-start: 0;
}

#books ul li {
  margin: 1rem;
  padding: 1rem;
  border: 5px solid #905858;
  border-radius: 25px;
  animation-name: animation;
  animation-duration: 1s;
}

#books ul li p {
  padding: 0.5rem;
}

#books ul li img {
  object-fit: cover;
  max-width: 100%;
  margin-top: 2rem;
  margin-bottom: 2rem;
  width: 150px;
  height: 204px;
  cursor: pointer;
}

#books button {
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

#books button:hover {
  color: #905858;
  border-color: #905858;
}

@media (min-width: 700px) {
  #pages {
    margin-bottom: 4rem;
    width: auto;
    margin: 0 auto;
  }
  #pages ul {
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
    margin-bottom: 8rem;
  }
  #pages ul li {
    border: none;
    border-radius: 0;
    margin: 0.5rem 0.25rem;
    height: 2rem;
    width: 2rem;
    box-shadow: none;
    transform: scale(1, 1);
  }
  #buttonNumber button {
    border: none;
    border-radius: 0;
    background-color: white;
    color: #222222;
    padding: 8px;
    border: 1px solid #ddd;
    height: 2rem;
    width: 2rem;
    font-size: 0.9rem;
  }
  #buttonNumber button:hover:not(.active) {
    background-color: #ddd;
  }
  .otherButton button:hover {
    background-color: white;
    border: none;
    color: #5d3a3a;
    font-size: 1.2rem;
  }
  .otherButton button {
    background-color: white;
    border: none;
    color: #5d3a3a;
    font-size: 1.2rem;
  }
  #buttonNumber .active {
    background-color: #96bb7c;
  }
  #books ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    max-width: 1200px;
    margin: 0 auto 4rem auto;
  }
  #books ul li {
    width: 40%;
    border: none;
    border-radius: 0;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    background-color: #f7ffbd;
  }
  #books img {
    transition: all 0.5s;
  }
  #books img:hover {
    transform: scale(1.1, 1.1);
  }
  #books button {
    background-color: #f7ffbd;
  }
}

@media (min-width: 1000px) {
  #pages {
    width: auto;
  }
  #books ul li {
    width: 30%;
  }
}
</style>