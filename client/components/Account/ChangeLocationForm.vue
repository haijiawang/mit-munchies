<!-- Form for changing location (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ChangeLocationForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users',
      method: 'PATCH',
      hasBody: true,
      fields: [
        {id: 'locationcity', label: 'Location City', value: ''},
        {id: 'locationstate', label: 'Location State', value: ''},
      ],
      title: 'Change location',
      callback: () => {
        const message = 'Successfully changed location!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
