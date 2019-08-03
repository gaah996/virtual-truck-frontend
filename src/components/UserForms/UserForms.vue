<template>
  <div class="forms-container">
    <transition name="forms">
      <form @submit.prevent="createUser()" v-if="form == 'register'" key="register">
        <h2>Crie sua conta hoje mesmo</h2>
        <div class="row">
          <input type="text" placeholder="Nome" v-model="user.person.name" />
          <input type="text" placeholder="Sobrenome" v-model="user.person.lastname" />
        </div>
        <div class="row">
          <input type="text" placeholder="Nome de usuário" v-model="user.user_name" />
        </div>
        <div class="row">
          <input type="text" placeholder="E-mail" v-model="user.email" />
        </div>
        <div class="row">
          <input type="password" placeholder="Senha" v-model="user.password" />
          <input type="password" placeholder="Confirmar senha" v-model="user.confirm_password" />
        </div>
        <div class="row">
          <input
            type="text"
            placeholder="CPF ou CNPJ"
            v-model="document"
            v-mask="['###.###.###-##', '##.###.###/####-##']"
          />
        </div>
        <div class="row">
          <input
            type="text"
            placeholder="Data de nascimento"
            v-model="birthday"
            v-mask="'##/##/####'"
          />
        </div>
        <div class="row">
          <button type="button" @click="showForm('login')">Já tenho conta</button>
          <button type="submit">Criar conta</button>
        </div>
      </form>
      <form @submit.prevent="login()" v-if="form == 'login'" key="login">
        <h2>Faça login na sua conta</h2>
        <div class="row">
          <input type="text" placeholder="E-mail" v-model="user.email" />
        </div>
        <div class="row">
          <input type="password" placeholder="Senha" v-model="user.password" />
        </div>
        <div class="row">
          <button type="button" @click="showForm('register')">Ainda não tenho conta</button>
          <button type="submit">Entrar</button>
        </div>
      </form>
    </transition>
  </div>
</template>

<script>
import api from "@/services/api";
import user from "@/services/user";

export default {
  name: "user-forms",
  data: () => ({
    birthday: null,
    document: null,
    user: {
      user_name: null,
      email: null,
      password: null,
      type: 1,
      person: {
        name: null,
        lastname: null,
        document: null,
        birthday: null
      }
    },
    form: "register"
  }),
  methods: {
    createUser() {
      console.log("Requisição");
    },
    showForm(form) {
      this.form = form == "login" ? form : "register";
    },
    async createUser() {
      this.user.person.document = this.document.replace(/\D/gi, "");
      if (true) {
        try {
          //Trata os dados
          this.user.person.birthday =
            this.birthday.substring(6) +
            "-" +
            this.birthday.substring(3, 5) +
            "-" +
            this.birthday.substring(0, 2);

          const { data } = await api.post("/user/register", this.user);

          user.data.email = data.created.email;
          user.data.id = data.created.id;
          user.data.person = data.created.person;
          user.data.status = data.created.status;
          user.data.token = data.created.token;
          user.data.type = data.created.type;
          user.data.user_name = data.created.user_name;
          user.data.loggedIn = true;

          //Redireciona pra dashboard
          this.$router.push({ name: "dashboard" });
          this.$parent.$refs.header.updateInfo();
          user.saveToLocalStorage();
        } catch (error) {
          alert("Houve um problema ao cadastrar o usuário");
        }
      }
    },
    async login() {
      try {
        if (true) {
          const { data } = await api.post("/login", {
            email: this.user.email,
            password: this.user.password
          });

          user.data.email = data.user.email;
          user.data.id = data.user.id;
          user.data.person = data.user.person;
          user.data.status = data.user.status;
          user.data.token = data.user.token;
          user.data.type = data.user.type;
          user.data.user_name = data.user.user_name;
          user.data.loggedIn = true;

          //Redireciona pra dashboard
          this.$router.push({ name: "dashboard" });
          this.$parent.$refs.header.updateInfo();
          user.saveToLocalStorage();
        }
      } catch (error) {
        alert("Usuário não encontrado");
      }
    }
  }
};
</script>

<style src="./style.scss" lang="scss" scoped>
</style>
