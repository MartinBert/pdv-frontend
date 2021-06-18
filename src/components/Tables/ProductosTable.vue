<template>
  <v-container>
    <v-simple-table class="elevation-5">
      <thead>
        <tr>
          <th><b>Nombre</b></th>
          <th><b>Código de barras</b></th>
          <th><b>Código de producto</b></th>
          <th><b>Atributos</b></th>
          <th><b>Marca</b></th>
          <th><b>Precio de costo</b></th>
          <th><b>Precio de venta</b></th>
          <th><b>Acciones</b></th>
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
  headers: [
    {
      align: "start",
      value: "nombre",
    },
    { text: "", value: "calories" },
    { text: "Fat (g)", value: "fat" },
    { text: "Carbs (g)", value: "carbs" },
    { text: "Protein (g)", value: "protein" },
    { text: "Iron (%)", value: "iron" },
  ],
};
</script>

<style>
 b{
   color: black;
 }
</style>
