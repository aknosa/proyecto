<template>
  <div id="Add">
    <vue-headful title="Publicar | Intercambio de Libros" />
    <h1>Publicar un Libro</h1>
    <p v-show="errorMsg">*Faltan por completar campos obligatorios</p>
    <div id="form">
      <form>
        <label for="title">Título:</label>
        <input v-model="title" name="title" type="text" placeholder="*Campo obligatorio" />
        <label for="author">Autor:</label>
        <input v-model="author" name="author" type="text" placeholder="*Campo obligatorio" />
        <label for="genre">Género:</label>
        <select v-model="genre" name="genre">
          <option>Poesía</option>
          <option>Teatro</option>
          <option>Terror</option>
          <option>Policiaca</option>
          <option>Ciencia ficción</option>
          <option>Fantasía</option>
          <option>Cómic</option>
          <option>Romántica</option>
          <option>Arte</option>
          <option>Historia y política</option>
          <option>Gastronomía</option>
          <option>Salud</option>
          <option>Deportes</option>
          <option>Infantil</option>
        </select>
        <label for="synopsis">Sinopsis:</label>
        <textarea v-model="synopsis" name="synopsis" placeholder="*Campo opcional"></textarea>
        <label for="biography">Biografía del autor:</label>
        <textarea v-model="biography" name="biography" placeholder="*Campo opcional"></textarea>
        <label for="description">Descripción del libro:</label>
        <textarea v-model="description" name="description" placeholder="*Campo opcional"></textarea>
        <label for="image">Imagen (*Campo obligatorio):</label>
        <input ref="image" name="image" type="file" @change="pickAndShowImage" />
      </form>
      <div id="button">
        <button @click="validatingData()">Publicar</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { config } from "../api/utils";
import Swal from "sweetalert2";

export default {
  name: "AddBook",
  data() {
    return {
      title: "",
      author: "",
      genre: "Poesía",
      synopsis: "",
      biography: "",
      description: "",
      image: "",
      errorMsg: false,
      createBook: false
    };
  },
  methods: {
    validatingData() {
      if (this.title === "" || this.author === "" || this.image === "") {
        this.createBook = false;
        this.errorMsg = true;
      } else {
        this.errorMsg = false;
        this.createBook = true;
        this.addNewBook();
      }
    },
    addNewBook() {
      if (this.createBook === true) {
        var self = this;
        let formData = new FormData();

        formData.append("title", self.title);
        formData.append("author", self.author);
        formData.append("genre", self.genre);
        formData.append("synopsis", self.synopsis);
        formData.append("authorBiography", self.biography);
        formData.append("description", self.description);
        formData.append("image", self.image);

        axios
          .post("http://localhost:3000/books", formData, config, {
            header: { "Content-type": "multipart/form-data" }
          })
          .then(function(response) {
            console.log(response);
            Swal.fire(
              "¡Publicado!",
              "Has añadido un libro a tu colección.",
              "success"
            );
          })
          .catch(function(error) {
            console.log(error);
          });
        this.createBook = false;
        this.title = "";
        this.author = "";
        this.genre = "Poesía";
        this.synopsis = "";
        this.biography = "";
        this.description = "";
        this.image = "";
      }
    },
    pickAndShowImage() {
      this.image = this.$refs.image.files[0];
      console.log(this.image);
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

#Add {
  margin-top: 5rem;
}

#Add h1 {
  text-align: center;
}

p {
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
  color: #f0134d;
}

#form {
  width: 90%;
  margin: 3rem 0 7rem 0.5rem;
  position: relative;
  animation-name: animation;
  animation-duration: 1s;
}

form {
  display: flex;
  flex-direction: column;
  width: 100%;
}

#button {
  text-align: right;
}

input {
  border: none;
  border-bottom: 5px solid #96bb7c;
  margin-top: 1rem;
  margin-bottom: 2rem;
  font-weight: 300;
  transition: all 0.5s;
}

input:focus {
  border-bottom: 5px solid #905858;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  transition: background-color 5000s ease-in-out 0s;
}

#form form select {
  margin-top: 1rem;
  margin-bottom: 2rem;
  width: 50%;
}

textarea {
  margin-top: 1rem;
  margin-bottom: 2rem;
  height: 4rem;
  border: 2px solid #96bb7c;
  border-radius: 10px;
  overflow: auto;
  outline: none;
  transition: all 0.5s;
  resize: none;
}

textarea:focus {
  border: 2px solid #905858;
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
  margin-top: 2rem;
  transition: all 1s;
}

button:hover {
  color: #905858;
  border-color: #905858;
}

@media (min-width: 700px) {
  #Add {
    margin-top: 8rem;
  }
  #form {
    margin: 5rem auto;
    width: 50%;
  }
  input {
    font-size: 1.25rem;
  }
  #form form select {
    width: 30%;
  }
}

@media (min-width: 1000px) {
  #form {
    width: 30%;
  }
  input {
    font-size: 1.25rem;
  }
}
</style>
