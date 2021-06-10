<template>
  <v-container>
    <v-simple-table style="background-color: transparent">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Planes asociados</th>
          <th>Suma en arqueo de caja</th>
          <th>Aplica en cierre Z</th>
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
              v-on:add="addCloseBox"
              v-if="!item.sumaEnCierreDeCaja"
            />
            <Checked
              :object="item"
              v-on:uncheck="uncheckCloseBox"
              v-if="item.sumaEnCierreDeCaja"
            />
          </td>
          <td>
            <Add
              :object="item"
              v-on:add="addZClosure"
              v-if="!item.aplicaCierreZ"
            />
            <Checked
              :object="item"
              v-on:uncheck="uncheckZClosure"
              v-if="item.aplicaCierreZ"
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

    addCloseBox(object) {
      this.$emit('addCloseBox', object, 'addCloseBox');
    },

    uncheckCloseBox(object) {
      this.$emit('uncheckCloseBox', object, 'uncheckCloseBox');
    },

    addZClosure(object) {
      this.$emit('addZClosure', object, 'addZClosure');
    },

    uncheckZClosure(object) {
      this.$emit('uncheckZClosure', object, 'uncheckZClosure');
    },

    seeDetails(objects) {
      this.$emit('seeDetails', objects);
    }
  },
};
</script>