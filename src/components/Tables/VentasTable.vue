<template>
  <v-container>
    <v-simple-table style="background-color: transparent">
      <thead>
        <tr>
          <th>Fecha de venta</th>
            <th>Código de barras</th>
            <th>Comprobante</th>
            <th>Productos</th>
            <th>Medios de pago empleados</th>
            <th>Planes de pago</th>
            <th>Precio de venta</th>
            <th>Acciones</th>
        </tr>
      </thead>
      <tbody v-for="item in items" :key="item.id">
        <tr>
          <td>{{item.fechaEmision}}</td>
            <td>{{item.barCode}}</td>
            <td>{{item.nombreDocumento}}</td>
          <td>
            <Detail :itemsArray="item" v-on:seeDetails="seeDetails" />
          </td>
          <td>
            <Detail :itemsArray="item" v-on:seeDetails="seeDetails" />
          </td>
          <td>
            <Detail :itemsArray="item" v-on:seeDetails="seeDetails" />
          </td>
          <td>${{item.totalVenta}}</td>
          <td>
              <Print/>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-container>
</template>
<script>
import Detail from "../Buttons/Detail";
import Print from "../Buttons/Print";
export default {
  props: {
    items: Array,
  },
  components: {
    Detail,
    Print
  },
  methods: {
    seeDetails(item) {
      this.$emit("seeDetails", item);
    },
  },
};
</script>