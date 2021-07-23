<template>
  <v-container
    style="min-width: 98%;
    margin-left:1px;
  "
  >
    <TabBar :tabs="tabs" :activeTab="activeTab" />
    <v-card min-width="100%">
      <PresupuestosTable
        v-on:print="print"
        v-on:seeDetails="seeDetails"
      />
      <VentaDetails />
      <VentasReportsDialog />
    </v-card>
  </v-container>
</template>
<script>
import ReportsService from "../../services/ReportsService";
import VentasReportsDialog from "../../components/Dialogs/VentasReportsDialog";
import TabBar from "../../components/Generics/TabBar";
import PresupuestosTable from "../../components/Tables/PresupuestosTable";
import VentaDetails from "../../components/Details/VentaDetails";
export default {
  data: () => ({
    icon: "mdi-check-circle",
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    ventas: [],
    tenant: "",
    service: "comprobantesFiscales",
    token: localStorage.getItem("token"),
    tabs:[
      { id: 1, title: "Comprobantes", route: '/ventas/list' },
      { id: 2, title: "Presupuesto", route: '/ventas/presupuesto' },
      { id: 3, title: "Cierre de ventas Diario", route: '/ventas/cierrez' },
    ],
    activeTab: 2
  }),

  components: {
    VentasReportsDialog,
    PresupuestosTable,
    VentaDetails,
    TabBar,
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
  },

  methods: {
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

    setActiveTabComponent(id) {
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


