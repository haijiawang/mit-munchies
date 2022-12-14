<!-- Reusable component for a form in an inline style (input and button on same line) -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit">
    <table cellspacing="0" cellpadding="10">
      <tr>
        <td width="40">
          Start and end search range:
          <date-pick
            v-model="startvalue"
            :inputAttributes="{size: 10}"
          ></date-pick>
          <date-pick
            v-model="endvalue"
            :inputAttributes="{size: 10}"
          ></date-pick>
        </td>

        <td width="20">
          <input
            v-model="coordvalue"
            type="text"
            :placeholder="coordplaceholder"
            :size="30"
          >
          <input
            v-model="locvalue"
            type="text"
            :placeholder="locplaceholder"
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
import DatePicker from '@/components/common/DatePicker.vue';
import DatePick from 'vue-date-pick';
import 'vue-date-pick/dist/vueDatePick.css';

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
      default: 'Submit',
    }
  },
  data() {
    return {coordvalue: '', 
    startvalue: (new Date()).getFullYear() + '-' + (new Date()).getMonth() + '-' + (new Date()).getDate(), 
    endvalue: (new Date()).getFullYear() + '-' + (new Date()).getMonth() + '-' + (new Date()).getDate(), 
    locvalue: '', alerts: {}, date: new Date()};
  },
  components: { DatePicker, DatePick },
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

button {
  width: 120px;
}
</style>
