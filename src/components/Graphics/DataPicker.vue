<template>
  <v-date-picker v-model="fechas" multiple @input="emitFormatDate">
  </v-date-picker>
</template>
<script>
import { formatWithSlash,getCurrentDate} from "../../helpers/dateHelper";
export default {
  data: () => ({
    fechas: [formatWithSlash(getCurrentDate())],
  }),
  mounted(){
    this.emitFormatDate()

  },
  methods: {
    emitFormatDate() {
      this.$store.commit('eventual/addEventual', this.fechas);
      this.$emit('emitDate');
    }
  },
};
</script>

https://txstreet.com/