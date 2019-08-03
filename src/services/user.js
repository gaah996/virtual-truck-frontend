const user = {
  data: {
    loggedIn: false,

    email: null,
    id: null,
    person: null,
    status: null,
    token: null,
    type: null,
    user_name: null
  },

  saveToLocalStorage() {
    localStorage.user = JSON.stringify(this.data);
  },
  pushFromLocalStorage() {
    if (typeof localStorage.user != "undefined") {
      this.data = JSON.parse(localStorage.user);
    }
  },
  clearUser() {
    localStorage.clear();
    user.data = {
      loggedIn: false
    };
  }
};

export default user;
