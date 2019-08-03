<template>
  <div class="container">
    <Header></Header>
    <div class="content">
      <div class="lateral-menu">
        <ul>
          <li>
            <span>
              <img src="@/assets/img/icons/menu.png" alt="Menu" />
              <p>Início</p>
            </span>
          </li>
          <li>
            <span>
              <img src="@/assets/img/icons/menu.png" alt="Menu" />
              <p>Perfil</p>
            </span>
          </li>
          <li>
            <span>
              <img src="@/assets/img/icons/menu.png" alt="Menu" />
              <p>Meu Caminhão</p>
            </span>
          </li>
          <li>
            <span>
              <img src="@/assets/img/icons/menu.png" alt="Menu" />
              <p>Fretes</p>
            </span>
          </li>
        </ul>
        <div class="logout" @click="logout()">
          <img src="@/assets/img/icons/logout.png" alt="Logout" />
          <p>Sair</p>
        </div>
      </div>
      <div class="view"></div>
    </div>
    <div class="map-button" @click="$router.push({name: 'map'})">
      <img src="@/assets/img/icons/plus.png" alt="Plus" />
      <div class="text">Ir para o mapa</div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header/Header.vue";
import user from "@/services/user";

export default {
  name: "dashboard",
  components: {
    Header
  },
  data: () => ({
    user: null
  }),
  created() {
    this.user = user.data;
  },
  methods: {
    logout() {
      user.clearUser();
      this.$router.push({ name: "home" });
    }
  }
};
</script>

<style src="./style.scss" lang="scss" scoped>
</style>
