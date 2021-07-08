<template>
  <v-dialog v-model="$store.state.eventual.eventualDialog" width="900px">
    <v-card color="var(--main-bg-color)">
      <v-card-title> Detalle de productos </v-card-title>
      <v-card-text>
        <h3>Productos</h3>
        <v-simple-table style="background-color: transparent">
          <template v-slot:default>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Codigo de barras</th>
                <th>Código de producto</th>
                <th>Marca</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td>{{ product.nombre }}</td>
                <td>{{ product.codigoBarra }}</td>
                <td>{{ product.codigoProducto }}</td>
                <td>{{ product.marca.nombre }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
    props:{
        products: Array
    }
}
</script>

