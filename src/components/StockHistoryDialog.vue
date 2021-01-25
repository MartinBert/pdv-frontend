<template>
  <v-dialog v-model="$store.state.stocks.stockHistoryDialog" width="1000px">
    <v-card>
      <v-card-title>
        <h3>Historial de movimientos en stocks</h3>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <!-- Objects Table -->
            <v-simple-table style="background-color: transparent;" ref="tab">
                <template v-slot:default>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Descripción</th>
                        <th>Productos y cantidades</th>
                        <th>Fecha</th>
                        <th>Usuario que realizó la operación</th>
                    </tr>
                    </thead>
                    <tbody v-for="object in objects" :key="object.id">
                    <tr>
                        <td>{{object.id}}</td>
                        <td>{{object.descripcion}}</td>
                        <td class="text-center">
                            <button @click="seeDetails(object.stocks)"><img
                                src="/../../images/icons/eye.svg"
                                width="40"
                                height="40"
                            /></button>
                        </td>
                        <td>{{object.fecha}}</td>
                        <td>{{object.usuario}}</td>
                    </tr>
                    </tbody>
                </template>
                </v-simple-table>
                <!-- End Objects Table -->
                
                <!-- Pagination -->
                <v-pagination
                v-model="paginate.page"
                :length="paginate.totalPages"
                next-icon="mdi-chevron-right"
                prev-icon="mdi-chevron-left"
                :page="paginate.page"
                :total-visible="8"
                @input="filterObjects(filterString, paginate.page - 1, paginate.size)"
                v-if="paginate.totalPages > 1 && loaded"
                ></v-pagination>
                <!-- End Pagination -->

          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

  <ProductListOfStockDialog/>
  </v-dialog>
</template>
<script>
import GenericService from '../services/GenericService';
import ProductListOfStockDialog from '../components/ProductListOfStockDialog.vue'

export default {
    name: "StockHistoryDialog",

    data() {
        return {
            loguedUser: JSON.parse(localStorage.getItem("userData")),
            token: localStorage.getItem("token"),
            filterString: "",
            paginate: {
            page: 1,
            size: 10,
            totalPages: 0
            },
            objects: [],
        };
    },

    components:{
        ProductListOfStockDialog
    },

    mounted(){
        this.tenant = this.$route.params.tenant;
        this.filterObjects(this.filterString, this.paginate.page - 1, this.paginate.size);
    },

    methods: {
        filterObjects(param, page, size) {
            let id;
            if (this.loguedUser.perfil < 3) {
                id = "";
            } else {
                id = this.loguedUser.sucursal.id;
            }
            
            GenericService(this.tenant, 'historialStock', this.token)
            .filter({id, param, page, size})
            .then(data => {
                this.objects = data.data.content;
            })
        },

        seeDetails(stocks){
            this.$store.commit('eventual/addEventual', stocks);
            this.$store.commit('eventual/mutateEventualDialog');
        }
    },
};
</script>