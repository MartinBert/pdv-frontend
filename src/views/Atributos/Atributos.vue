<template>
  <v-container style="min-width: 98%;
  margin-right:40px;
  ">
    <v-card>
      <AtributosTable
        :items="atributos"
        v-on:editItem="edit"
        v-on:deleteItem="deleteItem"
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
import Spinner from "../../components/Graphics/Spinner";
import AtributosTable from "../../components/Tables/AtributosTable";
import DeleteDialog from "../../components/Dialogs/DeleteDialog";
import { importAttributes } from "../../helpers/importAttributes";
export default {
  data: () => ({
    atributos: [],
    filterParams: {
      atributoValor: "",
      estado:true,
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
    AtributosTable,
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
          this.atributos = data.data.content;
          console.log(this.atributos);
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
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
      this.loaded = false;
      this.deleteDialogStatus = false;
      GenericService(this.tenant, this.service, this.token)
        .delete(this.idObjet)
        .then(() => {
          this.filterObjects();
        })
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
