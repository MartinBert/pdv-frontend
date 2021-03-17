<template>
  <v-dialog v-model="$store.state.stocks.stockHistoryDialog" width="1000px">
    <v-card color="var(--main-bg-color)">
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
                                src="/../../images/icons/details.svg"
                                width="30"
                                height="30"
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
                v-model="filterParams.page"
                :length="filterParams.totalPages"
                next-icon="mdi-chevron-right"
                prev-icon="mdi-chevron-left"
                :page="filterParams.page"
                :total-visible="8"
                @input="filterObjects(loguedUser.perfil, filterParams.stringParam, filterParams.page - 1, filterParams.size)"
                v-if="filterParams.totalPages > 1 && loaded"
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
    data() {
        return {
            loguedUser: JSON.parse(localStorage.getItem("userData")),
            token: localStorage.getItem("token"),
            filterParams: {
                fourthLongParam: "",
                thirdLongParam: "",
                stringParam: "",
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
        this.filterObjects(this.loguedUser.perfil, this.filterParams.stringParam, this.filterParams.page - 1, this.filterParams.size);
    },

    methods: {
        filterObjects(fourthLongParam, stringParam, page, size) {
            let thirdLongParam;
            
            switch (fourthLongParam) {
                case 1:
                        thirdLongParam = '';
                    break;
            
                default:
                        thirdLongParam = this.loguedUser.sucursal.id;
                    break;
            }
            
            GenericService(this.tenant, 'historialStock', this.token)
            .filter({thirdLongParam, stringParam, page, size})
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