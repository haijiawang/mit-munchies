import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import firebase from 'firebase/compat/app';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    var firebaseConfig = {
      apiKey: "AIzaSyATr7AVSY3d7LuTqJVvJ5kbR4QdFV2qiGs",
      authDomain: "re-thrift.firebaseapp.com",
      projectId: "re-thrift",
      storageBucket: "re-thrift.appspot.com",
      messagingSenderId: "709056402623",
      appId: "1:709056402623:web:ae045610e8dd98be4c220a"
    }
    // initialize firebase
    firebase.initializeApp(firebaseConfig)
  }
}).$mount('#app');
