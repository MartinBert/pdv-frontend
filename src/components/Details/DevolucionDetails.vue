<template>
  <v-dialog v-model="$store.state.details.dialog" width="500">
      <v-card>
        <v-card-title class="d-flex">
          <span class="text-center">{{$store.state.details.title}}</span>
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
                <tr v-for="producto in $store.state.details.objects" :key="producto.id">
                  <td>{{ producto.nombre }}</td>
                  <td>{{ producto.cantUnidades }}</td>
                  <td>{{ producto.precioUnitario }}</td>
                  <td>{{ producto.precioTotal }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-dialog>  
</template>



