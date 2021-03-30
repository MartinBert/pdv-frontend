<template>
  <a title="Imprimir"
    ><img
      src="/../../images/icons/add.svg"
      @click="add()"
      width="30"
      height="30"
    />
  </a>
</template>
<script>
export default {
  props: {
    object: Object,
  },
  methods: {
    add() {
      this.$emit("add", this.object);
    },
  },
};
</script>