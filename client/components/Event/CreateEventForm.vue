<!-- Form for creating events (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateEventForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/events',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'startrange', label: 'Event Start Date', value: 'yyyy-mm-dd'},
        {id: 'endrange', label: 'Event End Date', value: 'yyyy-mm-dd'},
        {id: 'location', label: 'Event Location', value: 'city, st'},
        {id: 'description', label: 'Description', value: ''},
        {id: 'contact', label: 'Contact', value: ''},
        {id: 'donationdate', label: 'Last Date for Donations', value: 'yyyy-mm-dd'}
      ],
      title: 'Create an event',
      refreshEvents: true,
      callback: () => {
        const message = 'Successfully created an event!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
