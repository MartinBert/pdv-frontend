<template>
  <v-container>
    <v-simple-table style="background-color: transparent">
      <thead>
        <tr>
          <th></th>
        </tr>
      </thead>
      <tbody v-for="item in items" :key="item.id">
        <tr class="text-center">
          <td
            style="height: 70px; font-size: 1.2rem; cursor: pointer"
            @click="response(item.respuesta)"
          >
            {{ item.pregunta }}
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-container>
</template>
<script>
export default {
  props: {
    items: Array,
  },
  methods: {
    response(response) {
      this.$infoAlert2(response);
    },
  },
};
</script>