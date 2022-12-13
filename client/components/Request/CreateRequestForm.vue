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
        {id: 'contact', label: 'Contact', placeholder: 'Phone or Email'},
        {id: 'description', label: 'Description', placeholder: 'Describe the types of donation items you are requesting'},
        {id: 'color', label: 'Color', placeholder: 'Ex: Red, blue, orange'},
        {id: 'size', label: 'Size', placeholder: 'Ex: XS, S, M'}
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
