<template>
  <v-dialog v-model="$store.state.details.dialog" width="900px">
    <v-card color="var(--main-bg-color)">
      <v-card-title> Detalles de cierre de caja </v-card-title>
      <v-card-text>
        <v-simple-table style="background-color: transparent">
          <template v-slot:default>
            <thead>
              <tr>
                <th>Dinero inicial en caja</th>
                <th>Existencia física</th>
                <th>Egresos</th>
                <th>Monto total facturado</th>
                <th>Diferencia</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ $store.state.details.object.existenciaInicial }}</td>
                <td>{{ $store.state.details.object.existenciaFisica }}</td>
                <td>
                  {{ $store.state.details.object.salidasNoContabilizadas }}
                </td>
                <td>{{ $store.state.details.object.montoFacturado }}</td>
                <td>{{ $store.state.details.object.diferencia }}</td>
                <td>
                  <span
                    class="red-class"
                    v-if="$store.state.details.object.diferencia < 0"
                    >Faltante de caja</span
                  >
                  <span
                    class="red-class"
                    v-if="$store.state.details.object.diferencia > 0"
                    >Sobrante de caja</span
                  >
                  <span
                    class="green-class"
                    v-if="$store.state.details.object.diferencia === 0"
                    >Montos coincidentes</span
                  >
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<style>
.red-class {
  color: red;
}

.green-class {
  color: green;
}
</style>
