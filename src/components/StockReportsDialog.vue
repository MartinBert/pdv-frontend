<template>
  <v-dialog v-model="$store.state.stocks.stockReportsDialog" width="500px">
    <v-card>
      <v-card-title class="d-flex justify-center">
        <span>Generar reportes de stock</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
              <v-col class="text-center">
                  <v-btn class="primary" @click="allStocksReport()">
                    Reporte general de existencias
                  </v-btn>
              </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import ReportsService from '../services/ReportsService';
import { exportPDF } from '../helpers/exportFileHelper';

export default {
  name: "StockReportsDialog",

  props:{
    loguedUser: Object,
    tenant: String,
    service: String,
    token: String
  },

  methods:{

    /**** Export PDF ****/
    allStocksReport(){
      if(this.loguedUser.sucursal === undefined) return this.$errorAlert("Debe seleccionar una sucursal para generar el documento");
      let id = this.loguedUser.sucursal.id;

      ReportsService(this.tenant, this.service, this.token)
        .allStocksReport(id)
        .then((res) => {
          exportPDF(res);
        });
    }

  }
};
</script>
