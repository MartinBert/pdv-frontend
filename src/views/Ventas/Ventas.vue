<template>
  <v-container>
    <v-form class="mb-3">
      <v-row>
        <v-col cols="1">
          <v-btn class="primary" raised>Reporte de Ventas</v-btn>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="3">
          <v-text-field
            v-model="filterString"
            v-on:input="filterObjects(filterString)"
            dense
            outlined
            rounded
            class="text-left"
            placeholder="Búsqueda"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>

    <!-- List -->
    <v-simple-table style="background-color: transparent;">
      <template v-slot:default>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha de venta</th>
            <th>Código de barras</th>
            <th>Productos</th>
            <th>Medios de pago empleados</th>
            <th>Planes de pago</th>
            <th>Precio de venta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody v-for="object in objects" :key="object.id">
          <tr>
            <td>{{object.id}}</td>
            <td>{{object.fechaEmision}}</td>
            <td>{{object.barCode}}</td>
            <td><v-btn class="success" @click="seeDetails(object.producto)">VER DETALLES</v-btn></td>
            <td><v-btn class="success" @click="seeDetails(object.mediosPago)">VER DETALLES</v-btn></td>
            <td><v-btn class="success" @click="seeDetails(object.planesPago)">VER DETALLES</v-btn></td>
            <td>${{object.totalVenta}}</td>
            <td>
              <a title="Editar"><img src="/../../images/icons/ico_10.svg" @click="edit(object.id)" width="40" height="40"/></a>
              <a title="Eliminar"><img src="/../../images/icons/ico_11.svg" @click="openDelete(object.id)" width="40" height="40"/></a>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <!-- End List -->

    <!-- Loader -->
    <div class="text-center" style="margin-top:15px" v-if="!loaded">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <!-- End Loader -->

    <!-- Paginate -->
    <v-pagination
      v-model="paginate.page"
      :length="paginate.totalPages"
      next-icon="mdi-chevron-right"
      prev-icon="mdi-chevron-left"
      :page="paginate.page"
      :total-visible="8"
      @input="changePage"
      v-if="paginate.totalPages > 1"
    ></v-pagination>
    <!-- End Paginate -->

    <v-dialog v-model="dialogPaymentsPlans" persistent width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Planes de pago asociados a la venta
        </v-card-title>
          <v-simple-table style="background-color: transparent;">
            <template v-slot:default>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Cuotas</th>
                  <th>Porcentaje</th>
                </tr>
              </thead>
              <tbody v-for="object in $store.state.ventas.planesPago" :key="object.id">
                <tr>
                  <td>{{object.id}}</td>
                  <td>{{object.nombre}}</td>
                  <td>{{object.cuotas}}</td>
                  <td>{{object.porcentaje}}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        <v-card-actions>
          <v-btn color="primary" @click="closePaymentDialog('plans')">
            <i class="material-icons">mdi-pencil</i>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogPaymentsMethods" persistent width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Medios de pago asociados a la venta
        </v-card-title>
          <v-simple-table style="background-color: transparent;">
            <template v-slot:default>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                </tr>
              </thead>
              <tbody v-for="object in $store.state.ventas.mediosPago" :key="object.id">
                <tr>
                  <td>{{object.id}}</td>
                  <td>{{object.nombre}}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        <v-card-actions>
          <v-btn color="primary" @click="closePaymentDialog('methods')">
            <i class="material-icons">pencil</i>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import GenericService from "../../services/GenericService";
import { formatDate } from "../../helpers/dateHelper"; 
export default {

  components:{
    
  }, 
  data: () => ({
    icon: "mdi-check-circle",
    file: null,
    objects: null,
    filterString: "",
    paginate: {
      page: 1,
      size: 10,
      totalPages: 7
    },
    loaded: false,
    tenant: "",
    service: "comprobantesFiscales",
    token: localStorage.getItem("token"),
    dialogDeleteObject: false,
    dialogPaymentsPlans: false,
    dialogPaymentsMethods:false
  }),

  mounted() {
    this.$store.commit('ventas/resetStates');
    this.tenant = this.$route.params.tenant;
    this.getAll(this.paginate.page - 1, this.paginate.size);
  },

  methods: {
    getAll(page, size) {
      this.loaded = false;
      GenericService(this.tenant, this.service, this.token)
        .getAll(page, size)
        .then(data => {
          data.data.content.forEach(el => {
            el.fechaEmision = formatDate(el.fechaEmision);
          });
          this.objects = data.data.content;
          this.paginate.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },

    filterObjects(filter){
      var f ={
        nombre:filter
      }
      GenericService(this.tenant, this.service, this.token)
        .filter(f)
        .then(data => {
          this.objects = data.data.content;
        });
    },

    changePage(page) {
      this.getAll(page - 1, this.paginate.size);
    },

    seeDetails(object){
      if(object[0] !== undefined){
        const evalObject = Object.keys(object[0]);
        if(evalObject[2] === "planPago"){
          this.openPymentsMethodsDialog(object);
        }else if(evalObject[2] === "medioPago"){
          this.openPaymentsPlansDialog(object);
        }else{
          console.log(object);
        }
      }else{
        console.log("Undefined data");
      }
      
    },

    closePaymentDialog(value){
      if(value === 'plans'){
        this.dialogPaymentsPlans = false;
        this.$store.commit('ventas/resetStates');
      }else{
        this.dialogPaymentsMethods = false;
        this.$store.commit('ventas/resetStates');
      }
    },

    openPaymentsPlansDialog(object){
      this.$store.commit('ventas/addPaymentsPlans', object);
      this.dialogPaymentsPlans = true;
    },

    openPymentsMethodsDialog(object){
      this.$store.commit('ventas/addPaymentsMethods', object);
      this.dialogPaymentsMethods = true
    },
  },
};
</script>