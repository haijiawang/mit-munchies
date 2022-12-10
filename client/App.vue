<template>
  <div id="app">
    <header>
      <NavBar />
    </header>
    <router-view />
  </div>
</template>

<script>
import NavBar from "@/components/common/NavBar.vue";

export default {
  name: "App",
  components: { NavBar },
  beforeCreate() {
    // Sync stored username to current session
    fetch("/api/users/session", {
      credentials: "same-origin", // Sends express-session credentials with request
    })
      .then((res) => res.json())
      .then((res) => {
        const user = res.user;
        this.$store.commit("setUsername", user ? user.username : null);
      });

    // Clear alerts on page refresh
    this.$store.state.alerts = {};
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@80;100;180;200;300;400;500;600;700;800&display=swap");

* {
  box-sizing: border-box;
  font-family: Poppins;
}

body {
  height: 100vh;
  flex-direction: column;
  display: flex;
  padding: 0;
  margin: 0;
  font-size: 1.2em;
  background-color: #f9f8f6;
}

button {
  background-color: #fff;
  color: black;
  border-radius: 100px;
  border-color: black;
  border: 0.95px solid black;
  height: 35px;
  font-weight: 600;
}

main {
  padding: 0 5em 5em;
}

.alerts {
  position: absolute;
  z-index: 99;
  bottom: 0;
  top: 100%;
  left: 50%;
  transform: translate(-50%, 10%);
  width: 100%;
  text-align: center;
}

.alerts article {
  border-radius: 100px;
  padding: 10px 20px;
  color: #fff;
}

.alerts p {
  margin: 0;
}

.alerts .error {
  background-color: #de847b;
}

.alerts .success {
  background-color: #b2d2a4;
}
</style>
