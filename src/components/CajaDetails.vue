<template>
  <v-dialog v-model="$store.state.eventual.eventualDialog" width="900px">
    <v-card>
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
                  <td>{{ $store.state.eventual.eventual.existenciaInicial }}</td>
                  <td>{{ $store.state.eventual.eventual.existenciaFisica }}</td>
                  <td>{{ $store.state.eventual.eventual.salidasNoContabilizadas }}</td>
                  <td>{{ $store.state.eventual.eventual.montoFacturado }}</td>
                  <td>{{ $store.state.eventual.eventual.diferencia }}</td>
                  <td>
                    <span class="red-class" v-if="$store.state.eventual.eventual.diferencia < 0">Faltante de caja</span>
                    <span class="red-class" v-if="$store.state.eventual.eventual.diferencia > 0">Sobrante de caja</span>
                    <span class="green-class" v-if="$store.state.eventual.eventual.diferencia === 0">Montos coincidentes</span>
                  </td>
              </tr>
              </tbody>
          </template>
        </v-simple-table>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "CajaDetails",   
};
</script>
<style>
.red-class{
  color: red;
}

.green-class{
  color: green;
}
</style>
