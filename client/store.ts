import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various components.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown requests by (null = show all) // TODO: Update for different kinds of filtering
    requests: [], // All requests created in the app
    username: null, // Username of the logged in user
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored requests filter to the specified one.
       * @param filter - Username of the user to fitler requests by
       */
      state.filter = filter;
    },
    updateRequests(state, requests) {
      /**
       * Update the stored requests to the provided requests.
       * @param requests - Requests to store
       */
      state.requests = requests;
    },
    async refreshRequests(state) {
      /**
       * Request the server for the currently available requests.
       */
      const url = state.filter ? `/api/users/${state.filter}/requests` : '/api/requests'; // TODO: Update for different types of filtering
      const res = await fetch(url).then(async r => r.json());
      state.requests = res;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
