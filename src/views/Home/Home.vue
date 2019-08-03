<template>
  <div>
    <div class="container">
      <Header ref="header"></Header>
      <div class="content">
        <div class="slides-container">
          <div class="slides">
            <transition name="slides">
              <div class="slide-content" v-if="slides.currentSlide == 0" key="0">
                <h3>Do mesmo modo, a competitividade nas transações comerciais obstaculiza a apreciação da importância do investimento em reciclagem técnica.</h3>
              </div>
              <div class="slide-content" v-if="slides.currentSlide == 1" key="1">
                <h3>Do mesmo modo, o surgimento do comércio virtual acarreta um processo de reformulação e modernização das novas proposições.</h3>
              </div>
              <div class="slide-content" v-if="slides.currentSlide == 2" key="2">
                <h3>A nível organizacional, o aumento do diálogo entre os diferentes setores produtivos facilita a criação dos relacionamentos verticais entre as hierarquias.</h3>
              </div>
            </transition>
          </div>
          <div class="slide-markers">
            <ul>
              <li :class="{active: slides.currentSlide == 0}"></li>
              <li :class="{active: slides.currentSlide == 1}"></li>
              <li :class="{active: slides.currentSlide == 2}"></li>
            </ul>
          </div>
        </div>
        <span class="separator"></span>
        <div class="forms">
          <UserForms></UserForms>
        </div>
      </div>
    </div>
    <div class="footer"></div>
  </div>
</template>

<script>
import Header from "@/components/Header/Header.vue";
import UserForms from "@/components/UserForms/UserForms.vue";

export default {
  name: "home",
  components: {
    Header,
    UserForms
  },
  data: () => ({
    slides: {
      currentSlide: 0
    }
  }),
  mounted() {
    this.presentation();
  },
  methods: {
    presentation() {
      setInterval(() => {
        this.slides.currentSlide = (this.slides.currentSlide + 1) % 3;
      }, 6000);
    }
  }
};
</script>

<style src="./style.scss" lang="scss" scoped></style>
