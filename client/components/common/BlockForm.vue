<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit">
    <h3>{{ title }}</h3>
    <article
        v-if="fields.length"
    >
      <div
          v-for="field in fields"
          :key="field.id"
      >
        <label :for="field.id"/>
        <div
            v-if="field.id==='color'"
            :name="field.id"
            :value="field.value"
            @input="field.value = $event.target.value">
          <label>{{ field.label }}: </label>
          <select
              name="color"
              id="color"
              class="np-color-select-input"
          >
            <option value="red">Red</option>
            <option value="orange">Orange</option>
            <option value="yellow">Yellow</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
            <option value="purple">Purple</option>
            <option value="pink">Pink</option>
            <option value="black">Black</option>
            <option value="white">White</option>
          </select>
        </div>
        <div
            v-else-if="field.id==='size'"
            :name="field.id"
            :value="field.value"
            @input="field.value = $event.target.value">
          <label>{{ field.label }}: </label>
          <select
              name="size"
              id="size"
              class="np-size-select-input"
          >
            <option value="xSmall">XSmall</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="xLarge">XLarge</option>
          </select>
        </div>
        <div
            v-else-if="field.id === 'content'"
        >
          <label>{{ field.label }}: </label>
          <textarea
              :name="field.id"
              :value="field.value"
              @input="field.value = $event.target.value"
          />
        </div>
        <p v-else>
          <label>{{ field.label }}: </label>
          <input
              :size = 125
              :type="field.id === 'password' ? 'password' : 'text'"
              :name="field.id"
              :value="field.value"
              :placeholder="field.placeholder"
              @input="field.value = $event.target.value"
          >
        </p>
      </div>
    </article>
    <article v-else>
      <p>{{ content }}</p>
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
  name: 'BlockForm',
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
      callback: null, // Function to run after successful form submission
      activeDropdown: false, //dropdown starts closed
    };
  },
  methods: {
    toggle() {
      this.activeDropdown = !this.activeDropdown
    },
    checkErrors() {
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
