<template>
  <v-dialog v-model="$store.state.receipt.receiptDialog">
    <v-card>
      <form @submit.prevent="handleSubmit()">
        <v-card-title>
          <span class="ml-5">
            Ingrese la información del comprobante
          </span>
        </v-card-title>
        <v-card-text>
          <v-container>
              <v-row class="ma-5">
                <v-col cols="6">
                  <v-autocomplete
                    @change="
                      getComercialDocuments(
                        dialogObject.cliente.condicionIva.documentos,
                        loguedUser.empresa.condicionIva.documentos
                      )
                    "
                    v-model="dialogObject.cliente"
                    :items="databaseItems.clientes"
                    item-text="razonSocial"
                    :return-object="true"
                    placeholder="Seleccione un cliente"
                    required
                  ></v-autocomplete>
                </v-col>
                <v-col cols="6">
                  <v-autocomplete
                    @input="filterObjects(loguedUser.sucursal.id, filterString, paginate.page - 1, paginate.size)"
                    class="button-ventas comprobante"
                    v-model="dialogObject.documento"
                    :items="databaseItems.documentos"
                    item-text="nombre"
                    :return-object="true"
                    placeholder="Seleccione un tipo de comprobante"
                    required
                  ></v-autocomplete>
                </v-col>
                <v-col cols="6">
                  <v-autocomplete
                    class="button-ventas medio-pago"
                    @change="getPaymentPlans(dialogObject.mediosPago)"
                    v-model="dialogObject.mediosPago"
                    :items="databaseItems.medios_de_pago"
                    item-text="nombre"
                    :return-object="true"
                    placeholder="Seleccione un medio de pago"
                    required
                  ></v-autocomplete>
                </v-col>
                <v-col cols="6">
                  <v-autocomplete
                    required
                    class="button-ventas plan-pago"
                    v-model="dialogObject.planPago"
                    :items="databaseItems.planes"
                    item-text="nombre"
                    :return-object="true"
                    placeholder="Seleccione un plan de pago"
                  ></v-autocomplete>
                </v-col>
                <v-col></v-col>
                <v-col>
                  <v-text-field
                    placeholder="Ingrese el monto de la operación"
                    type="number"
                    v-model="dialogObject.totalVenta"
                    required
                  ></v-text-field>
                </v-col>
                <v-col></v-col>
              </v-row>
              <v-row v-if="dialogObject.documento.tipo === true">
                <v-col cols="12" class="ml-5 text-center">
                  <span class="title">
                    Seleccione un comprobante asociado a "{{dialogObject.documento.nombre}}"
                  </span>
                </v-col>
                <v-col class="d-flex">
                  <v-text-field
                    type="date"
                    v-model="filterString"
                    v-on:input="filterObjects(loguedUser.sucursal.id, filterString, paginate.page - 1, paginate.size)"
                    dense
                    outlined
                    rounded
                    class="text-left"
                    append-icon="mdi-magnify"
                  ></v-text-field>
                  <v-text-field
                    type="number"
                    v-model="filterDouble"
                    v-on:input="filterObjects(loguedUser.sucursal.id, filterDouble, paginate.page - 1, paginate.size)"
                    dense
                    outlined
                    rounded
                    class="text-left"
                    placeholder="Búsqueda por total facturado"
                    append-icon="mdi-magnify"
                  ></v-text-field>
                </v-col>
                  <v-col cols="12">
                  <v-simple-table style="background-color: transparent" ref="tab">
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">Fecha de emisión</th>
                          <th class="text-left">Número de comprobante</th>
                          <th class="text-left">Tipo</th>
                          <th class="text-left">Total facturado</th>
                          <th class="text-left">Productos relacionados</th>
                          <th class="text-left">Agregar</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="c in comprobantes" :key="c.id">
                          <td>{{ c.fechaEmision }}</td>
                          <td>{{ c.numeroCbte }}</td>
                          <td>{{ c.nombreDocumento }}</td>
                          <td>{{ c.totalVenta }}</td>
                          <td>
                            <button type="button">
                              <img
                                src="/../../images/icons/eye.svg"
                                @click="seeDetail(c)"
                                width="40"
                                height="40"
                              />
                            </button>
                          </td>
                          <td>
                            <button type="button" v-if="!c.selected">
                              <img
                                src="/../../images/icons/add.svg"
                                @click="addRelationateReceipt(c)"
                                width="40"
                                height="40"
                              />
                            </button>
                            <button type="button" v-if="c.selected === true">
                              <img
                                src="/../../images/icons/success.svg"
                                @click="remove(c)"
                                width="40"
                                height="40"
                              />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                  <v-pagination
                      v-model="paginate.page"
                      :length="paginate.totalPages"
                      next-icon="mdi-chevron-right"
                      prev-icon="mdi-chevron-left"
                      :page="paginate.page"
                      :total-visible="8"
                      @input="changePage(paginate.page - 1, paginate.size)"
                  ></v-pagination>
                </v-col>
              </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-col cols="12">
            <v-btn class="success ml-5" type="submit">AGREGAR COMPROBANTE</v-btn>
          </v-col>
        </v-card-actions>
      </form>
      <v-dialog v-if="activeDetailDialog" v-model="activeDetailDialog" width="800px" @input="activeDetailDialog = false">
        <v-card>
          <v-card-title>
            <span class="title text-center">Productos</span>
          </v-card-title>
          <v-card-text>
            <v-simple-table>
              <template>
                <thead>
                  <tr>
                    <th class="text-left">Nombre</th>
                    <th class="text-left">Cantidad de unidades</th>
                    <th class="text-left">Precio Unitario</th>
                    <th class="text-left">Precio Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="p in detailRelationateReceipt" :key="p.nombre">
                    <td>{{ p.nombre }}</td>
                    <td>{{ p.cantUnidades }}</td>
                    <td>{{ p.precioUnitario }}</td>
                    <td>{{ p.precioTotal }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-col class="text-center">
              <span class="title">Total: ${{totalDetail}}</span>
            </v-col>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card>
  </v-dialog>
</template>
<script>
import GenericService from "../services/GenericService";
import { errorAlert } from "../helpers/alerts";
import { checkDocuments } from "../helpers/processObjectsHelper";
import { formatDate } from "../helpers/dateHelper";

export default {
  name: "ReceiptDialog",

  data() {
    return {
      paginate: {
        page: 1,
        size: 5,
        totalPages: 0
      },
      loguedUser: null,
      tenant: null,
      token: localStorage.getItem("token"),
      dialogObject: {
        cliente: "",
        documento: "",
        mediosPago: "",
        planPago: "",
        totalVenta: "",
        comprobanteAsociado: ""
      },
      filterString: "",
      filterDouble: "",
      activeDetailDialog: false,
      detailRelationateReceipt: null,
      comprobantes: [],
      databaseItems: {
        clientes: [],
        documentos: [],
        medios_de_pago: [],
        planes: [],
      },
    };
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.getAllObjects();
  },

  computed: {
    totalDetail(){
      return this.detailRelationateReceipt.reduce((acc, el) => acc + el.precioTotal, 0);
    }
  },

  methods: {
    getAllObjects() {
      GenericService(this.tenant, this.service, this.token)
        .getLoguedUser()
        .then((data) => {
          this.loguedUser = data.data;
          let id;
          if(this.loguedUser.perfil.id < 3){
            id = ""
          }else{
            id = this.loguedUser.sucursal.id;
          }

          const filterParam = {id, param: "", page: 0, size: 100000}

          GenericService(this.tenant, "clientes", this.token)
            .filter(filterParam)
            .then((data) => {
              this.databaseItems.clientes = data.data.content;
            });

          GenericService(this.tenant, "mediosPago", this.token)
            .filter(filterParam)
            .then((data) => {
              this.databaseItems.medios_de_pago = data.data.content;
            });
        });
    },

    getPaymentPlans(id) {
      this.databaseItems.planes = id.planPago;
    },

    getComercialDocuments(clientDocs, businessDocs) {
      let documentos = [];
      for (let i = 0; i < clientDocs.length; i++) {
        businessDocs.forEach((el) => {
          if (clientDocs[i].id == el.id) {
            documentos.push(el);
          }
        });
      }

      const notas = checkDocuments(documentos);
      return (this.databaseItems.documentos = notas);
    },

    handleSubmit(){
      if(this.dialogObject.documento.tipo === false){
        this.$store.commit('receipt/addReceipt', this.dialogObject);
        this.$emit('receipt', this.$store.state.receipt.receipt);
        this.$store.commit('receipt/receiptDialogMutation');
      }else{
        if(!this.dialogObject.comprobanteAsociado){
          errorAlert('Si emite un comprobante fiscal debe seleccionar un documento fiscal relacionado');
        }else{
          this.$store.commit('receipt/addReceipt', this.dialogObject);
          this.$emit('receipt', this.$store.state.receipt.receipt);
          this.$store.commit('receipt/receiptDialogMutation');
        }
      }
    },

    seeDetail(receipt){
      this.detailRelationateReceipt = receipt.productos;
      this.activeDetailDialog = true;
    },

    addRelationateReceipt(comprobante){
      const check = this.comprobantes.filter(el => el.selected === true);
      if(check.length > 0){
        this.comprobantes.filter(el => el.id === check[0].id)[0].selected = false;
      }
      this.dialogObject.comprobanteAsociado = comprobante;
      this.comprobantes.filter(el => el.id === comprobante.id)[0].selected = true;
      this.$refs.tab.$forceUpdate();
    },

    remove(comprobante){
      this.comprobantes.filter(el => el.id === comprobante.id)[0].selected = false;
      this.dialogObject.comprobanteAsociado = [];
      this.$refs.tab.$forceUpdate();
    },

    filterObjects(id, param, page, size){
      let filterParam;
      if(this.filterString === param){
        this.filterDouble = "";
        param = formatDate(param);
        if(param === "//"){
          param = "";
        }
        filterParam = {id, param, page, size};
      }else{
        this.filterString = "";
        filterParam = {id, doubleParam: param, page, size};
      }
      GenericService(this.tenant, "ventas", this.token)
        .filter(filterParam)
        .then(data => {
          this.comprobantes = data.data.content;
          this.paginate.totalPages = data.data.totalPages;
          if(this.paginate.totalPages < this.paginate.page){
              this.paginate.page = 1;
          }
        });
    },

    changePage(page, size){
      const id = this.loguedUser.sucursal.id;
      if(this.filterString || this.filterDouble){
        if(this.filterString){
          this.filterObjects(id, this.filterString, page, size);
        }else{
          this.filterObjects(id, this.filterDouble, page, size);
        }
      }else{
        this.filterObjects(id, "", page, size);
      }

    }
  },
};
</script>
