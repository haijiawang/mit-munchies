<!-- Reusable component for a form in an inline style (input and button on same line) -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit">
    <input
      v-model="coordvalue"
      type="text"
      :placeholder="coordplaceholder"
    >
    <input
      v-model="startvalue"
      type="text"
      :placeholder="startplaceholder"
    >
    <input
      v-model="endvalue"
      type="text"
      :placeholder="endplaceholder"
    >
    <input
      v-model="locvalue"
      type="text"
      :placeholder="locplaceholder"
    >
    <button
      type="submit"
    >
      {{ button }}
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
  name: 'InlineFormEvent',
  props: {
    coordplaceholder: {
      type: String,
      default: ''
    },
    startplaceholder: {
      type: String,
      default: ''
    },
    endplaceholder: {
      type: String,
      default: ''
    },
    locplaceholder: {
      type: String,
      default: ''
    },
    button: {
      type: String,
      default: 'Submit'
    }
  },
  data() {
    return {coordvalue: '', startvalue: '', endvalue: '', locvalue: '', alerts: {}};
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
