<template>
    <v-container>
        <v-dialog v-model="status" width="500" persistent>
      <v-card color="var(--main-bg-color)">
        <v-toolbar class="d-flex justify-center" color="primary" dark>
          <v-toolbar-title>
            Seleccione un formato de impresión
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col class="text-right">
                <v-btn
                  small
                  color="primary"
                  class="mr-5"
                  large
                  @click="printSpecification('A4')"
                  >A4</v-btn
                >
              </v-col>
              <v-col class="text-left">
                <v-btn
                  small
                  color="primary"
                  large
                  @click="printSpecification('80mm')"
                  >80MM</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-container>
            <v-row>
              <v-col class="text-right">
                <v-btn
                  small
                  color="default"
                  large
                  @click="closeDialog()"
                  >Cancelar</v-btn
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
    printSpecification(type) {
      return this.$emit("printSpecification", type);
    },
    closeDialog(){
        return this.$emit("close")
    }
  },
};
</script>