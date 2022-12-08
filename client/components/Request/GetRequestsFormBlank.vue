<!-- Form for getting requests (all, from user for now) (inline style) -->

<script>
import InlineFormBlank from '@/components/common/InlineFormBlank.vue';

export default {
  name: 'GetRequestsFormBlank',
  mixins: [InlineFormBlank],
  data() {
    return {value: this.$store.state.username};
  },
  methods: {
    async submit() {
      const url =`/api/requests?author=${this.value}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.$store.commit('updateRequests', res);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
