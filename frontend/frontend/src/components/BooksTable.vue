<template>
  <div id="table">
    <div id="searcher">
      <input type="search" v-model="searchName" placeholder="Título, autor, género o localidad" />
      <button @click="searchByName()">Buscar</button>
    </div>
    <h3
      v-show="!showResults"
    >¡Por aquí podrás buscar el libro que desees por título, nombre del autor, género literario o localidad donde se encuentre su propietario!</h3>
    <spinnercustom v-show="isLoading"></spinnercustom>
    <ul v-show="!isLoading">
      <li v-for="book in books" :key="book.id" v-show="showResults" @click="toBook(book.id)">
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
      searchName: "",
      showResults: false,
      isLoading: false
    };
  },
  methods: {
    searchByName() {
      let search = this.searchName;
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

li,
#searcher,
h3 {
  position: relative;
  animation-name: animation;
  animation-duration: 1s;
}

input {
  width: 78%;
  margin-left: 0.25rem;
  border-radius: 25px;
  border: 2px solid #96bb7c;
  color: #222222;
  transition: all 0.5s;
}

input:focus {
  border: 2px solid #905858;
}

button {
  margin-left: 0.25rem;
  margin-bottom: 4rem;
  background-color: #905858;
  color: #b5e0ba;
  border: 2px solid #96bb7c;
  border-radius: 25px;
  transition: all 0.5s;
}

button:hover {
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
  #searcher {
    text-align: center;
  }
  input {
    width: 50%;
    height: 2rem;
  }
  button {
    font-size: 1.3rem;
    border: 4px solid #96bb7c;
  }
  button:hover {
    font-size: 1.3rem;
    border: 4px solid;
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

  @media (min-width: 1000px) {
    li {
      width: 30%;
    }
  }

  @media (min-width: 1300px) {
    li {
      width: 25.5%;
    }
  }
}
</style>