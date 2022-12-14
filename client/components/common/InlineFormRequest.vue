<!-- Reusable component for a form in an inline style (input and button on same line) -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit">
    <table cellspacing="0" cellpadding="10">
      <tr>
        <td width="20">
          <input
            v-model="value"
            type="text"
            :placeholder="placeholderuser"
            :size="30"
          >
          <input
            v-model="color"
            type="text"
            :placeholder="placeholdercolor"
            :size="30"
          >
          <input
            v-model="size"
            type="text"
            :placeholder="placeholdersize"
            :size="30"
          >
        </td>

        <td width="200">
          <button
            type="submit"
          >
          {{ button }}
          </button>
        </td>
      </tr>
    </table>
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
  name: 'InlineFormRequest',
  props: {
    placeholderuser: {
      type: String,
      default: ''
    },
    placeholdercolor: {
      type: String,
      default: ''
    },
    placeholdersize: {
      type: String,
      default: ''
    },
    button: {
      type: String,
      default: 'Submit'
    }
  },
  data() {
    return {value: '', alerts: {}};
  }
};
</script>

<style scoped>
form {
    display: flex;
    position: relative;
}

input {
    padding: 0 5px;
    min-width: 200px;
}
</style>
