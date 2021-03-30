<template>
  <a title="Imprimir"
    ><img
      src="/../../images/icons/success.svg"
      @click="uncheck()"
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
    uncheck() {
      this.$emit("uncheck", this.object);
    },
  },
};
</script>