<template>
  <v-container>
    <v-form class="mb-3">
      <v-row>
        <v-col cols="12" v-if="perfil < 3">
          <v-btn class="primary ml-1" @click="view = 'listOfProducts'" raised>LISTA</v-btn>
          <v-btn class="primary ml-1" @click="newObject()" raised>NUEVO</v-btn>
          <v-btn class="primary ml-1" @click="view = 'labelPrinting'">GENERAR ETIQUETAS</v-btn>
          <v-btn class="primary ml-1" @click="goPricesManagerView()">MODIFICAR PRECIOS</v-btn>
          <v-btn class="primary ml-1" @click="getReport()" raised
            >REPORTE</v-btn
          >
        </v-col>
      </v-row>
      <v-row>
        <v-col class="mt-2 ml-3" v-if="view == 'labelPrinting'">
          <h2>Seleccion de productos</h2>
        </v-col>
        <v-spacer/>
        <v-col cols="3" v-if="perfil < 3 && view == 'listOfProducts'">
          <v-file-input
            class="mt-3"
            dense
            v-model="file"
            placeholder="Importar productos"
            accept=".xlsx, xls"
            @change="onChange($event)"
          ></v-file-input>
        </v-col>
        <v-col cols="2" v-if="view == 'listOfProducts' && perfil < 3">
          <v-select
            :items="estados"
            v-model="estadoSeleccionado"
            item-text="text"
            :return-object="true"
            outlined
            dense
            @input="filterObjects(filterParams)"
          ></v-select>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.stringParam"
            v-on:input="filterObjects(filterParams)"
            dense
            outlined
            rounded
            class="text-left"
            placeholder="Búsqueda"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="filterParams.thirdStringParam"
            v-on:input="filterObjects(filterParams)"
            dense
            outlined
            rounded
            class="text-left"
            placeholder="Marcas"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-autocomplete
            v-model="filterParams.thirdStringParam"
            v-on:change="filterObjects(filterParams)"
            multiple
            dense
            outlined
            rounded
            class="text-left"
            placeholder="Atributos"
            append-icon="mdi-magnify"
          ></v-autocomplete>
        </v-col>
      </v-row>
    </v-form>
    <v-container v-if="loaded && view === 'listOfProducts'">
      <v-simple-table style="background-color: transparent">
        <template v-slot:default>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Código de barras</th>
              <th>Código de producto</th>
              <th>Atributos</th>
              <th>Marca</th>
              <th>Precio de costo</th>
              <th>Precio de venta</th>
              <th v-if="perfil < 3">Acciones</th>
            </tr>
          </thead>
          <tbody v-for="object in objects" :key="object.id">
            <tr>
              <td>{{ object.nombre }}</td>
              <td>{{ object.codigoBarra }}</td>
              <td>{{ object.codigoProducto }}</td>
              <td>{{ setAtributesValues(object.atributos) }}</td>
              <td>{{ object.marca.nombre }}</td>
              <td>${{ object.costoBruto }}</td>
              <td>${{ object.precioTotal }}</td>
              <td v-if="perfil < 3">
                <a title="Editar"
                  ><img
                    src="/../../images/icons/edit.svg"
                    @click="edit(object.id)"
                    width="30"
                    height="30"
                /></a>
                <a title="Eliminar"
                v-if="object.estado == 1"
                  ><img
                    src="/../../images/icons/delete.svg"
                    @click="deleteObject(object)"
                    width="30"
                    height="30"
                /></a>
                <a title="Eliminar"
                v-if="object.estado != 1"
                  ><img
                    src="/../../images/icons/add.svg"
                    @click="reactivationOfProduct(object)"
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
        @input="filterObjects(filterParams)"
        v-if="filterParams.totalPages > 1 && loaded"
      ></v-pagination>
    </v-container>
    

    <LabelPrinting 
    v-if="view === 'labelPrinting'" 
    :objects="objects" 
    :page="filterParams.page" 
    :totalVisible="filterParams.size" 
    :totalPages="filterParams.totalPages"
    :tenant="tenant"
    :token="token"
    v-on:changePage="changePage"
    v-on:checkProduct="checkProductInList"
    />

    <Spinner v-if="!loaded"/>
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
import LabelPrinting from "../../components/LabelPrinting";
import Spinner from "../../components/Spinner";
import { generateBarCode, roundTwoDecimals, decimalPercent } from "../../helpers/mathHelper";
import { successAlert, questionAlert, infoAlert } from "../../helpers/alerts";
import XLSX from "xlsx";

export default {
  data: () => ({
    icon: "mdi-check-circle",
    view: 'listOfProducts',
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
      thirdLongParam: "",
      fourthLongParam: "",
      stringParam: "",
      secondStringParam: "",
      thirdStringParam: "",
      page: 1,
      size: 10,
      totalPages: 0
    },
    loaded: false,
    tenant: "",
    service: "productos",
    token: localStorage.getItem("token"),
    dialogStock: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    checkImportStatus: 0,
  }),

  components: {
    LabelPrinting,
    Spinner
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.filterObjects(this.filterParams);
    this.getOtherModels(0, 100000);
    this.perfil = this.loguedUser.perfil;
  },

  methods: {
    filterObjects(filterParams) {
      if(this.estadoSeleccionado.id === 1){
        filterParams.doubleParam = 0
      }else{
        filterParams.doubleParam = 2
      }
      GenericService(this.tenant, "productos", this.token)
      .filter(filterParams)
      .then((data) => {
        data.data.content.forEach(el => {
          this.$store.state.productos.products.forEach(e => {
            if(el.codigoBarra == e.codigoBarra){
              el.selected = true;
            }
          })
        })

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

    deleteObject(object) {
      questionAlert('Atención, esta acción deshabilitará el producto en el sistema y el mismo no se mostrará para otras operaciones', 'Desea continuar')
      .then(result => {
        if(result.isConfirmed){
          object.estado = 2;
          GenericService(this.tenant, this.service, this.token)
          .save(object);

          this.filterObjects(this.filterParams);
          this.getOtherModels(0, 100000);
        }
      })
    },

    reactivationOfProduct(object) {
      questionAlert('Atención, esta acción activará el producto en el sistema', 'Desea continuar')
      .then(result => {
        if(result.isConfirmed){
          this.loaded = false;
          object.estado = 1;
          GenericService(this.tenant, this.service, this.token)
          .save(object)
          .then(()=>{
            this.filterObjects(this.filterParams);
            this.getOtherModels(0, 100000);
          })
        }
        
      })

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
              successAlert('Importación exitosa')
              .then(() => {
                if(this.checkImportStatus > 0){
                  infoAlert("Se agregaron nuevos atributos al sistema. Realice nuevamente la importación para asignarlos correctamente");
                }
              })
              this.filterObjects(this.filterParams);
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
      const attributes = Object.entries(element).filter(el => el[0].substring(0,8) === 'atributo');
      const attributesNames = attributes.map(el => {return el[1];});
      let listOfAttributes = [];
      attributesNames.forEach(attributeName => {
        this.atributos.forEach(attribute => {
          if(attributeName && attributeName == attribute.valor){
            listOfAttributes.push(attribute);
          }
          if(attributeName && attributeName == attribute.valorNumerico){
            listOfAttributes.push(attribute);
          }
        })
      })

      listOfAttributes = [...new Set(listOfAttributes)];

      if(listOfAttributes.length === 0){
        this.createNewAtributes(attributesNames);
      }

      return listOfAttributes;
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

    goPricesManagerView(){
      this.$router.push({ name: "precios" });
    },

    setAtributesValues(atributes){
      let str = atributes.reduce((acc, element) => {
        if(element.valor){
          return acc + element.valor + ",";
        }else{
          return acc + element.valorNumerico.toString() + ",";
        }
      }, "");

      return str;
    },

    createNewAtributes(atributeNames){
      atributeNames.forEach(el => {
        let obj = {
          valor: null,
          valorNumerico: null
        }
        if(el && typeof(el) === 'string'){
          obj.valor = el;
        }else{
          if(el){
            obj.valorNumerico = el;
          }
        }
        GenericService(this.tenant, "atributos", this.token)
        .save(obj)
        .then(data => {
          this.atributos.push(data.data);
        })
      })
      this.checkImportStatus += 1;
    }, 

    changePage(data){
      this.filterParams.page = data;
      this.filterObjects(this.filterParams);
    },

    checkProductInList(data){
      this.objects.forEach(product => {
        if(product.id === data.id){
          if(product.selected){
            product.selected = false;
          }else{
            product.selected = true;
          }
        }
      })
    }
  },
};
</script>

