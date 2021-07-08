<template>
  <v-container style="min-width: 98%;
   margin-right: 40px;
  ">
    <v-card>
      <RubrosTable
        :items="rubros"
        v-on:editItem="edit"
        v-on:deleteItem="deleteItem"
        v-if="loaded"
      />
      <Pagination
        :page="filterParams.page"
        :totalPages="filterParams.totalPages"
        :totalVisible="7"
        v-on:changePage="filterObjects"
        v-if="loaded"
      />
      <Spinner v-if="!loaded" />
      <DeleteDialog
        :status="deleteDialogStatus"
        v-on:deleteConfirmation="deleteConfirmation"
      />
    </v-card>
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import RubrosTable from "../../components/Tables/RubrosTable";
import Pagination from "../../components/Pagination";
import Spinner from "../../components/Graphics/Spinner";
import DeleteDialog from "../../components/Dialogs/DeleteDialog";
import XLSX from "xlsx";
export default {
  data: () => ({
    rubros: [],
    file: null,
    filterParams: {
      rubroName: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "rubros",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
  }),

  components: {
    RubrosTable,
    Pagination,
    Spinner,
    DeleteDialog,
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterObjects();
  },

  methods: {
    filterObjects(page) {
      if (page) this.filterParams.page = page;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.rubros = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },
    edit(id) {
      this.$router.push({ name: "rubrosForm", params: { id: id } });
    },

    deleteItem(id) {
      this.idObjet = id;
      this.deleteDialogStatus = true;
    },

    deleteConfirmation(result) {
      return result ? this.deleteObject() : (this.deleteDialogStatus = false);
    },

    deleteObject() {
      this.deleteDialogStatus = false;
      GenericService(this.tenant, this.service, this.token)
        .delete(this.idObjet)
        .then(() => {
          this.filterObjects();
        })
        .catch(() => {
          this.$errorAlert(
            "El registro se encuentra asociado a otros elementos en el sistema"
          );
        });
    },

    importDocuments(event) {
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
        var doc = this.validateImport(excel);
        if (doc.status) {
          GenericService(this.tenant, this.service, this.token)
            .saveAll(doc.data)
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

    validateImport(rubros) {
      this.loader = true;
      var importacion = {
        status: true,
        data: [],
        message: "",
      };
      rubros.forEach((element, index) => {
        if (element.nombre) {
          var obj = {
            nombre: element.nombre,
          };
          importacion.data.push(obj);
        } else {
          importacion.status = false;
          importacion.message = "Faltan datos en el renglón " + (index + 2);
        }
      });
      return importacion;
    },
  },
};
</script>
