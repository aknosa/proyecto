import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import { isLoggedIn } from "../api/utils.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      allowAnon: true,
    },
  },
  {
    path: "/register",
    name: "Register",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Register.vue"),
    meta: {
      allowAnon: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: {
      allowAnon: true,
    },
  },
  {
    path: "/library",
    name: "Library",
    component: () => import("../views/Library.vue"),
    meta: {
      allowAnon: true,
    },
  },
  {
    path: "/book/:id",
    name: "Book",
    props: true,
    component: () => import("../views/Book.vue"),
    meta: {
      allowAnon: true,
    },
  },
  {
    path: "/user/:id",
    name: "Profile",
    props: true,
    component: () => import("../views/Profile.vue"),
    meta: {
      allowAnon: false,
    },
  },
  {
    path: "/add-book",
    name: "AddBook",
    component: () => import("../views/AddBook.vue"),
    meta: {
      allowAnon: false,
    },
  },
  {
    path: "/exchange/:exchange_id/user/:user_id",
    name: "ChooseBook",
    component: () => import("../views/ChooseBook.vue"),
    meta: {
      allowAnon: false,
    },
  },
  {
    path: "/exchange/:exchange_id/rate-user/:user_id",
    name: "RateUser",
    component: () => import("../views/RateUser.vue"),
    meta: {
      allowAnon: false,
    },
  },
  {
    path: "/recover-password",
    name: "RecoverPassword",
    component: () => import("../views/RecoverPassword.vue"),
    meta: {
      allowAnon: true,
    },
  },
  {
    path: "*",
    name: "Error",
    component: () => import("../views/Error.vue"),
    meta: {
      allowAnon: true,
    },
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (!to.meta.allowAnon && !isLoggedIn()) {
    next({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});

export default router;
