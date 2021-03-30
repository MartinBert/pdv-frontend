<template>
  <v-container>
    <v-simple-table style="background-color: transparent">
      <thead>
        <tr>
          <th>Descripción</th>
          <th>Fecha</th>
          <th>Productos devueltos</th>
          <th>Productos cedidos</th>
          <th>Monto de operación</th>
          <th>Comprobante</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody v-for="item in items" :key="item.id">
        <tr>
          <td>{{ item.descripcion }}</td>
          <td>{{ item.fecha }}</td>
          <td>
            <Detail
              :objectsArray="item.productos"
              v-on:seeDetails="seeDetails"
            />
          </td>
          <td>
            <Detail
              :objectsArray="item.productosSalientes"
              v-on:seeDetails="seeDetails"
            />
          </td>
          <td>${{ item.totalDevolucion }}</td>
          <td>
            <span v-if="item.comprobante">{{
              item.comprobante.nombreDocumento
            }}</span>
            <span v-else>SIN COMPROBANTE</span>
          </td>
          <td>
            <Print :object="item" v-on:print="print" v-if="item.comprobante" />
            <Add :object="item" v-on:add="add" v-else />
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-container>
</template>
<script>
import Print from "../Buttons/Print";
import Detail from "../Buttons/Detail";
import Add from "../Buttons/Add";
export default {
  props: {
    items: Array,
  },
  components: {
    Print,
    Detail,
    Add,
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
    print(object) {
      this.$emit("print", object);
    },
    add(object) {
      this.$emit("add", object);
    },
  },
};
</script>