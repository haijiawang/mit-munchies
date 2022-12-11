<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit">
    <h3>{{ title }}</h3>
    <article
      v-if="fields.length"
    >

    <table>
    <tr>
      <td>
        <label>{{ fields[0].label }}: </label>
        <input
          :size="15"
          :type="fields[0].id === 'password' ? 'password' : 'text'"
          :name="fields[0].id"
          :value="fields[0].value"
          :placeholder="fields[0].placeholder"
          @input="fields[0].value = $event.target.value"
        >
      </td>

      <td>
        <label>{{ fields[1].label }}: </label>
        <input
          :size="15"
          :type="fields[1].id === 'password' ? 'password' : 'text'"
          :name="fields[1].id"
          :value="fields[1].value"
          :placeholder="fields[1].placeholder"
          @input="fields[1].value = $event.target.value"
        >
      </td>

      <td>
        <label>{{ fields[5].label }}: </label>
        <input
          :size="15"
          :type="fields[5].id === 'password' ? 'password' : 'text'"
          :name="fields[5].id"
          :value="fields[5].value"
          :placeholder="fields[5].placeholder"
          @input="fields[5].value = $event.target.value"
        >
      </td>
    </tr>

    <tr>
      <td>
        <label>{{ fields[2].label }}: </label>
        <input
          :size="17"
          :type="fields[2].id === 'password' ? 'password' : 'text'"
          :name="fields[2].id"
          :value="fields[2].value"
          :placeholder="fields[2].placeholder"
          @input="fields[2].value = $event.target.value"
        >
      </td>

      <td>
        <label>{{ fields[4].label }}: </label>
        <input
          :size="25"
          :type="fields[4].id === 'password' ? 'password' : 'text'"
          :name="fields[4].id"
          :value="fields[4].value"
          :placeholder="fields[4].placeholder"
          @input="fields[4].value = $event.target.value"
        >
      </td>
    </tr>

    <tr>
      <td colspan="3">
        <label>{{ fields[3].label }}: </label>
        <input
          :size="128"
          :type="fields[3].id === 'password' ? 'password' : 'text'"
          :name="fields[3].id"
          :value="fields[3].value"
          :placeholder="fields[3].placeholder"
          @input="fields[3].value = $event.target.value"
        >
      </td>
    </tr>

    </table>

    </article>
    <article v-else>
      <p>{{ title }}</p>
    </article>
    <button
      type="submit"
    >
      {{ title }}
    </button>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </form>
</template>

<script>

export default {
  name: 'BlockFormEvents',
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      url: '', // Url to submit form to
      method: 'GET', // Form request method
      hasBody: false, // Whether or not form request has a body
      setUsername: false, // Whether or not stored username should be updated after form submission
      refreshRequests: false, // Whether or not stored freets should be updated after form submission
      refreshEvents: false, // Whether or not stored freets should be updated after form submission
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null // Function to run after successful form submission
    };
  },
  methods: {
    checkErrors (){
      // overriden by instantiation
      return 0;
    },
    async submit() {
      /**
        * Submits a form with the specified options from data().
        */
      const e = this.checkErrors();
      if (e > 0)
        return; // save preferences and display errors without deleting info
      const options = {
        method: this.method,
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };
      if (this.hasBody) {
        options.body = JSON.stringify(Object.fromEntries(
          this.fields.map(field => {
            const {id, value} = field;
            field.value = '';
            return [id, value];
          })
        ));
      }

      try {
        const r = await fetch(this.url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        if (this.setUsername) {
          const text = await r.text();
          const res = text ? JSON.parse(text) : {user: null};
          this.$store.commit('setUsername', res.user ? res.user.username : null);
        }

        if (this.refreshRequests) {
          this.$store.commit('refreshRequests');
        }

        if (this.refreshEvents) {
          this.$store.commit('refreshEvents');
        }

        if (this.callback) {
          this.callback();
        }
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
form {
  border: 1px solid #111;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
  border-radius: 15px;
}

article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

textarea {
   font-family: inherit;
   font-size: inherit;
}
</style>
