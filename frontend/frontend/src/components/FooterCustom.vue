<template>
  <div>
    <footer>Andrés Canosa 2020, 2021</footer>
  </div>
</template>

<script>
export default {
  name: "FooterCustom"
};
</script>

<style scoped>
footer {
  background-color: #5d3a3a;
  color: #b5e0ba;
  text-align: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 1rem 0;
  font-size: 0.7rem;
}

@media (min-width: 700px) {
  footer {
    font-size: 0.9rem;
    height: 60px;
    display: inline-block;
  }
}
</style>