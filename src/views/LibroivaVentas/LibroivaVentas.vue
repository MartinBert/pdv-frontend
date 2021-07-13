<template>
  <v-container
    style="min-width: 98%;
    margin-left:1px;"
  >
    <v-card min-width="100%">
      <v-row style="justify-content: center;">
        <v-col cols="4">
          <v-menu
            ref="menu1"
            v-model="menu1"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateFormatted"
                label="Fecha desde"
                hint="MM/DD/YYYY format"
                persistent-hint
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                @blur="date = parseDate(dateFormatted)"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              no-title
              @input="menu1 = false"
            ></v-date-picker>
          </v-menu>
        </v-col>

        <v-col cols="4">
          <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="computedDateFormatted"
                label="Fecha Hasta"
                hint="MM/DD/YYYY format"
                persistent-hint
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              no-title
              @input="menu2 = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="3">
          <v-checkbox v-model="checkbox">
            <template v-slot:label>
              <div>
                Facturas
              </div>
            </template>
          </v-checkbox>
        </v-col>
      </v-row>
      <v-row style="justify-content: center;">
        <v-col cols="2">
          <v-text-field
          dense
          outlined
          rounded
          label="Fecha"
          class="text-left"
          append-icon="mdi-magnify"
        ></v-text-field>
        </v-col>
         <v-col cols="2">
          <v-text-field
          dense
          outlined
          rounded
          label="Nombre Comprobante"
          class="text-left"
          append-icon="mdi-magnify"
        ></v-text-field>
        </v-col>
         <v-col cols="2">
          <v-text-field
          dense
          outlined
          rounded
          label="Razon Social"
          class="text-left"
          append-icon="mdi-magnify"
        ></v-text-field>
        </v-col>
         <v-col cols="2">
          <v-text-field
          dense
          outlined
          rounded
          label="N° Cuit"
          class="text-left"
          append-icon="mdi-magnify"
        ></v-text-field>
        </v-col>
      </v-row>
      <v-data-table :headers="headers" class="elevation-6">
        <template v-slot:[`item.acciones`]="{}">
          <Print />
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data: (vm) => ({
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    dateFormatted: vm.formatDate(
      new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10)
    ),
    file:null,
    menu1: false,
    menu2: false,
    headers: [
      { text: "Fecha", value: "" },
      { text: "Comprobante", value: "" },
      { text: "Razon Social", value: "" },
      { text: "Condicion Iva", value: "" },
      { text: "N° Cuit", value: "" },
      { text: "Neto Grabado", value: "" },
      { text: "Iva 27%", value: "" },
      { text: "Iva 21%", value: "" },
      { text: "Iva 10,5%", value: "" },
      { text: "Iva 0 %", value: "" },
      { text: "Total Facturado", value: "" },
      { text: "Acciones", value: "acciones", sortable: false },
    ],
  }),

  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
  },

  watch: {
    date() {
      this.dateFormatted = this.formatDate(this.date);
    },
  },

  methods: {
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
  },
};
</script>
<style>
.elevation-6 {
  margin-top: 50px;
}
</style>
