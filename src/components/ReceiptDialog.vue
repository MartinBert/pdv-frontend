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
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-col cols="12">
            <v-btn class="success ml-5" type="submit">AGREGAR COMPROBANTE</v-btn>
          </v-col>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>
<script>
import GenericService from "../services/GenericService";

export default {
  name: "ReceiptDialog",

  data() {
    return {
      loguedUser: null,
      tenant: null,
      token: localStorage.getItem("token"),
      dialogObject: {
        cliente: "",
        documento: "",
        mediosPago: "",
        planPago: "",
        totalVenta: "",
      },
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

  methods: {
    getAllObjects() {
      GenericService(this.tenant, this.service, this.token)
        .getLoguedUser()
        .then((data) => {
          this.loguedUser = data.data;
          const sucursalId = this.loguedUser.sucursal.id;

          GenericService(this.tenant, "clientes", this.token)
            .getDataForSucursal(sucursalId, 0, 100000)
            .then((data) => {
              this.databaseItems.clientes = data.data.content;
            });

          GenericService(this.tenant, "mediosPago", this.token)
            .getDataForSucursal(sucursalId, 0, 100000)
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

      const notas = this.checkDocuments(documentos);
      return (this.databaseItems.documentos = notas);
    },

    checkDocuments(docs) {
      const arr = [
        "002",
        "003",
        "007",
        "008",
        "012",
        "013",
        "112",
        "113",
        "114",
        "115",
        "116",
        "117",
        "9999",
      ];
      const filteredDocs = docs.filter((el) => {
        for (let i = 0; i < arr.length; i++) {
          if (el.codigoDocumento === arr[i]) {
            return el;
          }
        }
      });

      return filteredDocs;
    },

    handleSubmit(){
      this.$store.commit('receipt/addReceipt', this.dialogObject);
      this.$emit('receipt', this.$store.state.receipt.receipt);
      this.$store.commit('receipt/receiptDialogMutation');
    },
  },
};
</script>
