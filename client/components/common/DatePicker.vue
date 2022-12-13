<template>
    <date-pick 
        v-model="date"
        :hasInputElement="true"
    ></date-pick>

</template>

<script>
import DatePick from 'vue-date-pick';
import 'vue-date-pick/dist/vueDatePick.css';

export default {
    components: {DatePick},
    data: () => ({
        date: ''
    }),
};
</script>