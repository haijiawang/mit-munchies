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
        {id: 'startrange', label: 'Event Start Date', placeholder: 'yyyy-mm-dd'},
        {id: 'endrange', label: 'Event End Date', placeholder: 'yyyy-mm-dd'},
        {id: 'location', label: 'Event Location', placeholder: 'city, st'},
        {id: 'description', label: 'Description', placeholder: 'Describe the types of donation items you are requesting'},
        {id: 'contact', label: 'Contact', placeholder: 'Phone or email'},
        {id: 'donationdate', label: 'Last Date for Donations', placeholder: 'yyyy-mm-dd'}
      ],
      title: 'Create an event',
      refreshEvents: true,
      callback: () => {
        const message = 'Successfully created an event!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  },
  methods: {
    checkErrors(){
      const phone = this.fields[4].value.length; // should be 10
      //const email = this.fields[4].value as string;
      const emailList = this.fields[4].value.split("@");
      var site = [];
      if (emailList.length === 2 ){
        site = emailList[1].split(".");
      }else{
        try{
          throw new Error(`Invalid contact: please enter 10-digit phone number or valid email address ${this.fields[4].value}`);
        }
        catch(e){
          this.$set(this.alerts, e, "error");
          setTimeout(() => this.$delete(this.alerts, e), 3000);
          return 1;
        }
      }

      if (this.fields[4].value.length !== 10 && site.length !== 2){ // also assert that phone number is entirely made up of digits
        try{
          throw new Error(`Invalid contact: please enter 10-digit phone number or valid email address`);
        }
        catch(e){
          this.$set(this.alerts, e, "error");
          setTimeout(() => this.$delete(this.alerts, e), 3000);
          return 1;
        }
      }
      return 0;
    },
  },
};
</script>
