<template>
  <v-dialog v-model="$store.state.eventual.eventualDialog" width="900px">
    <v-card>
        <v-simple-table style="background-color: transparent">
          <template v-slot:default>
              <thead>
              <tr>
                  <th class="text-center">Valor</th>
              </tr>
              </thead>
              <tbody>
                <tr v-for="object in $store.state.eventual.eventual" :key="object.id" class="text-center">
                    <td>
                        <span v-if="object.valor !== null">
                            {{ object.valor }}
                        </span>
                        <span v-if="object.valor === null">
                            {{ object.valorNumerico }}
                        </span>
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
  name: "PropiedadesDetails",   
};
</script>
