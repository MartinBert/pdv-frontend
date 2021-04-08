<template>
  <v-container class="home-content">
    <v-row>
      <v-col md="6" sm="12">
        <DataPicker v-on:emitDate="checkIfDateIsEmitted"/>
      </v-col>
      <v-col md="6" sm="12">
        <LineChartComponent :newDatesEmitted="newDates"/>
      </v-col>
    </v-row>
  </v-container>
</template>
<script >
import LineChartComponent from "../components/Graphics/LineChartComponent";
import DataPicker from "../components/Graphics/DataPicker";
export default {
  data: () => ({
    newDates: 0,
    checkIfDateIsEmitted: ""
  }),
  watch:{
    checkIfDateIsEmitted(){
      this.newDates++
    }
  },
  components: {
    LineChartComponent,
    DataPicker,
  }
};
</script>
