<!-- Form for changing phone number (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ChangePhoneForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users',
      method: 'PATCH',
      hasBody: true,
      fields: [
        {id: 'phoneNumber', label: 'Phone Number', value: ''}
      ],
      title: 'Change phone number',
      callback: () => {
        const message = 'Successfully changed phone number!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
