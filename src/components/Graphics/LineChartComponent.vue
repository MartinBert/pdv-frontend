<template>
  <div class="small" ref="grafic" >
    <BarChart :chartData="charData"/>
  </div>
</template>
<script>
import BarChart from "../../plugins/chart";

export default {
  props: {
    charData: Object
  },
  components: {
    BarChart,
  },
  methods:{
  
  }
}
</script>
<style>
.small {
  margin: auto;
  width: 100%;
  height: 100%;
}
</style>