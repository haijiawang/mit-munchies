<!-- Form for creating requests (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateRequestForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/requests',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'contact', label: 'Contact', value: 'Phone or Email'},
        {id: 'description', label: 'Description', value: 'Describe the types of donation items you are requesting'},
        {id: 'color', label: 'Color', value: 'Ex: Red, blue, orange'},
        {id: 'size', label: 'Size', value: 'Ex: XS, S, M'}
      ],
      title: 'Create a request',
      refreshRequests: true,
      callback: () => {
        const message = 'Successfully created a request!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
