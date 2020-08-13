<template>
  <div class="home">
    <vue-headful title="Home | Intercambio de Libros" />
    <h1>Intercambio de Libros</h1>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Raleway:wght@300;400;500;600&display=swap");

.home {
  margin-top: 5rem;
}

h1 {
  font-family: "Amatic SC", sans-serif;
  text-align: center;
  font-size: 2.5rem;
}

@media (min-width: 700px) {
  .home {
    margin-top: 8rem;
  }
  h1 {
    font-size: 4rem;
  }
}
</style>
