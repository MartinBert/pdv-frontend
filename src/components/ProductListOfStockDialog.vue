<template>
  <v-dialog v-model="$store.state.eventual.eventualDialog" width="1000px">
    <v-card color="var(--main-bg-color)">
      <v-card-title>
        <h3>Productos que sufrieron cambios</h3>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-simple-table style="background-color: transparent;">
                <template v-slot:default>
                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Código de barras</th>
                        <th>Código de producto</th>
                        <th>Cantidad</th>
                    </tr>
                    </thead>
                    <tbody v-for="object in $store.state.eventual.eventual" :key="object.id">
                    <tr>
                        <td>{{object.producto.nombre}}</td>
                        <td>{{object.producto.codigoBarra}}</td>
                        <td>{{object.producto.codigoProducto}}</td>
                        <td>{{object.cantidad}}</td>
                    </tr>
                    </tbody>
                </template>
            </v-simple-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>