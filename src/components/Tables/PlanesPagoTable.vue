<template>
  <v-container>
    <v-simple-table style="background-color: transparent">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Cantidad de cuotas</th>
          <th>Porcentaje de recargo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody v-for="item in items" :key="item.id">
        <tr>
          <td>{{ item.nombre }}</td>
          <td>{{ item.cuotas }}</td>
          <td>{{ item.porcentaje }}</td>
          <td>
            <Edit :itemId="item.id" v-on:editItem="editItem" />
            <Delete :itemId="item.id" v-on:deleteItem="deleteItem" />
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-container>
</template>
<script>
import Edit from "../Buttons/Edit";
import Delete from "../Buttons/Delete";
export default {
  props: {
    items: Array,
  },
  components: {
    Edit,
    Delete,
  },
  methods: {
    editItem(itemId) {
      this.$emit("editItem", itemId);
    },
    deleteItem(itemId) {
      this.$emit("deleteItem", itemId);
    },
  },
};
</script>