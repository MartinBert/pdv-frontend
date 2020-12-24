<template>
  <v-container>
    <v-form class="mb-3">
      <v-row>
        <v-col cols="4" v-if="perfil < 3">
          <v-btn class="primary" @click="newObject()" raised>Nuevo</v-btn>
          <v-btn class="primary ml-3" @click="getReport()" raised
            >Reportes</v-btn
          >
        </v-col>
        <v-col cols="3" v-if="perfil < 3">
          <v-file-input
            v-model="file"
            class="mt-0"
            placeholder="Importar productos"
            accept=".xlsx, xls"
            @change="onChange($event)"
          ></v-file-input>
        </v-col>
        <v-col cols="2">
          <v-select
            :items="estados"
            v-model="estadoSeleccionado"
            item-text="text"
            item-value="id"
            outlined
            dense
          ></v-select>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="3">
          <v-text-field
            v-model="filterString"
            v-on:input="filterObjects(filterString, paginate.page - 1, paginate.size)"
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
    <v-simple-table style="background-color: transparent" v-if="loaded">
      <template v-slot:default>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Código de barras</th>
            <th>Código de producto</th>
            <th>Marca</th>
            <th>Precio de costo</th>
            <th>Precio de venta</th>
            <th v-if="perfil < 3">Acciones</th>
          </tr>
        </thead>
        <tbody v-for="object in objects" :key="object.id">
          <tr>
            <td>{{ object.id }}</td>
            <td>{{ object.nombre }}</td>
            <td>{{ object.codigoBarra }}</td>
            <td>{{ object.codigoProducto }}</td>
            <td>{{ object.marca ? object.marca.nombre : "Sin marca" }}</td>
            <td>${{ object.precioCosto }}</td>
            <td>${{ object.precioTotal }}</td>
            <td v-if="perfil < 3">
              <a title="Editar"
                ><img
                  src="/../../images/icons/ico_10.svg"
                  @click="edit(object.id)"
                  width="40"
                  height="40"
              /></a>
              <a title="Eliminar"
                ><img
                  src="/../../images/icons/ico_11.svg"
                  @click="openDelete(object.id)"
                  width="40"
                  height="40"
              /></a>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <!-- End List -->

    <!-- Loader -->
    <div class="text-center" style="margin-top: 15px" v-if="!loaded">
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
      @input="filterObjects(filterString, paginate.page - 1, paginate.size)"
      v-if="paginate.totalPages > 1 && loaded"
    ></v-pagination>
    <!-- End Paginate -->

    <!-- Dialog Delete-->
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
    <!-- End Dialog Delete -->

    <!-- Dialog Loader -->
    <template>
      <v-dialog
        v-model="loader"
        hide-overlay
        persistent
        width="400"
        v-if="loaderStatus == false"
      >
        <v-card color="primary" dark>
          <v-card-text>
            Importando productos...
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="loader"
        v-if="loaderStatus == true"
        hide-overlay
        persistent
        width="400"
      >
        <v-card color="primary">
          <v-list-item>
            <v-list-item-content justify="center" align="center">
              <v-icon x-large color="success">{{ this.icon }}</v-icon>
              <v-card-text class="title">¡Importación finalizada!</v-card-text>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-dialog>
    </template>
    <!-- End Dialog Loader -->
  </v-container>
</template>

<script>
import GenericService from "../../services/GenericService";
import ReportsService from "../../services/ReportsService";
import { generateBarCode } from "../../helpers/mathHelper";
// import { successAlert } from "../../helpers/alerts";
import XLSX from "xlsx";

export default {
  data: () => ({
    icon: "mdi-check-circle",
    perfil: '',
    loader: false,
    loaderStatus: false,
    filterString: "",
    file: null,
    object: null,
    stock: [],
    objects: [],
    marcas: [],
    distribuidores: [],
    depositos: [],
    rubros: [],
    propiedades: [],
    atributos: [],
    estados: [
      { id: 1, text: "Activos" },
      { id: 2, text: "Inactivos" },
    ],
    estadoSeleccionado: { id: 1, text: "Activos" },
    paginate: {
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "productos",
    token: localStorage.getItem("token"),
    dialogStock: false,
    dialogDeleteObject: false,
    loguedUser: JSON.parse(localStorage.getItem("userData"))
  }),

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterObjects(this.filterString, this.paginate.page - 1, this.paginate.size);
    this.getOtherModels(0, 100000);
    this.perfil = this.loguedUser.perfil;
  },

  methods: {
    filterObjects(param, page, size) {
      GenericService(this.tenant, "productos", this.token)
        .filter({ param, page, size })
        .then((data) => {
          this.objects = data.data.content;
          this.paginate.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },

    getOtherModels(page, size) {
      GenericService(this.tenant, "marcas", this.token)
        .getAll(page, size)
        .then((data) => {
          this.marcas = data.data.content;
        });

      GenericService(this.tenant, "distribuidores", this.token)
        .getAll(page, size)
        .then((data) => {
          this.distribuidores = data.data.content;
        });

      GenericService(this.tenant, "rubros", this.token)
        .getAll(page, size)
        .then((data) => {
          this.rubros = data.data.content;
        });

      GenericService(this.tenant, "propiedades", this.token)
        .getAll(page, size)
        .then((data) => {
          this.propiedades = data.data.content;
        });

      GenericService(this.tenant, "atributos", this.token)
        .getAll(page, size)
        .then((data) => {
          this.atributos = data.data.content;
        });
    },

    newObject() {
      this.$router.push({ name: "productosForm", params: { id: 0 } });
    },

    edit(id) {
      this.$router.push({ name: "productosForm", params: { id: id } });
    },

    openDelete(id) {
      this.idObjet = id;
      this.dialogDeleteObject = true;
    },

    deleteObject() {
      this.dialog = true;
      this.dialogDeleteObject = false;
      GenericService(this.tenant, this.service, this.token).disable(
        this.idObjet,
        this.objects
      );
    },

    //Load excel

    findFile() {
      this.$refs.uploader.click();
    },

    //Importar productos
    onChange(event) {
      this.loaderStatus = false;
      this.loaded = false;
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
        var prod = this.validateImport(excel);
        console.log(prod);
        // if (prod.status) {
        //   GenericService(this.tenant, this.service, this.token)
        //     .saveAll(prod.data)
        //     .then(() => {
        //       successAlert('Importación exitosa');
        //       this.getAll(this.paginate.page - 1, this.paginate.size);
        //       this.loaderStatus = true;
        //       this.loaded = true;
        //     });
        // }
      };
      reader.readAsBinaryString(this.file);
    },

    validateImport(objects) {
      var importacion = {
        status: true,
        data: [],
        message: "",
      };
      objects.forEach((element, index) => {
        if (
          element.nombre &&
          element.codigoBarra &&
          element.codigoProducto &&
          element.ganancia &&
          element.precioTotal
        ) {
          if (element.codigoBarra == 1) {
            element.codigoBarra = generateBarCode();
          }
          var iva = 21 / 100;
          var ganancia = element.ganancia / 100;
          var obj = {
            nombre: element.nombre,
            codigoBarra: String(element.codigoBarra),
            codigoProducto: String(element.codigoProducto),
            marca: this.getMarca(element.idMarca),
            rubro: this.getRubro(element.idRubro),
            propiedad: this.getPropiedades(element.propiedades),
            atributos: this.getAtributos(element),
            distribuidores: this.getDistribuidores(
              String(element.idDistribuidores)
            ),
            precioCosto: (
              element.precioTotal /
              (1 + ganancia) /
              (1 + iva)
            ).toFixed(2),
            costoNeto: (
              element.precioTotal /
              (1 + ganancia) /
              (1 + iva) /
              (1 + iva)
            ).toFixed(2),
            costoBruto: (
              element.precioTotal /
              (1 + ganancia) /
              (1 + iva)
            ).toFixed(2),
            ivaCompra: (
              element.precioTotal / (1 + ganancia) / (1 + iva) -
              element.precioTotal / (1 + ganancia) / (1 + iva) / (1 + iva)
            ).toFixed(2),
            ganancia: element.ganancia,
            precioSinIva: (element.precioTotal / (1 + iva)).toFixed(2),
            ivaVenta: (
              element.precioTotal -
              element.precioTotal / (1 + iva)
            ).toFixed(2),
            precioTotal: element.precioTotal,
            estado: 1,
          };
          importacion.data.push(obj);
        } else {
          importacion.status = false;
          importacion.message = "Faltan datos en el renglón " + (index + 2);
        }
      });
      return importacion;
    },

    getMarca(id) {
      var marca = null;
      if (this.marcas && id) {
        this.marcas.forEach((element) => {
          if (element.id == id) {
            marca = element;
          }
        });
      }
      return marca;
    },

    getRubro(id) {
      var rubro = null;
      if (this.rubros && id) {
        this.rubros.forEach((element) => {
          if (element.id == id) {
            rubro = element;
          }
        });
      }
      return rubro;
    },

    getPropiedades(){
      // const propertiesKeys = propiedades.split('-');
      
    },

    getAtributos(element){
      const ArrayAtributes = Object.entries(element).filter(el => el[0].substring(0,8) === 'atributo');
      // let newAtributes = [];

      ArrayAtributes.forEach(el => {
        const atributeIdInExcel = el[0];
        const atributeValueInExcel = el[1];
        const propertieId = atributeIdInExcel.substring(8);
        const propertie = this.propiedades.filter(el => el.id == propertieId)[0];
        if(this.evalPropertie(propertie, atributeValueInExcel)){
          console.log('Sel prro')
        }else{
          console.log(this.evalPropertie(propertie, atributeValueInExcel));
        }
        // const newAtribute = {
        //   valor: atributeValueInExcel,
        //   valorNumerico: 0
        // }

        // newAtributes.push(newAtribute);
      })

      // console.log(newAtributes);
    },

    getDistribuidores(d) {
      var distribuidores = [];
      if (this.distribuidores && d) {
        var exp = d.match("-");
        if (exp) {
          var stringIds = d.split("-");
          this.distribuidores.forEach((element) => {
            stringIds.forEach((s) => {
              if (element.id == Number(s)) {
                distribuidores.push(element);
              }
            });
          });
        } else {
          this.distribuidores.forEach((element) => {
            if (element.id == d) {
              distribuidores.push(element);
            }
          });
        }
      }
      return distribuidores;
    },

    getReport() {
      ReportsService(this.tenant, this.service, this.token)
        .listAllProducts()
        .then((res) => {
          var file = new Blob([res["data"]], { type: "application/pdf" });
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL, "_blank");
        });
    },

    evalPropertie(propertie, atribute){
      console.log(atribute);
    }
  },
};
</script>