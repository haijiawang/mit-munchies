<template>
    <date-pick v-model="date"></date-pick>
</template>

<script>
import DatePick from 'vue-date-pick';
import 'vue-date-pick/dist/vueDatePick.css';

export default {
    components: {DatePick},
    data: () => ({
        date: '2019-01-01'
    }),
    
};
</script>