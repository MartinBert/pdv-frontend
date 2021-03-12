<template>
  <v-container>
    <v-dialog v-model="status" width="500" persistent>
      <v-card>
        <v-toolbar class="d-flex justify-center" color="primary" dark>
          <v-toolbar-title> Eliminar objeto </v-toolbar-title>
        </v-toolbar>
        <v-card-title class="d-flex justify-center">
          <p>¿Está seguro que desea realizar esta acción?</p>
        </v-card-title>
        <v-card-actions>
          <v-container>
            <v-row>
              <v-col class="text-right">
                <v-btn
                  small
                  color="primary"
                  class="mr-5"
                  large
                  @click="confirmation(true)"
                  >Si</v-btn
                >
              </v-col>
              <v-col class="text-left">
                <v-btn small color="default" large @click="confirmation(false)"
                  >No</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  props: {
    status: Boolean,
  },
  methods: {
    confirmation(bool) {
      return bool
        ? this.returnConfirmation(true)
        : this.returnConfirmation(false);
    },
    returnConfirmation(bool) {
      return this.$emit("deleteConfirmation", bool);
    },
  },
};
</script>