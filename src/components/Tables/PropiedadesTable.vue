<template>
  <v-container>
    <v-simple-table style="background-color: transparent">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Atributos</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody v-for="item in items" :key="item.id">
        <tr>
          <td>{{ item.id }}</td>
          <td>{{ item.nombre }}</td>
          <td>
            <Detail
              :objectsArray="item.atributos"
              v-on:seeDetails="seeDetails"
            />
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
import Detail from "../Buttons/Detail";
export default {
  props: {
    items: Array,
  },
  components: {
    Edit,
    Delete,
    Detail,
  },
  methods: {
    editItem(itemId) {
      this.$emit("editItem", itemId);
    },
    deleteItem(itemId) {
      this.$emit("deleteItem", itemId);
    },
    seeDetails(object) {
      this.$emit("seeDetails", object);
    },
  },
};
</script>