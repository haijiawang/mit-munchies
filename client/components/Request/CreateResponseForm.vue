<!-- Form for creating requests (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default{
  name: 'CreateResponseForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/responses',
      method: 'POST',
      hasBody: true,
      // requestId: this.$store.state.requestId,
      fields: [
        {id: 'contact', label: 'Contact', value: ''},
        {id: 'description', label: 'Response', value: ''},
        {id: 'requestId', value: this.$store.state.requestId},

      ],
      title: 'Respond to Request',
      refreshRequests: true,
      callback: () => {
        const message = 'Successfully created a response!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
