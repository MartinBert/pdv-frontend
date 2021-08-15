<template>
  <a title="Imprimir"
    ><img
      src="/../../images/icons/printer.svg"
      @click="print()"
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
    print() {
      console.log(this.object);
      this.$emit("print", this.object);
    },
  },
};
</script>