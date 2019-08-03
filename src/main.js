import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueTheMask from "vue-the-mask";
import Vuelidate from "vuelidate";

Vue.use(Vuelidate);
Vue.use(VueTheMask);
// Vue.use(require("vue-pusher"), {
//   api_key: "b8c034b01668674831fd",
//   options: {
//     cluster: "mt1",
//     encrypted: true
//   }
// });

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

//Filters
Vue.filter("toCurrency", value => {
  return Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
});

Vue.filter("firstLetter", value => {
  return value.substring(0, 1) + ".";
});
