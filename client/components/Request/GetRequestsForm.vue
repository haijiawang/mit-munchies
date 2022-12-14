<!-- Form for getting requests (all, from user for now) (inline style) -->

<script>
import InlineFormRequest from '@/components/common/InlineFormRequest.vue';

export default {
  name: 'GetRequestsForm',
  mixins: [InlineFormRequest],
  data() {
    return {value: this.$store.state.filter, color: this.$store.state.colorFilter, size: this.$store.state.sizeFilter};
  },
  methods: {
    async submit() {
      var url = '/api/requests';
      if (this.value && this.color && this.size){
        url = `/api/requests?author=${this.value}&color=${this.color}&size=${this.size}`;
      }else if (this.value && this.color){
        url = `/api/requests?author=${this.value}&color=${this.color}`;
      }else if (this.value && this.size){
        url = `/api/requests?author=${this.value}&size=${this.size}`;
      }else if (this.color && this.size){
        url = `/api/requests?color=${this.color}&size=${this.size}`;
      }else if (this.value){
        url = `/api/requests?author=${this.value}`;
      }else if (this.color){
        url = `/api/requests?color=${this.color}`;
      }else if (this.size){
        url = `/api/requests?size=${this.size}`;
      }
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.$store.commit('updateFilter', this.value);
        this.$store.commit('updateColorFilter', this.color);
        this.$store.commit('updateSizeFilter', this.size);
        this.$store.commit('updateRequests', res);
      } catch (e) {
        if (this.value === this.$store.state.filter) {
          // This section triggers if you filter to a user but they
          // change their username when you refresh
          this.$store.commit('updateFilter', null);
          this.value = ''; // Clear filter to show all users' requests
          this.$store.commit('refreshRequests');
        } else {
          // Otherwise reset to previous fitler
          this.value = this.$store.state.filter;
        }

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
