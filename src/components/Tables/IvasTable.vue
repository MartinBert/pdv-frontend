<template>
  <v-container>
    <v-simple-table style="background-color: transparent">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Porcentaje</th>
          <th>Tipo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody v-for="item in items" :key="item.id">
        <tr>
          <td>{{ item.id }}</td>
          <td>{{ item.nombre }}</td>
          <td>{{ item.porcentaje }}</td>
          <td>
            <v-alert v-if="!item.tipo" dense class="success"
              >Iva Ventas</v-alert
            >
            <v-alert v-if="item.tipo" dense class="info">Iva Compras</v-alert>
          </td>
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