<template>
  <v-container>
    <v-simple-table style="background-color: transparent">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Número de comprobante</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody v-for="item in items" :key="item.id">
        <tr>
          <td>{{ item.fecha }}</td>
          <td>{{ item.id }}</td>
          <td>
            <Detail :objectsArray="item.comprobantesFiscales" v-on:seeDetails="seeDetails" />
            <Print :object="item" v-on:print="print" />
            <Delete :itemId="item.id" v-on:deleteItem="deleteItem" />
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-container>
</template>
<script>
import Print from "../Buttons/Print";
import Detail from "../Buttons/Detail";
import Delete from "../Buttons/Delete";
export default {
  props: {
    items: Array,
  },
  components: {
    Detail,
    Print,
    Delete
  },
  methods: {
    seeDetails(object) {
      this.$emit("seeDetails", object);
    },
    print(object) {
      this.$emit("print", object);
    },
    deleteItem(itemId) {
      this.$emit("deleteItem", itemId);
    },
  },
};
</script>