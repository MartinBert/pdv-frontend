<template>
  <v-dialog v-model="$store.state.details.dialog" width="900px">
    <v-card color="var(--main-bg-color)">
      <v-card-title>Detalles de empresa</v-card-title>
      <v-card-text>
        <v-simple-table style="background-color: transparent">
          <template v-slot:default>
            <thead>
              <tr>
                <th>Alias</th>
                <th>Fecha de inicio de actividades</th>
                <th>Ingresos Brutos</th>
                <th>Condición frente al IVA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ $store.state.details.object.alias }}</td>
                <td>{{ $store.state.details.object.fechaInicioAct }}</td>
                <td>{{ $store.state.details.object.ingBruto }}</td>
                <td>{{ $store.state.details.object.condicionIva.nombre }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>