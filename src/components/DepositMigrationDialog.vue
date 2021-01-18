<template>
  <v-dialog v-model="$store.state.stocks.depositMigrationDialog" width="550px">
    <v-card>
        <v-card-title>
            <h3>Migración de stock entre depósitos</h3>
        </v-card-title>
        <v-card-text>
            <form @submit.prevent="reasignDeposit()">
                <v-row>
                    <v-col cols="6">
                        <v-autocomplete
                            :items="$store.state.stocks.deposits"
                            item-text="nombre"
                            label="Migrar de"
                            v-model="originDeposit"
                            :return-object="true"
                            required
                        ></v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                        <v-autocomplete
                            :items="$store.state.stocks.deposits"
                            item-text="nombre"
                            label="a depósito"
                            v-model="destinyDeposit"
                            :return-object="true"
                            required
                        ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" class="text-center">
                        <v-btn type="submit" class="success">MIGRAR</v-btn>
                    </v-col>
                </v-row>
            </form>
        </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { questionAlert } from '../helpers/alerts';

export default {
  name: "ModifyMinimumStocksDialog",
  data(){
    return{
        originDeposit: '',
        destinyDeposit: '',
        allDeposits: '',
    }
  },
  methods:{
    reasignDeposit(){
        questionAlert(
            "Atención, esta acción migrará todos los productos de un depósito a otro",
            "Desea continuar"
        )
        .then(result => {
            if(result.isConfirmed){
                let selectedDeposits = [this.originDeposit, this.destinyDeposit]

                this.$store.commit('stocks/selectedDepositsMutation', selectedDeposits);
                this.$store.commit('stocks/depositMigrationDialogMutation');
                this.$emit('depositsForMigrationProcess');
            }else{
                this.originDeposit = '';
                this.destinyDeposit = '';
            }
        })
    },
  }   
};
</script>