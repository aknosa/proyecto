<template>
  <div id="error">
    <vue-headful title="Error 404 | Intercambio de Libros" />
    <h1>Error 404</h1>
    <p>La página que intentas acceder no existe.</p>
    <p>Comprueba que está bien escrita la dirección en tu navegador.</p>
    <img src="../assets/book.gif" />
  </div>
</template>

<script>
export default {
  name: "Error"
};
</script>

<style scoped>
#error {
  margin-top: 5rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

p {
  margin-top: 1rem;
  font-size: 0.9rem;
  margin-left: 0.9rem;
  margin-right: 0.9rem;
}

img {
  max-width: 100%;
}

@media (min-width: 700px) {
  #error {
    margin-top: 8rem;
    text-align: center;
  }
  #error h1 {
    text-align: left;
    margin-left: 3rem;
    font-size: 3rem;
  }
  #error p {
    text-align: left;
    margin-left: 3rem;
    font-size: 1.15rem;
  }
  img {
    margin-top: 5rem;
  }
}
</style>
