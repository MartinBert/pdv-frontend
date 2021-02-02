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
            v-model="filterParams.stringParam"
            v-on:input="filterObjects(filterParams.stringParam, filterParams.page - 1, filterParams.size)"
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

    <!-- filterParams -->
    <v-pagination
      v-model="filterParams.page"
      :length="filterParams.totalPages"
      next-icon="mdi-chevron-right"
      prev-icon="mdi-chevron-left"
      :page="filterParams.page"
      :total-visible="8"
      @input="filterObjects(filterParams.stringParam, filterParams.page - 1, filterParams.size)"
      v-if="filterParams.totalPages > 1 && loaded"
    ></v-pagination>
    <!-- End filterParams -->

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
import { generateBarCode, roundTwoDecimals, decimalPercent } from "../../helpers/mathHelper";
import { successAlert } from "../../helpers/alerts";
import XLSX from "xlsx";

export default {
  data: () => ({
    icon: "mdi-check-circle",
    perfil: '',
    loader: false,
    loaderStatus: false,
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
    ivas:[],
    estados: [
      { id: 1, text: "Activos" },
      { id: 2, text: "Inactivos" },
    ],
    estadoSeleccionado: { id: 1, text: "Activos" },
    filterParams: {
      idPerfil: "",
      idSucursal: "",
      stringParam: "",
      page: 1,
      size: 10,
      totalPages: 0
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
    this.filterObjects(this.filterParams.stringParam, this.filterParams.page - 1, this.filterParams.size);
    this.getOtherModels(0, 100000);
    this.perfil = this.loguedUser.perfil;
  },

  methods: {
    filterObjects(stringParam, page, size) {
      GenericService(this.tenant, "productos", this.token)
        .filter({ stringParam, page, size })
        .then((data) => {
          this.objects = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },

    getOtherModels(page, size) {
      const services = ["marcas", "distribuidores", "rubros", "propiedades", "atributos", "ivas"];

      services.forEach(service => {
        GenericService(this.tenant, service, this.token)
        .getAll(page, size)
        .then(data => {
          switch (service) {
            case "marcas":
                this.marcas = data.data.content;
              break;

            case "distribuidores":
                this.distribuidores = data.data.content;
              break;

            case "rubros":
                this.rubros = data.data.content;
              break;

            case "propiedades":
                this.propiedades = data.data.content;
              break;

            case "atributos":
                this.atributos = data.data.content;
              break;
          
            default:
                this.ivas = data.data.content;
              break;
          }
        })
      })
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
      let excel = [];
      let reader = new FileReader();
      reader.onload = (e) => {
        let data = e.target.result;
        let workbook = XLSX.read(data, { type: "binary" });

        let sheet_name_list = workbook.SheetNames;
        sheet_name_list.forEach(function (y) {
          let exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
          if (exceljson.length > 0) {
            for (let i = 0; i < exceljson.length; i++) {
              excel.push(exceljson[i]);
            }
          }
        });
        let prod = this.validateImport(excel);
        console.log(prod);
        if (prod.status) {
          GenericService(this.tenant, this.service, this.token)
            .saveAll(prod.data)
            .then(() => {
              successAlert('Importación exitosa');
              this.filterObjects(this.filterParams.stringParam, this.filterParams.page - 1, this.filterParams.size);
              this.loaderStatus = true;
              this.loaded = true;
            });
        }
      };
      reader.readAsBinaryString(this.file);
    },

    validateImport(objects) {
      let importacion = {
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

          let ivaComp = this.getIva(element.idIvaCompras).porcentaje;
          let ganancia = element.ganancia / 100;
          let obj = {
            nombre: element.nombre,
            codigoBarra: String(element.codigoBarra),
            codigoProducto: String(element.codigoProducto),
            marca: this.getMarca(element.marca),
            rubro: this.getRubro(element.rubro),
            propiedades: this.getPropiedades(element.propiedades),
            atributos: this.getAtributos(element),
            distribuidores: this.getDistribuidores(element.idDistribuidores),
            ivaComprasObject: this.getIva(element.idIvaCompras),
            ivaVentasObject: this.getIva(element.idIvaVentas),
            precioCosto: roundTwoDecimals(element.precioTotal / (1 + ganancia) / (1 + decimalPercent(ivaComp))),
            costoNeto: roundTwoDecimals(element.precioTotal / (1 + ganancia) / (1 + decimalPercent(ivaComp)) / (1 + decimalPercent(ivaComp))),
            costoBruto: roundTwoDecimals(element.precioTotal / (1 + ganancia) / (1 + decimalPercent(ivaComp))),
            ivaCompra: roundTwoDecimals(element.precioTotal / (1 + ganancia) / (1 + decimalPercent(ivaComp)) - element.precioTotal / (1 + ganancia) / (1 + ivaComp) / (1 + ivaComp)),
            ganancia: element.ganancia,
            precioSinIva: roundTwoDecimals(element.precioTotal / (1 + ivaComp)),
            ivaVenta: roundTwoDecimals(element.precioTotal - element.precioTotal / (1 + decimalPercent(ivaComp))),
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

    getMarca(str) {
      const marca = this.marcas.filter(el => el.nombre.toLowerCase() === str.toLowerCase())[0];
      if(marca){
        return marca;
      }else{
        GenericService(this.tenant, 'marcas', this.token)
        .save({nombre: str})
        .then(data =>{
          this.marcas.push(data.data);
          return data.data;
        })
      }
    },

    getRubro(str) {
      const rubro = this.rubros.filter(el => el.nombre.toLowerCase() === str.toLowerCase())[0];
      if(rubro){
        return rubro;
      }else{
        GenericService(this.tenant, 'rubros', this.token)
        .save({nombre: str})
        .then(data =>{
          this.rubros.push(data.data);
          return data.data;
        })
      }
    },

    getPropiedades(propiedades){
      propiedades = propiedades.split(',');
      let propiedadesArray = [];
      
      propiedades.forEach(el => {
        this.propiedades.forEach(e => {
          if(el == e.id){
            propiedadesArray.push(e);
          }
        })
      })
      
      return propiedadesArray;
    },

    getAtributos(element){
      const atributes = Object.entries(element).filter(el => el[0].substring(0,8) === 'atributo');
      const atributesName = atributes.map(el => {return el[1];});
      let atributesArray = [];
      atributesName.forEach(el => {
        this.atributos.forEach(e => {
          if(el == e.valor || el == e.valorNumerico){
            atributesArray.push(e);
          }
        })
      })

      return atributesArray;
        
    },

    getIva(id){
      return this.ivas.filter(el => el.id === id)[0];
    },

    getDistribuidores(distribuidores) {
      if(distribuidores.length > 1){
        distribuidores = distribuidores.split(",");
        let distribuidoresArray = [];

        distribuidores.forEach(el => {
          this.distribuidores.forEach(e => {
            if(el == e.id){
              distribuidoresArray.push(e);
            }
          })
        });

        return distribuidoresArray;
      }else{
        return this.distribuidores.filter(el => el.id === distribuidores);
      }
    },

    getReport() {
      ReportsService(this.tenant, this.service, this.token)
        .listAllProducts()
        .then((res) => {
          let file = new Blob([res["data"]], { type: "application/pdf" });
          let fileURL = URL.createObjectURL(file);
          window.open(fileURL, "_blank");
        });
    },

    evalPropertie(propertie, atribute){
      console.log(propertie, atribute);
    }
  },
};
</script>