<template>
  <v-container>
    <v-simple-table style="background-color: transparent" ref="tab">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Atributos</th>
          <th>Marca</th>
          <th>Codigo de barras</th>
          <th>Codigo de producto</th>
          <th>Cantidad</th>
          <th>Cant. mínima</th>
          <th>Depósito</th>
          <th>Acciones</th>
          <th class="text-center">Migrar a otro depósito</th>
        </tr>
      </thead>
      <tbody v-for="item in items" :key="item.id">
        <tr>
          <td>{{ item.producto.nombre }}</td>
          <td>{{ setAttributesValues(item.producto.atributos) }}</td>
          <td>{{ item.producto.marca.nombre }}</td>
          <td>{{ item.producto.codigoBarra }}</td>
          <td>{{ item.producto.codigoProducto }}</td>
          <td>{{ item.cantidad }}</td>
          <td>
            <span v-if="!item.cantidadMinima"
              >Sin existencias mínimas asignadas</span
            >
            <span v-if="item.cantidadMinima">{{ item.cantidadMinima }}</span>
          </td>
          <td>{{ item.deposito.nombre }}</td>
          <td>
            <Edit :itemId="item.id" v-on:editItem="editItem" />
            <Delete
              :itemId="item.id"
              v-on:deleteItem="deleteItem"
              v-if="item.estado != 2"
            />
          </td>
          <td class="text-center">
            <Checked
              :object="item"
              v-on:uncheck="uncheck"
              v-if="item.selected === true"
            />
            <Add :object="item" v-on:add="add" v-else />
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
import Checked from "../Buttons/Checked";
export default {
  props: {
    items: Array
  },
  components: {
    Edit,
    Delete,
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