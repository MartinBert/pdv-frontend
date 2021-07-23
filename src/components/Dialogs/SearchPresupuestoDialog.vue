<template>
  <v-dialog v-model="$store.state.receipt.receiptDialog" width="1000px" persistent>
    <v-card color="var(--main-bg-color)">
      <v-card-title>
        <h3>Seleccione un presupuesto para generar la factura</h3>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-simple-table style="background-color: transparent" ref="tab">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>Numero de presupuesto</th>
                    <th>Fecha de emision</th>
                    <th>Monto de presupuesto</th>
                    <th>Detalle de articulos</th>
                    <th>Seleccionar</th>
                  </tr>
                </thead>
                <tbody v-for="object in objects" :key="object.id">
                  <tr>
                    <td>{{ object.numeroCbte }}</td>
                    <td>{{ object.fechaEmision }}</td>
                    <td>{{ object.totalVenta }}</td>
                    <td class="text-center">
                      <Detail :objectsArray="object.productosDetalle" v-on:seeDetails="seeDetails"/>
                    </td>
                    <td class="text-center">
                      <Checked
                        :object="object"
                        v-on:uncheck="uncheck"
                        v-if="object.selected === true"
                      />
                      <Add :object="object" v-on:add="add" v-else />
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-row>
          <v-col cols='12'>
            <Pagination
              :page="filterParams.page"
              :totalPages="filterParams.totalPages"
              :totalVisible="7"
              v-on:changePage="filterObjects"
            />
          </v-col>
          <v-col>
            <v-btn class="primary" @click="selectPresupuesto()">Aceptar</v-btn>
            <v-btn class="default ml-1" @click="cancel()">Cancelar</v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
    <ProductsOfPresupuestoDetail :products='productsToDetail'/>
  </v-dialog>
</template>
<script>
import VentasService from "../../services/VentasService";
import ProductsOfPresupuestoDetail from '../Details/ProductsOfPresupuestoDetail.vue';
import Pagination from '../Pagination.vue';
import Detail from '../Buttons/Detail.vue';
import Checked from '../Buttons/Checked.vue';
import Add from '../Buttons/Add.vue';

export default {
  props:{
    resetPresupuestSearch: Boolean
  },
  data() {
    return {
      loguedUser: JSON.parse(localStorage.getItem("userData")),
      token: localStorage.getItem("token"),
      filterParams: {
        blackReceiptFilter: "",
        sucursalId: "",
        fechaEmision: "",
        comprobanteCerrado: "",
        numeroComprobante: "",
        validityStatus: true,
        totalVenta: "",
        page: 1,
        size: 10,
        totalPages: 0,
      },
      objects: [],
      productsToDetail: [],
      presupuestoSelected: {}
    };
  },

  components:{
      Detail,
      ProductsOfPresupuestoDetail,
      Pagination,
      Checked,
      Add
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterObjects();
  },

  watch: {
    resetPresupuestSearch(){
      if(this.resetPresupuestSearch === true){
        this.presupuestoSelected = {};
        this.filterObjects();
      }
    }
  },

  methods: {
    filterObjects(page) {
      if (page) this.filterParams.page = page;
      if(this.loguedUser.perfil > 1){
        this.filterParams.sucursalId = this.loguedUser.sucursal.id
      }
      VentasService(this.tenant, "ventas", this.token)
        .getPresupuestos(this.filterParams)
        .then((data) => {
          data.data.content.forEach(el => {
            if(el.id == this.presupuestoSelected.id){
              el.selected = true;
            }
          })
          this.objects = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
        });
    },

    seeDetails(products){
        this.productsToDetail = products;
        this.$store.commit('eventual/mutateEventualDialog');
    },

    selectPresupuesto(){
      this.$emit('selectPresupuesto', this.presupuestoSelected);
      this.$store.commit('receipt/receiptDialogMutation');
    },

    cancel(){
      this.presupuestoSelected = {};
      this.$store.commit('receipt/receiptDialogMutation');
    },

    uncheck(){
      this.presupuestoSelected = {};
      this.filterObjects()
    },
  
    add(object){
      this.presupuestoSelected = object;
      this.filterObjects()
    }
  },
};
</script>
