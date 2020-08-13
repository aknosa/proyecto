<template>
  <div id="profile">
    <vue-headful title="Perfil | Intercambio de Libros" />
    <h1>Perfil de Usuario</h1>
    <userdataprofile v-on:info="showProfileInfo" :user="user" />
    <!-- MODAL PARA EDITAR PERFIL -->
    <div v-show="seeProfileModal" class="modal">
      <div class="modalBox">
        <h3>Edita tu perfil</h3>
        <form>
          <label for="email">Email:</label>
          <input v-model="updatedEmail" name="email" type="email" />
          <label for="name">Nombre:</label>
          <input v-model="updatedName" type="text" name="name" />
          <label for="location">Localidad:</label>
          <input v-model="updatedLocation" name="location" type="text" />
          <label for="birthdate">Fecha de nacimiento:</label>
          <input
            v-model="updatedBirthdate"
            name="birthdate"
            type="date"
            value="2020-01-01"
            min="1920-01-01"
            max="2020-01-01"
          />
          <label for="phone">Teléfono:</label>
          <input v-model="updatedPhoneNumber" name="phone" type="text" />
          <label for="avatar">Foto de perfil:</label>
          <input ref="avatar" name="avatar" type="file" @change="pickAndShowAvatar" />
        </form>
        <div class="options">
          <button @click="seeProfileModal =! seeProfileModal">Cancelar</button>
          <button @click="editProfile()">Actualizar</button>
        </div>
      </div>
    </div>
    <!-- MODAL PARA EDITAR PERFIL -->
    <userdatabooks v-on:bookData="showBookInfo" :books="books" />
    <!-- MODAL PARA EDITAR LIBRO -->
    <div v-show="seeBookModal" class="modal">
      <div class="modalBox">
        <h3>Edita tu libro</h3>
        <form>
          <label for="title">Título:</label>
          <input v-model="updatedTitle" name="title" type="text" />
          <label for="author">Autor:</label>
          <input v-model="updatedAuthor" name="author" type="text" />
          <label for="genre">Género:</label>
          <select v-model="updatedGenre" name="genre">
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
          <textarea v-model="updatedSynopsis" name="synopsis"></textarea>
          <label for="biography">Biografía del autor:</label>
          <textarea v-model="updatedBiography" name="biography"></textarea>
          <label for="description">Descripción del libro:</label>
          <textarea v-model="updatedDescription" name="description"></textarea>
          <label for="updatedImage">Imagen:</label>
          <input ref="updatedImage" name="updatedImage" type="file" @change="pickAndShowImage" />
        </form>
        <div class="options">
          <button @click="seeBookModal =! seeBookModal">Cancelar</button>
          <button @click="editBook()">Actualizar</button>
        </div>
      </div>
    </div>
    <!-- MODAL PARA EDITAR LIBRO -->
  </div>
</template>

<script>
import { format } from "date-fns";
import userdataprofile from "@/components/UserDataProfile.vue";
import userdatabooks from "@/components/UserDataBooks.vue";
import axios from "axios";
import { config } from "../api/utils";

export default {
  name: "Profile",
  props: ["id"],
  components: {
    userdataprofile,
    userdatabooks
  },
  data() {
    return {
      user: {},
      books: [],
      avatar: "",
      updatedEmail: "",
      updatedName: "",
      updatedLocation: "",
      updatedBirthdate: "",
      updatedPhoneNumber: "",
      seeProfileModal: false,
      seeBookModal: false,
      updatedTitle: "",
      updatedAuthor: "",
      updatedGenre: "",
      updatedSynopsis: "",
      updatedBiography: "",
      updatedDescription: "",
      updatedImage: "",
      updatedBookId: ""
    };
  },
  methods: {
    // Función para sacar el usuario de la base de datos
    getUserById() {
      var self = this;

      axios
        .get("http://localhost:3000/users/" + this.id, config)
        .then(function(response) {
          self.user = response.data.data;
          self.books = response.data.data.books;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // Función para mostrar el modal de editar perfil
    showProfileInfo() {
      this.updatedEmail = this.user.email;
      this.updatedName = this.user.name;
      this.updatedLocation = this.user.location;
      this.updatedBirthdate = format(
        new Date(this.user.birthdate),
        "yyyy-MM-dd"
      );
      this.updatedPhoneNumber = this.user.phoneNumber;
      this.avatar = this.user.image;

      this.seeProfileModal = true;
    },
    editProfile() {
      var self = this;
      let formData = new FormData();

      formData.append("name", self.updatedName);
      formData.append("location", self.updatedLocation);
      formData.append("email", self.updatedEmail);
      formData.append("birthdate", self.updatedBirthdate);
      formData.append("phoneNumber", self.updatedPhoneNumber);
      formData.append("avatar", self.avatar);

      axios
        .put("http://localhost:3000/users/" + this.id, formData, config, {
          header: { "Content-type": "multipart/form-data" }
        })
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
      location.reload();
    },
    showBookInfo(bookInfo) {
      this.updatedTitle = bookInfo.title;
      this.updatedAuthor = bookInfo.author;
      this.updatedGenre = bookInfo.genre;
      this.updatedSynopsis = bookInfo.synopsis;
      this.updatedBiography = bookInfo.author_biography;
      this.updatedDescription = bookInfo.description;
      this.updatedImage = bookInfo.image;
      this.updatedBookId = bookInfo.id;

      this.seeBookModal = true;
    },
    editBook() {
      var self = this;
      let formData = new FormData();

      formData.append("author", self.updatedAuthor);
      formData.append("title", self.updatedTitle);
      formData.append("genre", self.updatedGenre);
      formData.append("authorBiography", self.updatedBiography);
      formData.append("synopsis", self.updatedSynopsis);
      formData.append("description", self.updatedDescription);
      formData.append("image", self.updatedImage);

      axios
        .put(
          "http://localhost:3000/books/" + this.updatedBookId,
          formData,
          config,
          {
            header: { "Content-type": "multipart/form-data" }
          }
        )
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
      location.reload();
    },
    pickAndShowAvatar() {
      this.avatar = this.$refs.avatar.files[0];
    },
    pickAndShowImage() {
      this.updatedImage = this.$refs.updatedImage.files[0];
    }
  },
  created() {
    this.getUserById();
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

#profile {
  margin-top: 5rem;
  margin-bottom: 3rem;
}

h1 {
  text-align: center;
  margin-bottom: 3rem;
}

button:hover {
  color: #905858;
  border-color: #905858;
}

.modal {
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
}
.modalBox {
  background-color: white;
  border-radius: 25px;
  margin: 18% auto;
  padding: 1.5rem;
  width: 80%;
  border: 1px solid #888;
}

.modal .modalBox h3 {
  margin-bottom: 1rem;
}

.modal .modalBox form {
  text-align: left;
}

label {
  font-size: 0.8rem;
}

.modal .modalBox input {
  border: none;
  border-bottom: 5px solid #96bb7c;
  width: 95%;
  transition: all 0.5s;
  margin-bottom: 0.3rem;
}

.modal .modalBox input:focus {
  border-bottom: 5px solid #905858;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  transition: background-color 5000s ease-in-out 0s;
}

select {
  width: 95%;
}

textarea {
  width: 95%;
  resize: none;
  border: 2px solid #96bb7c;
  border-radius: 10px;
  overflow: auto;
  outline: none;
  transition: all 0.5s;
}

textarea:focus {
  border: 2px solid #905858;
}

.options button {
  display: inline-block;
  padding: 0.25em 1em;
  margin: 0 0.3rem;
  border: 0.16em solid #96bb7c;
  box-sizing: content-box;
  text-decoration: none;
  text-transform: uppercase;
  font-weight: 400;
  font-size: 0.7rem;
  color: #96bb7c;
  text-align: center;
  transition: all 0.15s;
  background-color: white;
  font-weight: 600;
  margin-top: 2rem;
  transition: all 1s;
}

.options button:hover {
  color: #905858;
  border-color: #905858;
}

@media (min-width: 700px) {
  #profile {
    margin-top: 8rem;
  }
  .modalBox {
    width: 500px;
    margin: 12% auto;
  }
  label {
    font-size: 1.1rem;
  }
  .modal .modalBox input {
    margin-bottom: 1.5rem;
  }
  select {
    margin-bottom: 1.5rem;
  }
  textarea {
    margin-bottom: 1.5rem;
  }
}

@media (min-width: 1000px) {
  .modalBox {
    margin: 6% auto;
  }
}
</style>
