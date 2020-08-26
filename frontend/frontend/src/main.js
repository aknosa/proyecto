import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vueHeadful from "vue-headful";
import StarRating from "vue-star-rating";

Vue.component("vue-headful", vueHeadful);
Vue.component("star-rating", StarRating);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
