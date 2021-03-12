<template>
  <v-container>
    <v-pagination
      v-model="paginationProperties.currentPage"
      :length="totalPages"
      next-icon="mdi-chevron-right"
      prev-icon="mdi-chevron-left"
      :page="paginationProperties.currentPage"
      :total-visible="totalVisible"
      @input="emmitPaginationStatus()"
      v-if="totalPages > 1"
    ></v-pagination>
  </v-container>
</template>
<script>
export default {
  name: "Pagination",
  props: {
    page: Number,
    totalPages: Number,
    totalVisible: Number,
  },
  data: () => ({
    paginationProperties: {
      currentPage: 1,
    },
  }),
  methods: {
    emmitPaginationStatus() {
      this.$emit("changePage", this.paginationProperties.currentPage);
    },
  },
};
</script>