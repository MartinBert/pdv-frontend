<template>
  <v-container>
    <v-form class="mb-3">
      <v-row>
        <v-col cols="6">
          <v-btn class="primary" @click="newObject()" raised>Nuevo</v-btn>
        </v-col>
        <v-col cols="3"></v-col>
        <v-col cols="3">
          <v-text-field
            v-model="filterString"
            v-on:input="filterObjects(filterString)"
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
    <v-simple-table style="background-color: transparent;">
      <template v-slot:default>
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Productos devueltos</th>
            <th>Productos cedidos</th>
            <th>Monto de operación</th>
            <th>Comprobante</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody v-for="o in objects" :key="o.id">
          <tr>
            <td>{{o.id}}</td>
            <td>{{o.descripcion}}</td>
            <td>{{o.fecha}}</td>
            <td>
              <button type="button">
                <img
                  src="/../../images/icons/eye.svg"
                  @click="seeDetail('devueltos', o)"
                  width="40"
                  height="40"
                />
              </button>
            </td>
            <td>
              <button type="button">
                <img
                  src="/../../images/icons/eye.svg"
                  @click="seeDetail('cedidos', o)"
                  width="40"
                  height="40"
                />
              </button>
            </td>
            <td>{{o.totalDevolucion}}</td>
            <td>{{o.comprobante.nombreDocumento}}</td>
            <td>
              <a title="Reimprimir comprobante"><img src="/../../images/icons/impresora.svg" @click="print(o.comprobante)" width="40" height="40"/></a>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <!-- End List -->

    <!-- Loader -->
    <div class="text-center" style="margin-top:15px" v-if="!loaded">
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
      @input="getLoguedUser()"
      v-if="paginate.totalPages > 1"
    ></v-pagination>
    <!-- End Paginate -->

    <!-- Dialog Delete-->
    <v-dialog v-model="activeDetailDialog" width="500">
      <v-card>
        <v-card-title class="d-flex">
          <span class="text-center">Productos {{details[0]}}</span>
        </v-card-title>
        <v-card-text>
          <v-simple-table style="background-color: transparent" ref="tab">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Nombre</th>
                  <th class="text-left">Cantidad de unidades</th>
                  <th class="text-left">Precio Unitario</th>
                  <th class="text-left">Precio Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in details[1]" :key="p.id">
                  <td>{{ p.nombre }}</td>
                  <td>{{ p.cantUnidades }}</td>
                  <td>{{ p.precioUnitario }}</td>
                  <td>{{ p.precioTotal }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
        
    </v-dialog>
    <!-- End Dialog Delete -->
  </v-container>
</template>

<script>
import GenericService from "../../services/GenericService";
import ReportsService from "../../services/ReportsService";
import { formatDate } from "../../helpers/dateHelper";

export default {
  data: () => ({
    objects: [],
    loguedUser: null,
    filterString: "",
    paginate: {
      page: 1,
      size: 10,
      totalPages: 0
    },
    loaded: false,
    tenant: "",
    service: "devoluciones",
    token: localStorage.getItem("token"),
    details: {},
    activeDetailDialog: false
  }),

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.getLoguedUser();
  },

  methods: {
     getLoguedUser(){
      GenericService(this.tenant, this.service, this.token)
      .getLoguedUser()
      .then(data => {
        this.loguedUser = data.data;
        if(this.loguedUser.perfil.id != 1){
          const sucursal = this.loguedUser.sucursal.id;
          this.getDevolucionesForSucursal(sucursal, this.paginate.page - 1, this.paginate.size);
        }else{
          this.getAll(this.paginate.page - 1, this.paginate.size);
        }
      })
    },

    getAll(page, size) {
      this.objects = [];
      this.loaded = false;
      GenericService(this.tenant, this.service, this.token)
        .getAll(page, size)
        .then(data => {
          this.objects = data.data.content;
          this.paginate.totalPages = data.data.totalPages;
          this.loaded = true;
        });
    },

    getDevolucionesForSucursal(sucursalId, page, size){
      GenericService(this.tenant, this.service, this.token)
      .getDataForSucursal(sucursalId, page, size)
      .then(data => {
        data.data.content.forEach(el => {
          el.fecha = formatDate(el.fecha);
        });

        this.objects = data.data.content;
        this.paginate.totalPages = data.data.totalPages;
        this.loaded = true;
      })
    },

    newObject() {
      this.$router.push({ name: "devolucionesForm", params: { id: 0 } });
    },

    filterObjects(filter){
      let f = { razonSocial:filter }
      GenericService(this.tenant, this.service, this.token)
        .filter(f)
        .then(data => {
          this.objects = data.data.content;
        });
    },

    print(object){
      ReportsService(this.tenant, "ventas", this.token)
      .onCloseSaleReport(object)
      .then((res) => {
        let file = new Blob([res["data"]], {
          type: "application/pdf",
        });
        let fileURL = URL.createObjectURL(file);
        window.open(fileURL, "_blank");
      });
    },

    seeDetail(type, object){
      console.log(object)
      if(type === "devueltos"){
        this.details = ['devueltos por clientes', object.productos];
      }else{
        this.details = ['cedidos a clientes', object.productosSalientes];
      }
      this.activeDetailDialog = true;
    },
  }
};
</script>