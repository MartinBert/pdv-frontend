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
            placeholder="Importar atributos de texto"
            accept=".xlsx, xls"
            @change="importDocuments($event, 'text')"
          ></v-file-input>
        </v-col>
        <v-col cols="3">
          <v-file-input
            v-model="file"
            class="mt-0"
            placeholder="Importar atributos numéricos"
            accept=".xlsx, xls"
            @change="importDocuments($event, 'number')"
          ></v-file-input>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="3">
          <v-text-field
            v-model="filterParams.atributoValor"
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
    <AtributosTable
      :items="atributos"
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
import Spinner from "../../components/Graphics/Spinner";
import Pagination from "../../components/Pagination";
import AtributosTable from "../../components/Tables/AtributosTable";
import DeleteDialog from "../../components/Dialogs/DeleteDialog";
import { importAttributes } from "../../helpers/importAttributes";
export default {
  data: () => ({
    atributos: [],
    filterParams: {
      atributoValor: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    file: {},
    loaded: false,
    tenant: "",
    service: "atributos",
    token: localStorage.getItem("token"),
    deleteDialogStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
  }),

  components: {
    Spinner,
    Pagination,
    AtributosTable,
    DeleteDialog,
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterObjects();
  },

  methods: {
    filterObjects(page) {
      if(page) this.filterParams.page = page;
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.atributos = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },

    newObject() {
      this.$router.push({ name: "atributosForm", params: { id: 0 } });
    },

    edit(id) {
      this.$router.push({ name: "atributosForm", params: { id: id } });
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

    importDocuments(event, type) {
      importAttributes(event).then((data) => {
        this.saveInDatabase(this.validateImport(data, type));
      });
    },

    saveInDatabase(doc) {
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
          })
          .catch((e) => {
            console.error(e.message);
          });
      }
    },

    validateImport(atributos, type) {
      this.loader = true;
      var importacion = {
        status: true,
        data: [],
        message: "",
      };

      if (type === "text") {
        atributos.forEach((element, index) => {
          if (element.valor) {
            var obj = {
              valor: element.valor,
            };
            importacion.data.push(obj);
          } else {
            importacion.status = false;
            importacion.message = "Faltan datos en el renglón " + (index + 2);
          }
        });
      } else {
        atributos.forEach((element, index) => {
          if (element.valorNumerico) {
            var obj = {
              valorNumerico: element.valorNumerico,
            };
            importacion.data.push(obj);
          } else {
            importacion.status = false;
            importacion.message = "Faltan datos en el renglón " + (index + 2);
          }
        });
      }

      return importacion;
    },
  },
};
</script>
