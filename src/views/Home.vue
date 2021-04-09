<template>
  <v-container class="home-content">
    <v-row>
      <v-col md="6" sm="12">
        <DataPicker v-on:emitDate="checkIfDateIsEmitted"/>
        
        <v-text-field
            type="number"
            v-model="blackReceiptFilter"
            dense

            class="text-left mt-5"
            label="Búsqueda especial"
            placeholder=" "
            append-icon="mdi-magnify"
            @input="newDates++"
          ></v-text-field>
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
    blackReceiptFilter: ""
  }),
  components: {
    LineChartComponent,
    DataPicker,
  },
  methods:{
    checkIfDateIsEmitted(){
      this.newDates++
    }
  }
};
</script>
<style>
 .v-text-field{
  width: 300px;
  margin-bottom: .5em
}
</style>