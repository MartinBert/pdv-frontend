<template>
  <v-container>
    <v-form class="mb-3">
      <v-row>
        <v-col cols="1">
          <v-btn class="primary" raised>Reporte de Ventas</v-btn>
        </v-col>
        <v-spacer></v-spacer>
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
    <v-simple-table>
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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody v-for="object in objects" :key="object.id">
          <tr>
            <td>{{object.id}}</td>
            <td>{{object.nombre}}</td>
            <td>{{object.codigoBarra}}</td>
            <td>{{object.codigoProducto}}</td>
            <td>{{object.marca ? object.marca.nombre : 'Sin marca'}}</td>
            <td>${{object.precioCosto}}</td>
            <td>${{object.precioTotal}}</td>
            <td>
              <v-icon title="Editar">mdi-pencil</v-icon>
              <v-icon title="Eliminar">mdi-delete</v-icon>
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
      @input="changePage"
      v-if="paginate.totalPages > 1"
    ></v-pagination>
    <!-- End Paginate -->

  </v-container>
</template>

<script>
import GenericService from "../../services/GenericService";

export default {

  components:{
    
  }, 
  data: () => ({
    icon: "mdi-check-circle",
    file: null,
    object: null,
    filterString: "",
    paginate: {
      page: 1,
      size: 10,
      totalPages: 0
    },
    loaded: false,
    tenant: "",
    service: "ventas",
    token: localStorage.getItem("token"),
    dialogDeleteObject: false
  }),

  mounted() {
    this.tenant = this.$route.params.tenant;
    this.getAll(this.paginate.page - 1, this.paginate.size);
  },

  methods: {
    getAll: function(page, size) {
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

    filterObjects: function(filter){
      var f ={
        nombre:filter
      }
      GenericService(this.tenant, this.service, this.token)
        .filter(f)
        .then(data => {
          this.objects = data.data.content;
        });
    },

  }
};
</script>