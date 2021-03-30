<template>
  <a title="Detalles">
    <img
      src="/../../images/icons/details.svg"
      @click="seeDetails()"
      width="30"
      height="30"
    />
  </a>
</template>
<script>
export default {
  props: {
    object: Object,
    objectsArray: Array,
  },
  methods: {
    seeDetails() {
      Array.isArray(this.objectsArray)
        ? this.$emit("seeDetails", this.objectsArray)
        : this.$emit("seeDetails", this.object);
    },
  },
};
</script>