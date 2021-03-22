<template>
    <v-date-picker
      v-model="fechas"
      multiple
      @input="funcionDelOrto"
      >
    </v-date-picker>
</template>
<script>
import { formatWithSlash } from '../../helpers/dateHelper';
export default {
  data: () => ({
    fechas: [formatWithSlash()]
  }),
  methods:{
    funcionDelOrto(){
      this.$emit('dateData', this.fechas);
    }
  }
}
</script>
