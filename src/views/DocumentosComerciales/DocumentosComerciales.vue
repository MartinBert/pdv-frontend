<template>
  <v-container>
    <v-form class="mb-3">
      <v-row>
        <v-col cols="1">
          <v-btn class="primary" @click="newObject()" raised>Nuevo</v-btn>
        </v-col>
        <v-col cols="3">
          <v-file-input
            v-model="file"
            class="mt-0"
            placeholder="Importar documentos"
            accept=".xlsx, xls"
            @change="importDocuments($event)"
          ></v-file-input>
        </v-col>
        <v-col cols="4"></v-col>
        <v-col cols="3">
          <v-text-field
            v-model="filterParams.documentoComercialName"
            v-on:input="filterObjects()"
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
    <DocumentosComercialesTable
      :items="documentosComerciales"
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
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import DocumentosComercialesTable from "../../components/Tables/DocumentosComercialesTable";
import DeleteDialog from "../../components/Dialogs/DeleteDialog";
import Spinner from "../../components/Graphics/Spinner";
import Pagination from "../../components/Pagination";
import XLSX from "xlsx";
export default {
  data: () => ({
    documentosComerciales: [],
    file: null,
    filterParams: {
      documentoComercialName: "",
      sucursalId: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "documentosComerciales",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
  }),

  components: {
    DocumentosComercialesTable,
    Pagination,
    Spinner,
    DeleteDialog,
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
      if(page) this.filterParams.page = page;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.documentosComerciales = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },

    newObject() {
      this.$router.push({
        name: "documentosComercialesForm",
        params: { id: 0 },
      });
    },

    edit(id) {
      this.$router.push({
        name: "documentosComercialesForm",
        params: { id: id },
      });
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
        sheet_name_list.forEach(function (y) {
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

    validateImport(documentosComerciales) {
      this.loader = true;
      var importacion = {
        status: true,
        data: [],
        message: "",
      };
      documentosComerciales.forEach((element, index) => {
        if (
          element.nombre &&
          element.codigoDocumento &&
          element.tipo &&
          element.letra &&
          element.ivaCat
        ) {
          var obj = {
            nombre: element.nombre,
            codigoDocumento: String(element.codigoDocumento),
            tipo: Boolean(element.tipo),
            ivaCat: element.ivaCat,
            letra: String(element.letra),
            activo: true,
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