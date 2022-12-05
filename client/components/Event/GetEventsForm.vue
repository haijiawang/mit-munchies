<!-- Form for getting events (all, from user for now) (inline style) -->

<script>
import InlineFormEvent from '@/components/common/InlineFormEvent.vue';

export default {
  name: 'GetEventsForm',
  mixins: [InlineFormEvent],
  data() {
    return {coordvalue: this.$store.state.eventFilterCoord, startvalue: this.$store.state.eventFilterStartDate, 
    endvalue: this.$store.state.eventFilterEndDate, locvalue: this.$store.state.eventFilterLoc};
  },
  methods: {
    async submit() {
      var url = '/api/events';
      if (this.coordvalue && this.startvalue && this.endvalue && this.locvalue){
        url = `/api/events?coordinator=${this.coordvalue}&startrange=${this.startvalue}&endrange=${this.endvalue}&location=${this.locvalue}`;
      }else if (this.coordvalue && this.startvalue && this.endvalue){
        url = `/api/events?coordinator=${this.coordvalue}&startrange=${this.startvalue}&endrange=${this.endvalue}`;
      }else if (this.coordvalue && this.startvalue){
        url = `/api/events?coordinator=${this.coordvalue}&startrange=${this.startvalue}`;
      }else if (this.coordvalue && this.locvalue){
        url = `/api/events?coordinator=${this.coordvalue}&location=${this.locvalue}`;
      }else if (this.locvalue && this.startvalue && this.endvalue){
        url = `/api/events?location=${this.locvalue}&startrange=${this.startvalue}&endrange=${this.endvalue}`;
      }else if (this.locvalue && this.startvalue){
        url = `/api/events?location=${this.locvalue}&startrange=${this.startvalue}`;
      }else if (this.coordvalue){
        url = `/api/events?coordinator=${this.coordvalue}`;
      }else if (this.startvalue && this.endvalue){
        url = `/api/events?startrange=${this.startvalue}&endrange=${this.endvalue}`;
      }else if (this.startvalue){
        url = `/api/events?startrange=${this.startvalue}`;
      }else if (this.locvalue){
        url = `/api/events?location=${this.locvalue}`;
      }
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.$store.commit('updateEventCoord', this.coordvalue);
        this.$store.commit('updateEventStart', this.startvalue);
        this.$store.commit('updateEventEnd', this.endvalue);
        this.$store.commit('updateEventLocation', this.locvalue);
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
