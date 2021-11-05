<template>
  <v-container
    style="min-width: 98%;
  margin-right:40px;
  "
  >
    <v-card min-width="100%">
      <Error :errorStatus="errorStatus" />
      <div v-if="loaded">
        <v-form
          ref="form"
          v-model="valid"
          :lazy-validation="false"
          class="mt-5"
        >
          <v-row class="ma-1">
            <v-col class="col-4">
              <v-autocomplete
                @change="
                  getComercialDocuments(
                    object.clientePorDefecto.condicionIva.documentos,
                    loguedUser.sucursal.condicionIva.documentos
                  )
                "
                v-model="object.clientePorDefecto"
                :items="databaseItems.clientes"
                item-text="razonSocial"
                :return-object="true"
                placeholder="Seleccione un cliente"
                required
              ></v-autocomplete>
            </v-col>
            <v-col class="col-4">
              <v-autocomplete
                ref="documents"
                class="button-ventas comprobante"
                item-text="nombre"
                v-model="object.documentoPorDefecto"
                :items="databaseItems.documentos"
                :return-object="true"
                placeholder="Seleccione un tipo de comprobante"
                required
              ></v-autocomplete>
            </v-col>
          </v-row>
          <div class="ma-1">
            <v-col class="col-6">
              <v-btn
                class="mr-4"
                color="primary"
                @click="save"
                :disabled="!valid"
                >Guardar</v-btn
              >
              <v-btn color="default" @click="back()">Cancelar</v-btn>
            </v-col>
          </div>
        </v-form>
      </div>
      <Spinner v-if="!loaded" />
    </v-card>
  </v-container>
</template>
<script>
import GenericService from "../../services/GenericService";
import Spinner from "../../components/Graphics/Spinner";
import Error from "../../components/Error";
import { checkIfInvoice } from "../../helpers/processObjectsHelper";
export default {
  data: () => ({
    valid: true,
    object: {},
    loaded: false,
    tenant: "",
    service: "ventasFastConfig",
    token: localStorage.getItem("token"),
    errorStatus: false,
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    databaseItems: {
      clientes: []
    }
  }),

  components: {
    Spinner,
    Error,
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    if (this.$route.params.id && this.$route.params.id > 0) {
      this.getObject(this.$route.params.id);
    } else {
      this.loaded = true;
    }
    this.getObjects();
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

    save() {
      this.object.estado = true;
      this.object.sucursal = this.loguedUser.sucursal;
      GenericService(this.tenant, this.service, this.token)
      .save(this.object)
      .then(() => {
        this.$router.push({ name: "ventasfastconfiguracion" });
      })
      .catch(err => {
        console.error(err);
      })
    },

    getComercialDocuments(clientCond, businessCond) {
      let AllDocuments = [];
      for (let i = 0; i < clientCond.length; i++) {
        businessCond.forEach((el) => {
          if (clientCond[i].id == el.id) {
            AllDocuments.push(el);
            console.log(AllDocuments);
          }
        });
      }
      this.databaseItems.documentos = checkIfInvoice(AllDocuments);
    },

    back() {
      this.$router.push({ name: "ventasfastconfiguracion" });
    },

    getObjects(){
      const clientFilter = {
        sucursalId: this.loguedUser.sucursal.id,
        personaSocialReason: "",
        personaName: "",
        personaCuit: "",
        personaDirection: "",
        personaContactName: "",
        page: 1,
        size: 100000,
      };

       GenericService(this.tenant, "clientes", this.token)
        .filter(clientFilter)
        .then((data) => {
          console.log(data);
          this.databaseItems.clientes = data.data.content;
        });
    }
  },
};
</script>
