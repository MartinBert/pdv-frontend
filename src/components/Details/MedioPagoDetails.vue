<template>
  <v-dialog v-model="$store.state.details.dialog" width="900px">
    <v-card>
      <v-card-title>Planes de pago asociados</v-card-title>
      <v-card-text>
        <v-simple-table style="background-color: transparent">
          <template v-slot:default>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cantidad de cuotas</th>
                <th>Porcentaje</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="plan in $store.state.details.objects" :key="plan.id">
                <td>{{ plan.nombre }}</td>
                <td>{{ plan.cuotas }}</td>
                <td>{{ plan.porcentaje }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>