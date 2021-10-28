<template>
  <v-container style="min-width: 100%;">
    <v-card min-width="100%">
      <h1 style="text-align: center;">Configuracion Impresora</h1>
      <v-col>
        <v-btn class="primary" raised @click="newObject()">Nuevo</v-btn>
      </v-col>
      <v-row>
        <v-col cols="12">
          <div class="horizontalSeparator"></div>
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="impresoras"
        sort-by="calories"
        class="elevation-1"
        hide-default-footer
      >
        <template v-slot:[`item.impresoraPredeterminada`]="{ item, index }">
          <p v-show="viewCheckboxState === 1">
            {{
              item.impresoraPredeterminada
                ? (checkboxModel[index] = true)
                : (checkboxModel[index] = false)
            }}
          </p>
          <v-checkbox
            v-model="checkboxModel[index]"
            @change="selectDefaultPrinter(item)"
          ></v-checkbox>
        </template>
        <template v-slot:[`item.ticket`]="{item,index}">
          <p v-show="viewCheckboxState === 1">
            {{
              item.ticket
                ? (checkboxModel[index] = true)
                : (checkboxModel[index] = false)
            }}
          </p>
          <v-checkbox
            v-model="checkboxModel[index]"
            @change="selectDefaultetiquet(item)"
          ></v-checkbox>
        </template>
        <template v-slot:[`item.etiqueta`]="{item,index}">
          <p v-show="viewCheckboxState === 1">
            {{
              item.etiqueta
                ? (checkboxModel[index] = true)
                : (checkboxModel[index] = false)
            }}
          </p>
          <v-checkbox
            v-model="checkboxModel[index]"
            @change="selectDefaultetiqueta(item)"
          ></v-checkbox>
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          <Edit :itemId="item.id" v-on:editItem="editItem" />
          <Delete :itemId="item.id" v-on:deleteItem="deleteItem" />
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script>
import Edit from "../../components/Buttons/Edit";
import Delete from "../../components/Buttons/Delete";
import GenericService from "../../services/GenericService";
export default {
  data: () => ({
    impresoras: [],
    itemss: ["80 mm ", "58 mm"],
    filterParams: {
      sucursalId: "",
      valor: "",
      ticket:"",
      etiqueta:"",
      nombreImpresora: "",
      estado: true,
      page: 1,
      size: 10,
      totalPages: 0,
    },
    viewCheckboxState: 0,
    checkboxModel: {},
    loaded: true,
    tenant: "",
    service: "impresoras",
    token: localStorage.getItem("token"),
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    headers: [
      { text: "Nombre", value: "nombreImpresora" },
      { text: "Ancho", value: "valor" },
      { text: "Impresora por defecto", value: "impresoraPredeterminada" },
      {text:"Ticket", value:"ticket"},
      {text:"Etiqueta", value:"etiqueta"},
      { text: "Acciones", value: "acciones", sortable: false },
    ],
  }),

  components: {
    Edit,
    Delete,
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    if (this.loguedUser.perfil > 1) {
      this.filterParams.sucursalId = this.loguedUser.sucursal.id;
    }
    this.getObjects();
  },

  methods: {
    getObjects() {
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.impresoras = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },

    newObject() {
      this.$router.push({ name: "ImpresorasForm", params: { id: 0 } });
    },

    deleteItem(itemId) {
      this.$emit("deleteItem", itemId);
    },

    editItem(itemId) {
      this.$emit("editItem", itemId);
    },

    selectDefaultPrinter(printer) {
      this.impresoras.forEach((el) => {
        el.impresoraPredeterminada = false;
      });
      this.impresoras.filter(
        (el) => el.nombreImpresora === printer.nombreImpresora
      )[0].impresoraPredeterminada = true;
      GenericService(this.tenant, this.service, this.token)
        .saveAll(this.impresoras)
        .then(() => {
          this.getObjects();
        });
    },
      selectDefaulteticket(printer) {
      this.impresoras.forEach((el) => {
       el.ticket  = false;
      });
      this.impresoras.filter(
        (el) => el.ticket === printer.ticket
      )[0].ticket = true;
      GenericService(this.tenant, this.service, this.token)
        .saveAll(this.impresoras)
        .then(() => {
          this.getObjects();
        });
    },
      selectDefaultetiqueta(printer) {
      this.impresoras.forEach((el) => {
       el.etiqueta  = false;
      });
      this.impresoras.filter(
        (el) => el.etiqueta === printer.etiqueta
      )[0].etiqueta = true;
      GenericService(this.tenant, this.service, this.token)
        .saveAll(this.impresoras)
        .then(() => {
          this.getObjects();
        });
    },
  },
};
</script>
