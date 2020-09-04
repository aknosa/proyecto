<template>
  <div id="table">
    <div id="searcher">
      <input type="search" v-model="searchName" placeholder="Título, autor, género o localidad" />
      <select v-model="field">
        <option>Autor</option>
        <option>Título</option>
        <option>Localidad</option>
        <option>Género</option>
      </select>
      <button @click="searchByName()">Buscar</button>
    </div>
    <h3
      v-show="!showResults"
    >¡Por aquí podrás buscar el libro que desees por título, nombre del autor, género literario o localidad donde se encuentre su propietario!</h3>
    <spinnercustom v-show="isLoading"></spinnercustom>
    <ul v-show="!isLoading">
      <li v-for="book in showedBook" :key="book.id" v-show="showResults" @click="toBook(book.id)">
        <img :src="getImageName(book.image)" />
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
          <b>Nombre del propietario:</b>
          {{book.name}}
        </p>
        <p>
          <b>Localidad:</b>
          {{book.location}}
        </p>
      </li>
    </ul>
    <!-- PAGINACIÓN -->
    <div v-show="!isLoading">
      <nav id="pages" v-show="showResults">
        <ul v-show="showPages">
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
import spinnercustom from "../components/SpinnerCustom";

export default {
  name: "BooksTable",
  components: {
    spinnercustom
  },
  props: {
    books: Array
  },
  data() {
    return {
      field: "Autor",
      searchName: "",
      showResults: false,
      isLoading: false,
      showPages: true,
      currentIndex: 0,
      elementsPerPage: 9,
      currentPage: 0
    };
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
    searchByName() {
      let search = { theSearch: this.searchName, theField: this.field };
      this.$emit("booksList", search);
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.showResults = true;
      }, 1200);
    },
    getImageName(name) {
      return process.env.VUE_APP_STATIC + name;
    },
    toBook(id) {
      this.$router.push("/book/" + id);
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

#pages {
  margin-bottom: 4rem;
  text-align: center;
}

#pages ul {
  padding: 0;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
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

li,
#searcher,
h3 {
  position: relative;
  animation-name: animation;
  animation-duration: 1s;
}
#searcher {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
input {
  width: 55%;
  border-radius: 25px;
  border: 2px solid #96bb7c;
  color: #222222;
  transition: all 0.5s;
  background-image: url("../assets/lupa.png");
  background-position: 10px;
  background-repeat: no-repeat;
  background-size: 13px;
  padding-left: 40px;
  height: 30px;
}

input:focus {
  border: 2px solid #905858;
}

select {
  width: 80px;
  padding: 0.25rem;
  margin-left: 0.15rem;
  border-radius: 25px;
  background-color: white;
  border: 2px solid #96bb7c;
  height: 30px;
}

select:focus {
  border: 2px solid #905858;
  outline: none;
  transition: all 0.5s;
}

#searcher button {
  margin-left: 0.15rem;
  height: 30px;
  padding: 0.25rem;
  margin-bottom: 4rem;
  background-color: #905858;
  color: #b5e0ba;
  border: 2px solid #96bb7c;
  border-radius: 25px;
  transition: all 0.5s;
}

#searcher button:hover {
  background-color: #96bb7c;
  color: #5d3a3a;
  border: 2px solid #905858;
}

h3 {
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem;
  background-color: #f7ffbd;
  width: 300px;
  margin: auto auto;
  border: 2px solid #5d3a3a;
  border-radius: 25px;
  transition: all 0.25s;
}

h3:hover {
  transform: scale(1.1, 1.1);
}

ul li img {
  object-fit: cover;
  max-width: 100%;
  margin-top: 2rem;
  margin-bottom: 2rem;
  width: 220px;
  height: 300px;
}

ul {
  margin-block-start: 0;
  margin-block-end: 0;
  padding-inline-start: 0;
  padding: 0.5rem;
  position: relative;
  list-style: none;
  text-align: center;
}

li {
  margin: 0 auto 5rem auto;
  border: 5px solid #905858;
  border-radius: 25px;
}

#table li p {
  padding: 0.75rem;
  text-align: left;
}

@media (min-width: 600px) {
  input {
    width: 50%;
    height: 2rem;
    background-size: 20px;
  }
  select {
    height: 2rem;
    width: 100px;
  }
  #searcher button {
    font-size: 1rem;
    height: 2rem;
    padding: 0 0.9rem 0 0.9rem;
    border: 2px solid #96bb7c;
    font-weight: 600;
    text-transform: uppercase;
  }
  #searcher button:hover {
    border: 2px solid;
  }
  h3 {
    width: 500px;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
  }
  li {
    width: 40%;
    border: none;
    border-radius: 0;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    padding-bottom: 2rem;
    transition: all 0.5s;
  }
  li:hover {
    transform: scale(1.05, 1.05);
  }
  li p {
    margin-left: 1.5rem;
  }
  img {
    border-radius: 25px;
  }
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
}

@media (min-width: 1000px) {
  li {
    width: 30%;
  }
  #pages {
    width: auto;
  }
}

@media (min-width: 1300px) {
  li {
    width: 25.5%;
  }
}
</style>