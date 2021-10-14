<template>
  <v-container style="min-width: 98%;
  margin-right:40px;
  ">
    <v-card>
      <MediosPagoTable
        :items="mediosPago"
        v-on:editItem="edit"
        v-on:deleteItem="deleteItem"
        v-on:seeDetails="seeDetails"
        v-on:addZClosure="add"
        v-on:addCloseBox="add"
        v-on:uncheckCloseBox="uncheck"
        v-on:uncheckZClosure="uncheck"
        v-if="loaded"
      />
      <Spinner v-if="!loaded" />
      <DeleteDialog
        :status="deleteDialogStatus"
        v-on:deleteConfirmation="deleteConfirmation"
      />
      <MedioPagoDetails />
    </v-card>
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import Spinner from "../../components/Graphics/Spinner";
import MediosPagoTable from "../../components/Tables/MediosPagoTable";
import DeleteDialog from "../../components/Dialogs/DeleteDialog";
import MedioPagoDetails from "../../components/Details/MedioPagoDetails";
import XLSX from "xlsx";
export default {
  data: () => ({
    plans: "",
    file: null,
    mediosPago: [],
    filterParams: {
      sucursalId: "",
      medioPagoName: "",
      estado:true,
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "mediosPago",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    seePlansDialog: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
  }),

  components: {
    Spinner,
    MediosPagoTable,
    DeleteDialog,
    MedioPagoDetails,
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    if (this.loguedUser.perfil > 1) {
      this.filterParams.sucursalId = this.loguedUser.sucursal.id;
    }
    this.filterObjects();
  },

  methods: {
    filterObjects(page) {
      if (page) this.filterParams.page = page;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.mediosPago = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          if (this.filterParams.totalPages < this.filterParams.page) {
            this.filterParams.page = 1;
          }
          this.loaded = true;
        });
    },
    edit(id) {
      this.$router.push({ name: "mediosPagoForm", params: { id: id } });
    },

    deleteItem(id) {
      this.idObjet = id;
      this.deleteDialogStatus = true;
    },

    deleteConfirmation(result) {
      return result ? this.deleteObject() : (this.deleteDialogStatus = false);
    },

    deleteObject() {
      this.dialog = true;
      this.deleteDialogStatus = false;
      GenericService(this.tenant, this.service, this.token)
        .delete(this.idObjet)
        .then(() => {
          this.filterObjects();
        })
    },

    seeDetails(objects) {
      this.$store.commit("details/mutateDialog");
      this.$store.commit("details/addObjectsToDetail", objects);
    },

    add(object, changeType) {
      this.loaded = false;
      if (changeType === "addCloseBox") {
        object.sumaEnCierreDeCaja = true;
      } else {
        object.aplicaCierreZ = true;
      }
      GenericService(this.tenant, this.service, this.token)
        .save(object)
        .then(() => {
          this.refreshView();
        })
        .catch((err) => {
          console.error(err);
        });
    },

    uncheck(object, changeType) {
      this.loaded = false;
      if (changeType === "uncheckCloseBox") {
        object.sumaEnCierreDeCaja = false;
      } else {
        object.aplicaCierreZ = false;
      }
      GenericService(this.tenant, this.service, this.token)
        .save(object)
        .then(() => {
          this.refreshView();
        })
        .catch((err) => {
          console.error(err);
        });
    },

    refreshView() {
      setTimeout(() => {
        this.filterObjects();
      }, 500);
    },

    onChange(event) {
      this.file = event;
      var excel = [];
      var reader = new FileReader();
      reader.onload = (e) => {
        var data = e.target.result;
        var workbook = XLSX.read(data, { type: "binary" });

        var sheet_name_list = workbook.SheetNames;
        sheet_name_list.forEach(function(y) {
          var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
          if (exceljson.length > 0) {
            for (var i = 0; i < exceljson.length; i++) {
              excel.push(exceljson[i]);
            }
          }
        });
        var prod = this.validateImport(excel);
        if (prod.status) {
          GenericService(this.tenant, this.service, this.token)
            .saveAll(prod.data)
            .then(() => {
              this.filterObjects();
              this.loaderStatus = true;
              window.setTimeout(() => {
                this.loader = false;
                this.loaderStatus = false;
              }, 2000);
            });
        }
      };
      reader.readAsBinaryString(this.file);
    },

    validateImport(mediosPago) {
      var importacion = {
        status: true,
        data: [],
        message: "",
      };
      mediosPago.forEach((element, index) => {
        if (element.nombre) {
          var obj = {
            nombre: element.nombre,
            planPago: this.getPlanesPago(String(element.idPlanes)),
            sucursal: this.loguedUser.sucursal,
          };
          importacion.data.push(obj);
        } else {
          importacion.status = false;
          importacion.message = "Faltan datos en el renglón " + (index + 2);
        }
      });
      return importacion;
    },

    getPlanesPago(d) {
      var plans = [];
      if (this.plans && d) {
        var exp = d.match("-");
        if (exp) {
          var stringIds = d.split("-");
          this.plans.forEach((element) => {
            stringIds.forEach((s) => {
              if (element.id == Number(s)) {
                plans.push(element);
              }
            });
          });
        } else {
          this.plans.forEach((element) => {
            if (element.id == d) {
              plans.push(element);
            }
          });
        }
      }
      return plans;
    },
  },
};
</script>
