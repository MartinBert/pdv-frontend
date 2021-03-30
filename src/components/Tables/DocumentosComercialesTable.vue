<template>
  <v-container>
    <v-simple-table style="background-color: transparent">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Tipo de documento</th>
          <th>Letra</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody v-for="item in items" :key="item.id">
        <tr>
          <td>{{ item.nombre }}</td>
          <td>
            <v-alert type="success" dense v-if="item.tipo">Fiscal</v-alert>
            <v-alert
              color="secondary"
              icon="mdi-close-circle"
              dense
              dark
              v-if="!item.tipo"
              >No fiscal</v-alert
            >
          </td>
          <td>{{ item.letra }}</td>
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
    Delete,
    Edit,
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