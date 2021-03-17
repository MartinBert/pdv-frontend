<template>
  <v-dialog v-model="$store.state.stocks.dialog" width="550px">
    <v-card color="var(--main-bg-color)">
        <v-card-title>
            <h3>Asigne las existencias mínimas de su stock</h3>
        </v-card-title>
        <v-card-text>
            <form @submit.prevent="assignExistences">
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            type="number"
                            placeholder=" "
                            label="Cantidad mínima de existencias"
                            v-model="minimumQuantity"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="text-center">
                        <v-btn type="submit" class="success">APLICAR A TODO</v-btn>
                    </v-col>
                </v-row>
            </form>
        </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "ModifyMinimumStocksDialog",
  data(){
    return{
        minimumQuantity: '',
    }
  },
  methods:{
    assignExistences(){
        this.$questionAlert(
        "Atención, esta acción modificará las existencias mínimas de todos los productos",
        "Desea continuar"
        )
        .then(result => {
            if(result.isConfirmed){
                this.$store.commit('stocks/minimumQuantityMutation', this.minimumQuantity);
                this.minimumQuantity = '';
                this.$store.commit('stocks/dialogMutation');
                this.$emit('stocksRestrictions')
            }else{
                this.minimumQuantity = '';
            }
        });
    },
  }   
};
</script>