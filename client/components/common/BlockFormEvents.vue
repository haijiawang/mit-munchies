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
        <label>{{ fields[6].label }}: </label>
        <input
          :size="20"
          :type="fields[6].id === 'password' ? 'password' : 'text'"
          :name="fields[6].id"
          :value="fields[6].value"
          :placeholder="fields[6].placeholder"
          @input="fields[6].value = $event.target.value"
        >
      </td>

      <td colspan="2">
        <label>{{ fields[7].label }}: </label>
        <input
          :size="80"
          :type="fields[7].id === 'password' ? 'password' : 'text'"
          :name="fields[7].id"
          :value="fields[7].value"
          :placeholder="fields[7].placeholder"
          @input="fields[7].value = $event.target.value"
        >
      </td>
      </td>
    </tr>

    <tr>
      <td>
        <label>{{ fields[0].label }}: </label>
        <date-pick
          v-model="fields[0].value"
          :inputAttributes="{size: 15}"
        ></date-pick>
      </td>

      <td>
        <label>{{ fields[1].label }}: </label>
        <date-pick
          v-model="fields[1].value"
          :inputAttributes="{size: 15}"
        ></date-pick>
      </td>

      <td>
        <label>{{ fields[5].label }}: </label>
        <date-pick
          v-model="fields[5].value"
          :inputAttributes="{size: 15}"
        ></date-pick>
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
        <label>{{ fields[4].label }}: <br></label>
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
          :size="141"
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
import DatePicker from '@/components/common/DatePicker.vue';
import DatePick from 'vue-date-pick';
import 'vue-date-pick/dist/vueDatePick.css';

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
      callback: null, // Function to run after successful form submission
    };
  },
  components: { DatePicker, DatePick },
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

vdpArrowPrev:after {
    border-right-color: #cd99a2;
}

vdpArrowNext:after {
    border-left-color: #cd99a2;
}

vdpCell.selectable:hover .vdpCellContent,
vdpCell.selected .vdpCellContent {
    background: #cd99a2;
}

vdpCell.today {
    color: #cd99a2;
}

vdpTimeUnit > input:hover,
vdpTimeUnit > input:focus {
    border-bottom-color: #cd99a2;
}
</style>
