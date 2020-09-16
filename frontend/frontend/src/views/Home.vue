<template>
  <div class="home">
    <vue-headful title="Home | Intercambio de Libros" />
    <h1>Intercambio de Libros</h1>
    <div id="intro">
      <h2>¡Bienvenido/a!</h2>
      <ul>
        <li>
          En
          <b>Biblioteca</b> podrás buscar un libro por autor, título, género literario o localidad donde se encuentre su propietario entre todos los libros que han subido nuestros usuarios.
        </li>
        <li>
          En
          <b>Registro</b> puedes crear una cuenta para la página. Es necesario además de tu email y una contraseña, conocer dónde vas a intercambiar libros y un nombre para identificarte.
        </li>
        <li>
          Para iniciar sesión en tu cuenta ve a
          <b>Login</b>.
        </li>
      </ul>
      <div id="info">
        <h3>¿Qué hay que hacer para solicitar un intercambio de libro?</h3>
        <ol>
          <li>
            Una vez creada la cuenta, asegúrate de tener un libro para intercambiar al menos. Podrás publicar un libro en la sección de
            <b>Publicar</b>. Allí verás los campos obligatorios y opcionales que tendrás que rellenar.
          </li>
          <li>
            Cuando ya hayas publicado los libros que ofreces para intercambiar (Cuanto más mejor, así el usuario que recibe la petición de intercambio tiene más libros para escoger), busca un libro en
            <b>Biblioteca</b>, pulsa en él para ver más información y después pulsa el botón de
            <b>Solicitar Intercambio</b>.
          </li>
          <li>Tendrás que esperar luego a que el otro usuario acepte o rechace tu solicitud. Recibirás un aviso por correo electrónico.</li>
        </ol>
      </div>
      <div id="anotherInfo">
        <h3>¿Qué hay que hacer si recibo una solicitud de intercambio?</h3>
        <ol>
          <li>Recibes una solicitud de intercambio en tu correo. Pulsa en el enlace, que te llevará a su colección de libros.</li>
          <li>Allí podrás rechazar el intercambio, o escoger el libro que más te guste.</li>
          <li>Si escoges un libro de su biblioteca, tendrás que especificar después el lugar, la fecha y la hora del intercambio.</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {}
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Raleway:wght@300;400;500;600&display=swap");

@keyframes aparicion {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.home {
  margin-top: 5rem;
  animation-name: aparicion;
  animation-duration: 3s;
}

h1 {
  font-family: "Amatic SC", sans-serif;
  text-align: center;
  font-size: 2.8rem;
}

#intro {
  margin-top: 3rem;
  margin-bottom: 4rem;
  margin-left: 0.6rem;
  margin-right: 0.6rem;
  border: 2px solid #905858;
  border-radius: 25px;
  padding: 0.5rem;
  background-color: #f7ffbd;
  transition: all 0.5s;
}

#intro:hover {
  transform: scale(1.1, 1.1);
}

#intro h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #905858;
}

li {
  margin-right: 0.75rem;
  font-size: 0.85rem;
  margin-bottom: 0.65rem;
}

h3 {
  text-align: center;
  font-size: 1rem;
  margin: 2rem auto 1rem auto;
  padding: 0.25rem;
  color: #905858;
}

@media (min-width: 700px) {
  .home {
    margin-top: 2rem;
    padding-bottom: 4rem;
    background-image: url("../assets/library.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    min-height: 100vh;
    background-color: rgba(255, 255, 255, 0.5);
    background-blend-mode: lighten;
  }
  h1 {
    padding-top: 4rem;
    font-size: 5.5rem;
    text-shadow: 2px 2px 2px white;
    color: black;
  }
  #intro {
    width: 650px;
    margin: 6rem auto 8rem auto;
  }
  h3 {
    font-size: 1.2rem;
  }
  li {
    font-size: 1rem;
  }
}
</style>
