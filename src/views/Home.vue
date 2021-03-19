<template>
  <v-container class="home-content">
    <v-row>
      <v-col>
        <DataPicker/>
      </v-col>
      <v-col>
        <LineChartComponent/>
      </v-col>
    </v-row>
  </v-container>
</template>
<script >
import LineChartComponent from "../components/LineChartComponent";
import DataPicker from "../components/DataPicker";
export default {
  data: () => ({
  }),
  components: {
    LineChartComponent,
    DataPicker,
  },
};
</script>
