<template>
  <div class="small" ref="grafic" >
    <BarChart :chartData="chartData"/>
  </div>
</template>
<script>
import BarChart from "../../plugins/chart";

export default {
  props: {
    charData: Object,
    detected: Number 
  },
  data: ()=>({
    chartData: {
      labels: [],
      datasets: [
        {
          label: "Total",
          backgroundColor: "rgb(63, 81, 181)",
          data: [],
        },
      ],
    }
  }),
  watch:{
    detected(){
      this.chartData.labels = this.charData.labels;
      this.chartData.datasets.data = [5, 10, 15, 20];
      this.chartData.datasets.label = this.charData.datasets.label;
      console.log(this.chartData)
    }
  },

  components: {
    BarChart,
  },
};
</script>
<style>
.small {
  margin: auto;
  width: 100%;
  height: 100%;
}
</style>