<template>
  <v-date-picker v-model="fechas" multiple @input="emitFormatDate">
  </v-date-picker>
</template>
<script>
import { formatWithSlash } from "../../helpers/dateHelper";
export default {
  data: () => ({
    fechas: [formatWithSlash()],
  }),
  methods: {
    emitFormatDate() {
      this.$store.commit('eventual/addEventual', this.fechas);
      this.$emit('emitDate');
    },
  },
};
</script>
