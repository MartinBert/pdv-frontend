<template>
    <v-container class="home-content">
        <LineChart />
        <BarChart />
    </v-container>
</template>
<script>
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
  export default {
    components: {
      LineChart,
      BarChart
    },
  }
</script>
