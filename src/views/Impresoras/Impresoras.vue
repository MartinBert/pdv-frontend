<template>
  <v-container style="min-width: 98%;">
      <ImpresorasTable
        :items="impresoras"
        v-on:editItem="edit"
        v-on:deleteItem="deleteItem"
        v-on:seeDetails="seeDetails"
        v-if="loaded"
      />
      <Spinner v-if="!loaded" />
  </v-container>
</template>
<script>
import ImpresorasTable from "../../components/Tables/ImpresorasTable.vue";
import Spinner from "../../components/Graphics/Spinner";
import GenericService from "../../services/GenericService";
export default {
  data: () => ({
    impresoras:[],
    itemss: ["80 mm ", "58 mm"],
    filterParams: {
      sucursalId: "",
      valor: "",
      nombreImpresora: "",
      page: 1,
      size: 10,
      totalPages: 0
    },
    viewCheckboxState: 0,
    checkboxModel:{},
    loaded: true,
    tenant: "",
    service: "impresoras",
    token: localStorage.getItem("token"),
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    headers: [
      { text: "Nombre", value: "nombreImpresora" },
      { text: "Ancho", value: "valor" },
      { text: "Impresora por defecto", value: "impresoraPredeterminada" },
      { text: "Acciones", value: "acciones", sortable: false },
    ],
  }),

  components: {
    Spinner,
    ImpresorasTable
  },

  mounted() {
    this.tenant = this.$route.params.tenant;
    if(this.loguedUser.perfil > 1){
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
          console.log(this.impresoras);
          this.filterParams.totalPages = data.data.totalPages;  
          this.loaded = true;
        });
    },

    newObject() {
      this.$router.push({ name: "ImpresorasForm", params: { id: 0 } });
    },

    edit(id) {
      this.$router.push({ name: "ImpresorasForm", params: { id: id } });
    },
    deleteItem(itemId) {
      this.$emit("deleteItem", itemId);
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    selectDefaultPrinter(printer){
      this.impresoras.forEach(el => {
        el.impresoraPredeterminada = false;
      })
     this.impresoras.filter(el => el.nombreImpresora === printer.nombreImpresora)[0].impresoraPredeterminada = true; 
      GenericService(this.tenant, this.service, this.token)
      .saveAll(this.impresoras)
      .then(() => {
        this.getObjects()
      })
    }
  },
};
</script>
