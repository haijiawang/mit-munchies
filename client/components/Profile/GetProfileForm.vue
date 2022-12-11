<!-- Form for getting events (all, from user for now) (inline style) -->

<script>
import InlineFormBlank from '@/components/common/InlineFormBlank.vue';

export default {
  name: 'GetProfileForm',
  mixins: [InlineFormBlank],
  data() {
    return {value: this.$store.state.username, alerts: {}};
  },
  methods: {
    async submit() {
      var url = `/api/users/session`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.$store.commit('setLocation', res.user.location);
        this.$store.commit('setContact', res.user.email);
        this.$store.commit('setDateJoined', res.user.dateJoined);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
