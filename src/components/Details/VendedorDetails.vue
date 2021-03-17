<template>
  <v-dialog v-model="$store.state.details.dialog" width="900px">
    <v-card color="var(--main-bg-color)">
      <v-card-title>Detalles de vendedor</v-card-title>
      <v-card-text>
        <v-simple-table style="background-color: transparent">
          <template v-slot:default>
            <thead>
              <tr>
                <th>Dirección</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Teléfono alternativo</th>
                <th>Nombre de contacto</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ $store.state.details.object.direccion }}</td>
                <td>{{ $store.state.details.object.email }}</td>
                <td>{{ $store.state.details.object.telefono }}</td>
                <td>{{ $store.state.details.object.telefonoAlternativo }}</td>
                <td>{{ $store.state.details.object.nombreContacto }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
