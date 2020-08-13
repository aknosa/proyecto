<template>
  <div id="user">
    <div id="image">
      <img :src="getImageName(user.image)" />
    </div>
    <div id="information">
      <ul>
        <li>
          <b>Nombre:</b>
          {{user.name}}
        </li>
        <li v-if="seeProfile">
          <b>Email:</b>
          {{user.email}}
        </li>
        <li>
          <b>Localidad:</b>
          {{user.location}}
        </li>
        <li v-if="seeProfile">
          <b>Fecha de Nacimiento:</b>
          {{ format(new Date(user.birthdate), "dd/MM/yyyy") }}
        </li>
        <li v-if="seeProfile">
          <b>Teléfono de contacto:</b>
          {{user.phoneNumber}}
        </li>
      </ul>
      <div id="buttons" v-if="seeProfile">
        <button @click="sendUserInfo()">Editar</button>
        <button>Cambiar contraseña</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuthToken, tokenData } from "../api/utils";
import { format } from "date-fns";

export default {
  name: "UserDataProfile",
  data() {
    return {
      format,
      seeProfile: false,
      token: getAuthToken()
    };
  },
  props: {
    user: Object
  },
  methods: {
    sendUserInfo() {
      this.$emit("info");
    },
    getImageName(name) {
      return process.env.VUE_APP_STATIC + name;
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
#image {
  text-align: center;
}

img {
  margin-bottom: 2rem;
  max-width: 100%;
  width: 175px;
  height: 175px;
  border-radius: 50%;
  object-fit: cover;
  border: 6px solid #905858;
}

ul {
  list-style: none;
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0;
  margin-inline-end: 0;
  padding-inline-start: 0;
  margin-left: 1.5rem;
}

li {
  margin-top: 1rem;
}

#buttons {
  text-align: center;
}

#buttons button {
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

#buttons button:hover {
  color: #905858;
  border-color: #905858;
}

@media (min-width: 700px) {
  #user {
    display: flex;
    justify-content: space-around;
    max-width: 1000px;
    margin: 5rem auto 0 auto;
  }
  img {
    width: 225px;
    height: 225px;
  }
}
</style>