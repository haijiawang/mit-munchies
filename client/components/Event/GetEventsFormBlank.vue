<!-- Form for getting events (all, from user for now) (inline style) -->

<script>
import InlineFormBlank from '@/components/common/InlineFormBlank.vue';

export default {
  name: 'GetEventsFormBlank',
  mixins: [InlineFormBlank],
  data() {
    return {alerts: {}};
  },
  methods: {
    async submit() {
      var url = '/api/events';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('updateEvents', res);
      } catch (e) {
        if (this.value === this.$store.state.eventFilterCoord) {
          // This section triggers if you filter to a user but they
          // change their username when you refresh
          this.$store.commit('updateEventCoord', null);
          this.coordvalue = ''; // Clear filter to show all users' requests
          this.$store.commit('refreshEvents');
        } else {
          // Otherwise reset to previous fitler
          this.coordvalue = this.$store.state.eventFilterCoord;
        }

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
