<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar
          flat
        >
          <v-btn color="primary" dark class="mr-4" @click="dialog = true">
            Agregar
          </v-btn>
          <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="setToday"
          >
            Hoy
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
           <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-menu
            bottom
            right
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                outlined
                color="grey darken-2"
                v-bind="attrs"
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Dia</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Semana</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Mes</v-list-item-title>
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
          locale="es"
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-dialog v-model="dialog">
          <v-card>
            <v-container>
              <v-form @submit.prevent="saveEvent()">
                <v-text-field 
                  type="text" label="Agregar Nombre" v-model="object.name">
                </v-text-field>
                <v-text-field 
                  type="text" label="Agregar un Detalle" v-model="object.details">
                </v-text-field>
                <v-text-field 
                  type="date" label="Inicio del evento" v-model="object.startEvent">
                </v-text-field>
                <v-text-field 
                  type="date" label="Fin del evento" v-model="object.endEvent">
                </v-text-field>
                <v-text-field 
                  type="color" label="Color del evento" v-model="object.color">
                </v-text-field>
                <v-btn type="submit" color="primary" class="mr-4" 
                @click.stop="dialog = false">Agregar</v-btn>
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
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
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
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>
<script>
import GenericService from '../../services/GenericService';
  export default {
    data: () => ({
      focus: '',
      notes: [],
      filterParams: {
      name: "",
      details: "",
      endEvent: "",
      startEvent: "",
      page: 1,
      size: 1000,
      totalPages: 1000,
    },
      type: 'month',
      typeToLabel: {
        month: 'Mes',
        week: 'Semana',
        day: 'Dia',
        '4day': '4 Days',
      },
      object: {
      name: "",
      details: "",
      endEvent: "",
      startEvent: "",
      color: "#1976D2",
      },
      tenant: "",
      service: "notes",
      token: localStorage.getItem("token"),
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      colors: [],
      names: [],
      dialog: false
    }),
    mounted () {
      this.$refs.calendar.checkChange()
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

    viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
    getEventColor (event) {
        return event.color
      },
    setToday () {
        this.focus = ''
      },
    prev () {
        this.$refs.calendar.prev()
      },
    next () {
        this.$refs.calendar.next()
      },
    showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => {
            this.selectedOpen = true
          }, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
    updateRange ({ startEvent, endEvent }) {
        this.object={}
        const notes = []

        const min = new Date(`${startEvent.object}T00:00:00`)
        const max = new Date(`${endEvent.object}T23:59:59`)
        const days = (max.getTime() - min.getTime()) / 86400000
        const eventCount = this.rnd(days, days + 20)

        for (let i = 0; i < eventCount; i++) {
          const allDay = this.rnd(0, 3) === 0
          const firstTimestamp = this.rnd(min.getTime(), max.getTime())
          const first = new Date(firstTimestamp - (firstTimestamp % 900000))
          const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
          const second = new Date(first.getTime() + secondTimestamp)

          notes.push({
            name: this.names[this.rnd(0, this.names.length - 1)],
            startEvent: first,
            endEvent: second,
            color: this.colors[this.rnd(0, this.colors.length - 1)],
            timed: !allDay,
          })
        }

        this.notes = notes
      },
    rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
    },
  }
</script>