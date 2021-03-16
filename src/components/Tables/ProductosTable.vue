<template>
  <v-container>
    <v-simple-table style="background-color: transparent">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Código de barras</th>
          <th>Código de producto</th>
          <th>Atributos</th>
          <th>Marca</th>
          <th>Precio de costo</th>
          <th>Precio de venta</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody v-for="item in items" :key="item.id">
        <tr>
          <td>{{ item.nombre }}</td>
          <td>{{ item.codigoBarra }}</td>
          <td>{{ item.codigoProducto }}</td>
          <td>{{ setAttributesValues(item.atributos) }}</td>
          <td>{{ item.marca.nombre }}</td>
          <td>${{ item.costoBruto }}</td>
          <td>${{ item.precioTotal }}</td>
          <td>
            <Edit :itemId="item.id" v-on:editItem="editItem" />
            <Delete
              :itemId="item.id"
              v-on:deleteItem="deleteItem"
              v-if="item.estado != 2"
            />
            <Add :object="item" v-on:add="add" v-if="item.estado == 2" />
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-container>
</template>
<script>
import Edit from "../Buttons/Edit";
import Delete from "../Buttons/Delete";
import Add from "../Buttons/Add";
export default {
  props: {
    items: Array,
  },
  components: {
    Edit,
    Delete,
    Add,
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
    setAttributesValues(atributes) {
      let str = atributes.reduce((acc, element) => {
        if (element.valor) {
          return acc + element.valor + ",";
        } else {
          return acc + element.valorNumerico.toString() + ",";
        }
      }, "");

      return str;
    },
  },
};
</script>