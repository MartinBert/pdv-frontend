<template>
  <v-dialog v-model="$store.state.receipt.receiptDialog">
    <v-card color="var(--main-bg-color)">
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
                        loguedUser.sucursal.condicionIva.documentos
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
                    @input="filterObjects()"
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
                    type="text"
                    v-model="filterParams.ventas.fechaEmision"
                    v-on:input="filterObjects()"
                    dense
                    outlined
                    rounded
                    label="Fecha"
                    append-icon="mdi-magnify"
                  ></v-text-field>
                  <v-text-field
                    type="text"
                    v-model="filterParams.ventas.numeroComprobante"
                    v-on:input="filterObjects()"
                    dense
                    outlined
                    rounded
                    label="Número de comprobante"
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
                                src="/../../images/icons/details.svg"
                                @click="seeDetail(c)"
                                width="30"
                                height="30"
                              />
                            </button>
                          </td>
                          <td>
                            <button type="button" v-if="!c.selected">
                              <img
                                src="/../../images/icons/add.svg"
                                @click="addRelationateReceipt(c)"
                                width="30"
                                height="30"
                              />
                            </button>
                            <button type="button" v-if="c.selected === true">
                              <img
                                src="/../../images/icons/success.svg"
                                @click="remove(c)"
                                width="30"
                                height="30"
                              />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                  <v-pagination
                      v-model="filterParams.ventas.page"
                      :length="filterParams.ventas.totalPages"
                      next-icon="mdi-chevron-right"
                      prev-icon="mdi-chevron-left"
                      :page="filterParams.ventas.page"
                      :total-visible="8"
                      @input="filterObjects()"
                  ></v-pagination>
                </v-col>
              </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-col cols="12">
            <v-btn class="primary ml-5" type="submit">AGREGAR COMPROBANTE</v-btn>
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
import GenericService from "../../services/GenericService";
import { checkIfNote } from "../../helpers/processObjectsHelper";

export default {
  data() {
    return {
      loguedUser: JSON.parse(localStorage.getItem("userData")),
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
      filterParams:{
        ventas:{
          sucursalId: "",
          fechaEmision: "",
          comprobanteCerrado: "",
          numeroComprobante: "",
          blackReceiptFilter: "",
          totalVenta: "",
          page: 1,
          size: 5,
          totalPages: 0
        },
        clientes:{
          sucursalId: "",
          personaSocialReason: "",
          personaName: "",
          personaCuit: "",
          personaDirection: "",
          personaContactName: "",
          page: 1,
          size: 100000
        },
        mediosPago:{
          sucursalId: "",
          medioPagoName: "",
          page: 1,
          size: 100000
        }
      },
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
    if(this.loguedUser.perfil > 1){
      this.filterParams.ventas.sucursalId = this.loguedUser.sucursal.id;
      this.filterParams.clientes.sucursalId = this.loguedUser.sucursal.id;
      this.filterParams.mediosPago.sucursalId = this.loguedUser.sucursal.id;
    }
    this.getAllObjects();
  },

  computed: {
    totalDetail(){
      return this.detailRelationateReceipt.reduce((acc, el) => acc + el.precioTotal, 0);
    }
  },

  methods: {
    getAllObjects() {
      GenericService(this.tenant, "clientes", this.token)
        .filter(this.filterParams["clientes"])
        .then((data) => {
          this.databaseItems.clientes = data.data.content;
        });

      GenericService(this.tenant, "mediosPago", this.token)
        .filter(this.filterParams["mediosPago"])
        .then((data) => {
          this.databaseItems.medios_de_pago = data.data.content;
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

      const notas = checkIfNote(documentos);
      return (this.databaseItems.documentos = notas);
    },

    handleSubmit(){
      if(this.dialogObject.documento.tipo === false){
        this.$store.commit('receipt/addReceipt', this.dialogObject);
        this.$emit('receipt', this.$store.state.receipt.receipt);
        this.$store.commit('receipt/receiptDialogMutation');
      }else{
        if(!this.dialogObject.comprobanteAsociado){
          this.$errorAlert('Si emite un comprobante fiscal debe seleccionar un documento fiscal relacionado');
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

    filterObjects(){
      GenericService(this.tenant, "ventas", this.token)
        .filter(this.filterParams.ventas)
        .then(data => {
          this.comprobantes = data.data.content;
          this.filterParams.ventas.totalPages = data.data.totalPages;
          if(this.filterParams.ventas.totalPages < this.filterParams.ventas.page){
              this.filterParams.ventas.page = 1;
          }
        });
    },
  },
};
</script>
