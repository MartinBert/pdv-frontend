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
      this.$emit('emitDate', this.fechas);
      
    }
  },
};
</script>

