<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import user from "@/services/user";

export default {
  created() {
    user.pushFromLocalStorage();
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i&display=swap");

body,
* {
  padding: 0px;
  margin: 0px;
  font-family: Roboto, sans-serif;
}
</style>