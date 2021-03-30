<template>
  <v-dialog v-model="$store.state.details.dialog" width="900px">
    <v-card color="var(--main-bg-color)">
      <v-simple-table style="background-color: transparent">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="object in $store.state.details.objects"
              :key="object.id"
              class="text-center"
            >
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
