<template>
  <v-container>
    <v-simple-table style="background-color: transparent">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Número de comprobante</th>
          <th class="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody v-for="item in items" :key="item.id">
        <tr>
          <td>{{ item.fecha }}</td>
          <td>{{ item.id }}</td>
          <td class="text-center">
            <Detail :objectsArray="item.comprobantesFiscales" v-on:seeDetails="seeDetails" />
            <Print :object="item" v-on:print="print" class="ml-1"/>
            <Delete :itemId="item.id" v-on:deleteItem="deleteItem" class="ml-1"/>
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