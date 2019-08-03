<template>
  <div class="header">
    <div class="logo">
      <img src="@/assets/img/logo.png" alt="logo" @click="$router.push({name:'home'})" />
    </div>
    <div class="slot">
      <slot></slot>
    </div>
    <div class="user-info" v-if="user.loggedIn == true">
      <img
        class="user-picture"
        src="@/assets/img/icons/default-user.png"
        alt="user-picture"
        @click="$router.push({name:'dashboard'})"
      />
      <p
        @click="$router.push({name:'dashboard'})"
      >{{user.person.name}} {{user.person.lastname | firstLetter}}</p>
      <div class="expansive-menu">
        <img src="@/assets/img/icons/arrow-down.png" alt="arrow-down" @click="showMenu = !showMenu" />
        <transition name="menu">
          <ul v-if="showMenu">
            <li>Mudar senha</li>
            <li>Mudar email</li>
            <li>Mudar foto</li>
            <li @click="logout()">Sair</li>
          </ul>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import user from "@/services/user";

export default {
  name: "header",
  data: () => ({
    showMenu: false,
    user: null
  }),
  created() {
    this.user = user.data;
  },
  methods: {
    updateInfo() {
      this.user = user.data;
    },
    logout() {
      user.clearUser();
      this.$router.push({ name: "home" });
    }
  }
};
</script>

<style src="./style.scss" lang="scss" scoped>
</style>
