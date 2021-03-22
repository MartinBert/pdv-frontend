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
import LineChartComponent from "../components/Graphics/LineChartComponent";
import DataPicker from "../components/Graphics/DataPicker";
export default {
  data: () => ({
  }),
  components: {
    LineChartComponent,
    DataPicker,
  },
};
</script>
