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

    <!-- List -->
    <v-container v-if="loaded">
      <v-simple-table style="background-color: transparent" >
        <template v-slot:default>
          <thead>
            <tr>
              <th>ID</th>
              <th>Valor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody v-for="object in objects" :key="object.id">
            <tr>
              <td>{{ object.id }}</td>
              <td>
                <span v-if="object.valor">{{ object.valor }}</span>
                <span v-if="object.valorNumerico">{{object.valorNumerico}}</span>
              </td>
              <td>
                <a title="Editar"
                  ><img
                    src="/../../images/icons/edit.svg"
                    @click="edit(object.id)"
                    width="30"
                    height="30"
                /></a>
                <a title="Eliminar"
                  ><img
                    src="/../../images/icons/delete.svg"
                    @click="openDelete(object.id)"
                    width="30"
                    height="30"
                /></a>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-pagination
        v-model="filterParams.page"
        :length="filterParams.totalPages"
        next-icon="mdi-chevron-right"
        prev-icon="mdi-chevron-left"
        :page="filterParams.page"
        :total-visible="8"
        @input="filterObjects()"
        v-if="filterParams.totalPages > 1"
      ></v-pagination>
    </v-container>
    
    <Spinner v-if="!loaded"/>

    <v-dialog v-model="dialogDeleteObject" width="500">
      <v-card>
        <v-toolbar class="d-flex justify-center" color="primary" dark>
          <v-toolbar-title>Eliminar objeto</v-toolbar-title>
        </v-toolbar>
        <v-card-title class="d-flex justify-center"
          >¿Está seguro que desea realizar esta acción?</v-card-title
        >
        <v-card-actions class="d-flex justify-center pb-4">
          <v-btn small color="disabled" class="mr-5" @click="deleteObject"
            >Si</v-btn
          >
          <v-btn small color="disabled" @click="dialogDeleteObject = false"
            >No</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import GenericService from "../../services/GenericService";
import Spinner from '../../components/Spinner';
import XLSX from 'xlsx';

export default {
  data: () => ({
    objects: [],
    filterParams: {
      atributoValor: "",
      page: 1,
      size: 10,
      totalPages: 0
    },
    file: {},
    loaded: false,
    tenant: "",
    service: "atributos",
    token: localStorage.getItem("token"),
    dialogDeleteObject: false,
    loguedUser: JSON.parse(localStorage.getItem("userData"))
  }),

  components:{
    Spinner
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterObjects()
  },

  methods: {
    filterObjects() {
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.objects = data.data.content;
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

    openDelete(id) {
      this.idObjet = id;
      this.dialogDeleteObject = true;
    },

    deleteObject() {
      this.dialog = true;
      this.dialogDeleteObject = false;
      GenericService(this.tenant, this.service, this.token)
        .delete(this.idObjet)
        .then(() => {
          this.filterObjects();
        });
    },

    importDocuments(event, type) {
      this.file = event;
      var excel = [];
      var reader = new FileReader();
      reader.onload = e => {
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
        var doc = this.validateImport(excel, type);
        if (doc.status) {
          GenericService(this.tenant, this.service, this.token)
            .saveAll(doc.data)
            .then(() => {
              this.filterObjects();
              this.loaderStatus = true;
              window.setTimeout(()=>{
                this.loader = false
                this.loaderStatus=false;
              }, 2000);              
            });
        }
      };
      reader.readAsBinaryString(this.file);
    },

    validateImport(objects, type) {
      this.loader = true;
      var importacion = {
        status: true,
        data: [],
        message: ""
      };

      if(type === 'text'){
        objects.forEach((element, index) => {
          if (
            element.valor 
          ) {
            var obj = {
              valor: element.valor,
            };
            importacion.data.push(obj);
          } else {
            importacion.status = false;
            importacion.message = "Faltan datos en el renglón " + (index + 2);
          }
        });

      }else{
        objects.forEach((element, index) => {
          if (
            element.valorNumerico 
          ) {
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
    }
  },
};
</script>
