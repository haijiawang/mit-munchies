<!-- Form for getting events (all, from user for now) (inline style) -->

<script>
import InlineFormBlank from '@/components/common/InlineFormBlank.vue';

export default {
  name: 'GetEventResponsesForm',
  mixins: [InlineFormBlank],
  data() {
    return {alerts: {}};
  },
  methods: {
    async submit() {
      var url = '/api/eventResponses';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('updateEventResponses', res);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
