<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn outlined class="mr-4" color="grey darken-2"> Today </v-btn>
          <v-btn color="primary" dark class="mr-4" @click="dialog = true">
            Agregar
          </v-btn>
          <v-btn fab text small color="grey darken-2">
            <v-icon small> mdi-chevron-left </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2">
            <v-icon small> mdi-chevron-right </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right> mdi-menu-down </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :type="type"
        ></v-calendar>

        <v-dialog v-model="dialog">
          <v-card>
            <v-container>
              <v-form @submit.prevent="addEvent">
                <v-text-field
                  type="text"
                  label="Agregar Nombre"
                  v-model="object.name"
                >
                </v-text-field>
                <v-text-field
                  type="text"
                  label="Agregar Detalle"
                  v-model="object.details"
                >
                </v-text-field>
                <v-text-field
                  type="Date"
                  label="Inicio del evento"
                  v-model="object.startEvent"
                  @change="formatDate()"
                >
                </v-text-field>
                <v-text-field
                  type="Date"
                  label="Finalizacion del evento"
                  v-model="object.endEvent"
                >
                </v-text-field>
                <v-text-field
                  type="color"
                  label="Color del evento"
                  v-model="object.color"
                >
                </v-text-field>
                <v-btn
                  type="submit"
                  color="primary"
                  class="mr-4"
                  @click.stop="dialog = false"
                  @click="save"
                  >Agregar</v-btn
                >
              </v-form>
            </v-container>
          </v-card>
        </v-dialog>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary"> Cancel </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>
<script>
import GenericService from "../../services/GenericService";

export default {
  data: () => ({
    notes: [],
    filterParams: {
      name: "",
      details: "",
      endEvent: "",
      startEvent: "",
      page: 1,
      size: 10,
      totalPages: 0,
    },
    loaded: false,
    tenant: "",
    service: "notes",
    token: localStorage.getItem("token"),
    focus: "",
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days",
    },
    object: {
      name: "",
      details: "",
      endEvent: "",
      startEvent: "",
      color: "",
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    color: "#F0F8FF",
    dialog: false,
    currentlyEditing: null,
    colors: [],
    names: [],
  }),
  mounted() {
    this.$refs.calendar.checkChange();
    this.tenant = this.$route.params.tenant;
    this.getEvent();
  },
  methods: {
    getEvent() {
      GenericService(this.tenant, this.service, this.token)
        .filter(this.filterParams)
        .then((data) => {
          this.notes = data.data.content;
          console.log(this.notes);
        });
    },

    formatDate() {
      console.log(this.object);
    },

    saveEvent() {
      this.loaded = false;
      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(() => {
          this.getEvent();
        })
        .catch((error) => {
          console.error(error)
          if (error.response.status == 500) {
            this.errorStatus = true;
            this.loaded = true;
          }
        });
    },

    addEvent() {
      this.loaded = false;
      GenericService(this.tenant, this.service, this.token)
        .saveAll(this.object)
        .then(() => {
          console.log("calendar");
        });

      this.getEvent();
      this.name = "";
      this.details = "";
      this.startEvent = "";
      this.endEvent = "";
      this.color = "#F0F8FF";
    },
  },
};
</script>