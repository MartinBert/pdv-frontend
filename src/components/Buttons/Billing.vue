<template>
  <a title="Facturar"
    ><img
      src="/../../images/icons/billing.svg"
      @click="billing()"
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
    billing() {
      this.$emit("billing", this.object);
    },
  },
};
</script>