<template>
  <v-container>
    <TabBar :tabs="tabs" :activeTab="setActiveTabComponent"/>
    <v-form class="mb-3">
      <v-row class="mb-4">
        <v-col>
          <v-btn class="primary" @click="seeReports()" raised
            >Reporte de Ventas</v-btn
          >
        </v-col>
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
          <v-text-field
            type="number"
            v-model="filterParams.blackReceiptFilter"
            dense
            outlined
            rounded
            class="text-left"
            label="Búsqueda especial"
            placeholder=" "
            append-icon="mdi-magnify"
            @input="filterObjects()"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <VentasTable
      :items="ventas"
      v-on:print="print"
      v-on:seeDetails="seeDetails"
      v-if="loaded && activeTab === 1"
    />
    <Pagination
      :page="filterParams.page"
      :totalPages="filterParams.totalPages"
      :totalVisible="7"
      v-on:changePage="filterObjects"
      v-if="loaded && activeTab === 1"
    />
    <Spinner v-if="!loaded" />
    <VentaDetails />
    <VentasReportsDialog />
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import ReportsService from "../../services/ReportsService";
import VentasReportsDialog from "../../components/Dialogs/VentasReportsDialog";
import Pagination from "../../components/Pagination";
import Spinner from "../../components/Graphics/Spinner";
import TabBar from "../../components/Graphics/TabBar";
import VentasTable from "../../components/Tables/VentasTable";
import VentaDetails from "../../components/Details/VentaDetails";
export default {
  data: () => ({
    icon: "mdi-check-circle",
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    ventas: [],
    filterParams: {
      blackReceiptFilter: "",
      sucursalId: "",
      fechaEmision: "",
      comprobanteCerrado: "",
      numeroComprobante: "",
      totalVenta: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    tabs: [
      {id: 1, route: '', title: 'Comprobantes Emitidos'},
      {id: 2, route: '', title: 'Presupuesto'},
      {id: 3, route: '', title: 'Cierre Z'}
    ],
    activeTab: 1,
    loaded: false,
    tenant: "",
    service: "comprobantesFiscales",
    token: localStorage.getItem("token"),
  }),

  components: {
    VentasReportsDialog,
    Pagination,
    Spinner,
    VentasTable,
    VentaDetails,
    TabBar
  },

  mounted() {
    this.$store.commit("eventual/resetStates");
    this.tenant = this.$route.params.tenant;
    this.tabs[0].route = `/${this.tenant}/ventas/list`
    this.tabs[1].route = `/${this.tenant}/ventas/presupuesto`
    this.tabs[2].route = `/${this.tenant}/ventas/cierrez`
    if (this.loguedUser.perfil > 1) {
      this.filterParams.sucursalId = this.loguedUser.sucursal.id;
    }
    this.filterObjects();
  },

  methods: {
    filterObjects(page) {
      if (page) this.filterParams.page = page;
      GenericService(this.tenant, "ventas", this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.ventas = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          if (this.filterParams.totalPages < this.filterParams.page) {
            this.filterParams.page = 1;
          }
          this.loaded = true;
        });
    },

    seeDetails(objects) {
      let title = "Productos";
      if (objects[0] && objects[0].cuotas) title = "Planes de pago";
      if (objects[0] && objects[0].planPago) title = "Medios de pago";
      this.$store.commit("details/mutateDialog");
      this.$store.commit("details/addTitleToDetail", title);
      this.$store.commit("details/addObjectsToDetail", objects);
    },

    print(object) {
      ReportsService(this.tenant, "ventas", this.token)
        .onCloseSaleReport(object)
        .then((res) => {
          let file = new Blob([res["data"]], {
            type: "application/pdf",
          });
          let fileURL = URL.createObjectURL(file);
          window.open(fileURL, "_blank");
        });
    },

    seeReports() {
      this.$store.commit("eventual/mutateEventualDialog");
    },

    setActiveTabComponent(id){
      this.activeTab = id;
    },

    containValue(value) {
      if (value !== "" || value !== undefined || value !== null) {
        return true;
      } else {
        return false;
      }
    },

    isEmpty(value) {
      if (value === "" || value === undefined || value === null) {
        return true;
      } else {
        return false;
      }
    },

    isEmptyDate(date) {
      if (date === "" || date === undefined || date === null || date === "//") {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style>
.v-form {
  padding: 10px;
}
</style>
