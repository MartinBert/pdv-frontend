<template>
  <div class="small">
    <BarChart :chartData="charData"/>
  </div>
</template>
<script>
import BarChart from '../plugins/chart';
export default {
  data:() => ({
    charData: {
      labels: 'Coming Soon',
      datasets: [
        {
          label: 'Coming Soon',
          backgroundColor: 'rgb(63, 81, 181)',
          data:[0,0.5,1,2,3,4,5,6,7,8,9,10]
        },
      ],
    }
  }),
  components:{
    BarChart
  }
}
</script>
<style>
  .small {
    max-width: 400px;
    max-height: 300px;
  }
</style>