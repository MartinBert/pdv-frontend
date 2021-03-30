<template>
  <v-container>
    <v-simple-table style="background-color: transparent">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Planes asociados</th>
          <th>Suma en arqueo de caja</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody v-for="item in items" :key="item.id">
        <tr>
          <td>{{ item.nombre }}</td>
          <td>
            <Detail
              :objectsArray="item.planPago"
              v-on:seeDetails="seeDetails"
            />
          </td>
          <td>
            <Add
              :object="item"
              v-on:add="add"
              v-if="!item.sumaEnCierreDeCaja"
            />
            <Checked
              :object="item"
              v-on:uncheck="uncheck"
              v-if="item.sumaEnCierreDeCaja"
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
import Add from "../Buttons/Add";
import Checked from "../Buttons/Checked";
export default {
  props: {
    items: Array,
  },
  components: {
    Edit,
    Delete,
    Detail,
    Add,
    Checked,
  },
  methods: {
    editItem(itemId) {
      this.$emit("editItem", itemId);
    },
    deleteItem(itemId) {
      this.$emit("deleteItem", itemId);
    },
    add(object) {
      this.$emit("add", object);
    },
    uncheck(object) {
      this.$emit("uncheck", object);
    },
    seeDetails(objects) {
      this.$emit("seeDetails", objects);
    },
  },
};
</script>