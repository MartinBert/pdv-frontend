<template>
  <v-container style="min-width: 98%;">
    <v-form class="mb-0">
      <v-row class="mb-0">
        <v-spacer></v-spacer>
        <v-col>
          <v-text-field
            type="text"
            v-model="filterParams.fechaEmision"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            label="Búsqueda por fecha"
            class="text-left"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            type="number"
            v-model="filterParams.numeroComprobante"
            v-on:input="filterObjects()"
            dense
            outlined
            rounded
            label="Búsqueda por número de comprobante"
            placeholder=" "
            class="text-left"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-autocomplete
            label="Estado"
            :items="[{text:'Vigentes', value: true}, {text:'No vigentes', value: false}]"
            item-text="text"
            v-model="filterParams.validityStatus"
            v-on:input="filterObjects()"
          />
        </v-col>
      </v-row>
    </v-form>
    <v-row style="justify-content: center;">
      <v-col>
        <h2 style="text-align:center;">Lista de Presupuestos emitidos</h2>
      </v-col>
    </v-row>
    <v-data-table
      style="background-color: transparent"
      :headers="headers"
      :items="presupuestos"
      class="elevation-6"
    >
      <template v-slot:[`item.productos`]="{ item }">
        <Detail :objectsArray="item.productos" v-on:seeDetails="seeDetails" />
      </template>
      <template v-slot:[`item.mediosPago`]="{ item }">
        <Detail :objectsArray="item.mediosPago" v-on:seeDetails="seeDetails" />
      </template>
      <template v-slot:[`item.planesPago`]="{ item }">
        <Detail :objectsArray="item.planesPago" v-on:seeDetails="seeDetails" />
      </template>
      <template v-slot:[`item.acciones`]="{ item }">
        <Print :object="item" v-on:print="print" />
        <Billing :object="item" v-on:billing="billing" class="ml-1"/>
      </template>
    </v-data-table>
    <Spinner v-if="!loaded"/>
    <BillingBudgetDialog :listennerOfStore="listennerOfStore"/>
  </v-container>
</template>
<script>
import VentasService from "../../services/VentasService";
import GenericService from "../../services/GenericService";
import BillingBudgetDialog from '../../components/Dialogs/BillingBudgetDialog';
import { generateIntegerDate } from '../../helpers/dateHelper';
import Spinner from '../Graphics/Spinner';
import Detail from "../Buttons/Detail";
import Billing from "../Buttons/Billing";
import Print from "../Buttons/Print";
export default {
  data: () => ({
    icon: "mdi-check-circle",
    presupuestos: [],
    loaded: false,
    tenant: "",
    listennerOfStore: 0,
    service: "presupuesto",
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
    headers: [
      { text: "Fecha de Venta", value: "fechaEmision" },
      { text: "Codigo de barra", value: "barCode" },
      { text: "Comprobante", value: "nombreDocumento", sortable: false },
      { text: "Detalles", value: "productos", sortable: false },
      { text: "Medios de pago empleados", value: "mediosPago", sortable: false},
      { text: "Planes de pago", value: "planesPago", sortable: false },
      { text: "Precio de venta", value: "totalVenta" },
      { text: "Acciones", value: "acciones", sortable: false },
    ],
  }),

  mounted() {
    this.tenant = this.$route.params.tenant;
     if (this.loguedUser.perfil > 1) {
      this.filterParams.sucursalId = this.loguedUser.sucursal.id;
    }
    this.filterObjects();
  },

  components: {
    Detail,
    Print,
    Spinner,
    Billing,
    BillingBudgetDialog
  },

  methods: {
    filterObjects(page) {
      if (page) this.filterParams.page = page;
      VentasService(this.tenant, "ventas", this.token)
        .getPresupuestos(this.filterParams)
        .then((data) => {
          data.data.content.forEach(presupuesto => {
            if(presupuesto.fechaVencimiento){
              const currentIntegerDate = generateIntegerDate(new Date());
              const presupuestoExpirationIntegerDate = generateIntegerDate(presupuesto.fechaVencimiento);
              if(presupuestoExpirationIntegerDate < currentIntegerDate){
                this.changeBudgetStatus(presupuesto);
              }
            }
          })
          this.presupuestos = data.data.content;
          console.log(this.presupuestos);
          this.filterParams.totalPages = data.data.totalPages;
          if (this.filterParams.totalPages < this.filterParams.page) {
            this.filterParams.page = 1;
          }
          this.loaded = true;
        });
    },

    changeBudgetStatus(budget){
      budget.vencido = 'vencido';
      GenericService(this.tenant, "comprobantesFiscales", this.token)
      .save(budget)
      .catch(err => {
        console.error(err);
      })
    },

    seeReports() {
      this.$store.commit("eventual/mutateEventualDialog");
    },

    seeDetails(objects) {
      this.$emit("seeDetails", objects);
    },

    print(object) {
      this.$emit("print", object);
    },

    billing(object){
      this.$store.commit('budgets/addBudget', object);
      this.listennerOfStore++;
      this.$store.commit('budgets/budgetDialogMutation');
    }
  },
};
</script>
