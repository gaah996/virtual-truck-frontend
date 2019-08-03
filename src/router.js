import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home/Home.vue";
import Dashboard from "./views/Dashboard/Dashboard.vue";
import Mapa from "./views/Map/Map.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard
    },
    {
      path: "/mapa",
      name: "map",
      component: Mapa
    }
  ]
});
