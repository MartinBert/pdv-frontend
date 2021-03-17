<template>
  <v-dialog v-model="$store.state.details.dialog" width="750px">
    <v-card color="var(--main-bg-color)">
      <v-card-title> {{$store.state.details.title}} </v-card-title>
      <v-card-text>
        <v-simple-table style="background-color: transparent">
          <template v-slot:default>
            <thead>
              <tr>
                <th>Nombre</th>
                <th v-if="$store.state.details.objects[0].cuotas">Cuotas</th>
                <th v-if="$store.state.details.objects[0].porcentaje">
                  Porcentaje
                </th>
                <th v-if="$store.state.details.objects[0].precioUnitario">
                  Precio Unitario
                </th>
                <th v-if="$store.state.details.objects[0].cantUnidades">
                  Cantidad de unidades
                </th>
                <th v-if="$store.state.details.objects[0].precioTotal">
                  Precio Total
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="object in $store.state.details.objects" :key="object.id">
                <td>{{ object.nombre }}</td>
                <td v-if="$store.state.details.objects[0].cuotas">
                  {{ object.cuotas }}
                </td>
                <td v-if="$store.state.details.objects[0].porcentaje">
                  {{ object.porcentaje }}
                </td>
                <td v-if="$store.state.details.objects[0].precioUnitario">
                  {{ object.precioUnitario }}
                </td>
                <td v-if="$store.state.details.objects[0].cantUnidades">
                  {{ object.cantUnidades }}
                </td>
                <td v-if="$store.state.details.objects[0].precioTotal">
                  {{ object.precioTotal }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
