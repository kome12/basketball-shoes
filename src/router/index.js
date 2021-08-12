import Vue from "vue";
import VueRouter from "vue-router";
import Shoes from "../views/Shoes.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Shoes",
    component: Shoes,
  },
  {
    path: "/shoe/:id",
    name: "Shoe",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Shoe.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
