<template>
  <v-container>
    <Error :errorStatus="errorStatus" />
    <v-card min-width="100%" v-if="loaded">
      <div>
        <v-form ref="form" class="mt-5">
          <v-row class="ma-1">
            <v-col cols="12">
              <v-text-field
                type="text"
                v-model="object.descripcion"
                label="Descripción (puede dejar referencias de los egresos o información que considere útil para sus evaluaciones)"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                type="number"
                v-model="object.existenciaFisica"
                label="Existencia física"
                required
                :rules="[(v) => !!v || 'Campo requerido...']"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                type="number"
                v-model="object.existenciaInicial"
                label="Dinero inicial en caja"
                required
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                type="number"
                v-model="object.salidasNoContabilizadas"
                label="Egresos"
                required
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                type="number"
                v-model="object.montoFacturado"
                label="Monto facturado"
                required
                :rules="[(v) => !!v || 'Campo requerido...']"
                disabled
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                type="number"
                v-model="diferencia"
                label="Diferencia"
                required
                :rules="[(v) => !!v || 'Campo requerido...']"
                disabled
              ></v-text-field>
            </v-col>
            <v-col class="text-right" cols="12">
              <span v-bind:class="detailMessage.classType">{{
                detailMessage.message
              }}</span>
            </v-col>
          </v-row>
          <div class="ma-1">
            <v-col class="col-6">
              <v-btn
                class="mr-4"
                color="primary"
                @click="save"
                :disabled="!valid"
                >Procesar</v-btn
              >
              <v-btn color="default" @click="back()">Cancelar</v-btn>
            </v-col>
          </div>
        </v-form>
      </div>
    </v-card>
    <Spinner v-if="!loaded" />
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import VentasService from "../../services/VentasService";
import Spinner from "../../components/Graphics/Spinner";
import Error from "../../components/Error";
import { restarNumeros, roundTwoDecimals } from "../../helpers/mathHelper";
import { getCurrentDate, formatDate } from "../../helpers/dateHelper";
export default {
  data: () => ({
    valid: true,
    operationType: [
      { id: 1, text: "Arqueo de caja" },
      { id: 2, text: "Cierre Z" },
    ],
    operation: "",
    ventas: [],
    object: {
      existenciaFisica: Number(0),
      existenciaInicial: Number(0),
      salidasNoContabilizadas: Number(0),
      montoFacturado: Number(0),
    },

    loaded: false,
    tenant: "",
    service: "caja",
    token: localStorage.getItem("token"),
    errorStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    filterParams: {
      blackReceiptFilter: "",
      sucursalId: "",
      fechaEmision: "",
      comprobanteCerrado: "",
      numeroComprobante: "",
      totalVenta: "",
      page: 1,
      size: 100000,
      totalPages: 0,
    },
  }),

  components: {
    Spinner,
    Error,
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    if (this.loguedUser.perfil > 1) {
      this.filterParams.sucursalId = this.loguedUser.sucursal.id;
    }
    if (this.$route.params.id && this.$route.params.id > 0) {
      this.getObject(this.$route.params.id);
    }

    this.getSalesList();
  },

  computed: {
    diferencia() {
      return Number(
        restarNumeros([
          this.object.existenciaFisica,
          this.object.existenciaInicial,
          this.object.salidasNoContabilizadas,
          this.object.montoFacturado,
        ])
      );
    },

    detailMessage() {
      if (this.diferencia < 0) {
        return { classType: "errorArqueo", message: "Faltante de caja" };
      } else if (this.diferencia > 0) {
        return { classType: "errorArqueo", message: "Sobrante de caja" };
      } else {
        return {
          classType: "successArqueo",
          message: "Los montos computados y el recuento son coincidentes",
        };
      }
    },
  },

  methods: {
    getObject(id) {
      GenericService(this.tenant, this.service, this.token)
        .get(id)
        .then((data) => {
          this.object = data.data;
          this.loaded = true;
        });
    },

    getSalesList() {
      VentasService(this.tenant, this.service, this.token)
        .filterNotCloseReceipts(this.filterParams)
        .then((data) => {
          this.ventas = data.data;
          const montoNotasCredito = this.ventas.reduce((acc, el) => {
            if (this.isCreditNote(el)) {
              acc = Math.round((acc + Number(el.totalVenta)) * 100) / 100;
            }
            return acc;
          }, 0);
          const montoTotal = this.ventas.reduce(
            (acc, el) => Math.round((acc + Number(el.totalVenta)) * 100) / 100,
            0
          );
          this.object.montoFacturado = roundTwoDecimals(
            montoTotal - montoNotasCredito
          );
          this.loaded = true;
        });
    },

    isCreditNote(receipt) {
      if (
        receipt.nombreDocumento.toLowerCase().includes("nota de crédito") ||
        receipt.nombreDocumento.toLowerCase().includes("notas de credito")
      )
        return true;
      return false;
    },

    save() {
      this.$refs.form.validate();
      this.loaded = false;
      this.object.sucursal = this.loguedUser.sucursal;
      this.object.diferencia = this.diferencia;
      this.ventas.forEach((el) => {
        el.cerrado = "cerrado";
      });
      this.object.fecha = formatDate(getCurrentDate());

      GenericService(this.tenant, "comprobantesFiscales", this.token).saveAll(
        this.ventas
      );

      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(() => {
          this.$router.push({ name: "caja" });
        })
        .catch((error) => {
          if (error.response.status == 500) {
            this.errorStatus = true;
            this.loaded = true;
          }
        });
    },

    back() {
      this.$router.push({ name: "caja" });
    },
  },
};
</script>
<style>
.errorArqueo {
  font-size: 1.2rem;
  border: solid 1px;
  border-radius: 15px;
  padding: 15px;
  color: red;
}
.successArqueo {
  border: solid 1px;
  border-radius: 15px;
  padding: 15px;
  font-size: 1.2rem;
  color: green;
}
</style>