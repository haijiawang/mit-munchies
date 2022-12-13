<!-- Form for creating events (block style) -->

<script>
import BlockFormEvents from '@/components/common/BlockFormEvents.vue';

export default {
  name: 'CreateEventForm',
  mixins: [BlockFormEvents],
  data() {
    return {
      url: '/api/events',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'startrange', label: 'Event Start Date', value: (new Date()).getFullYear() + '-' + (new Date()).getMonth() + '-' + (new Date()).getDate()},
        {id: 'endrange', label: 'Event End Date', value: (new Date()).getFullYear() + '-' + (new Date()).getMonth() + '-' + (new Date()).getDate()},
        {id: 'location', label: 'Event Location', placeholder: 'city, st'},
        {id: 'description', label: 'Description', placeholder: 'Describe the types of donation items you are requesting'},
        {id: 'contact', label: 'Contact', placeholder: 'Phone or email'},
        {id: 'donationdate', label: 'Last Date for Donations', value: (new Date()).getFullYear() + '-' + (new Date()).getMonth() + '-' + (new Date()).getDate()}
      ],
      title: 'Create an event',
      refreshEvents: true,
      callback: () => {
        const message = 'Successfully created an event!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      },
      date1: null,
      date2: null
    };
  },
  methods: {
    checkAllFields(){
      if (!this.fields[0] || !this.fields[1] || !this.fields[2] || !this.fields[3] || !this.fields[4] || !this.fields[5]){
          try{
            throw new Error("Empty fields: please fill in all of the fields.");
          }catch{
            this.$set(this.alerts, e, "error");
            setTimeout(() => this.$delete(this.alerts, e), 3000);
            return 1;
          }
      }
      return 0;
    },
    checkDateFormat(){
      const start = this.fields[0].value;
      const end = this.fields[1].value;
      const donation = this.fields[5].value;

      for (const date of [start, end, donation]){
        if(date.length !== 10){
          try{
            throw new Error("Invalid date: Dates do not have the proper amount of characters");
          }catch{
            this.$set(this.alerts, e, "error");
            setTimeout(() => this.$delete(this.alerts, e), 3000);
            return 1;
          }
        }
        // Also check for if the date is in the right range, and if the month exists
      }
    },
    checkContact(){
      const phone = this.fields[4].value.length; // should be 10
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
    checkErrors(){
      const all = this.checkAllFields(); 
      const date = this.checkDateFormat();
      const contact = this.checkContact();

      return all + date + contact;
    }
  },
};
</script>
