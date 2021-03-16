<template>
  <v-dialog v-model="$store.state.details.dialog" width="900px">
    <v-card>
      <v-card-title> Detalles de sucursal </v-card-title>
      <v-card-text>
        <v-simple-table style="background-color: transparent">
          <template v-slot:default>
            <thead>
              <tr>
                <th>Provincia</th>
                <th>Ciudad</th>
                <th>Teléfono alternativo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ $store.state.details.object.provincia }}</td>
                <td>{{ $store.state.details.object.ciudad }}</td>
                <td>{{ $store.state.details.object.telefonoAlternativo }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
