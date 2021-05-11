<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn color="primary" dark class="mr-4" @click="dialog = true">
            Agregar
          </v-btn>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Hoy
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
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
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
        ></v-calendar>
        <v-layout row justify-center>
          <v-dialog v-model="dialog" max-width="500">
            <v-card>
              <v-container>
                <v-flex>
                  <v-form @submit.prevent="saveEvent()" :lazy-validation="false" v-model="valid">
                    <v-text-field
                      type="text"
                      label="Agregar Nombre"
                      v-model="object.name"
                      :rules="nameRules"
                    >
                    </v-text-field>
                    <v-text-field
                      type="text"
                      label="Agregar un Detalle"
                      v-model="object.details"
                      :rules="detailsRules"
                    >
                    </v-text-field>
                    <v-text-field
                      type="date"
                      label="Inicio del evento"
                      v-model="object.startEvent"
                      :rules="startRules"
                    >
                    </v-text-field>
                    <v-text-field
                      type="Time"
                      label="Hora de inicio"
                      v-model="object.starthour"
                      :rules="startRules"
                    >
                    </v-text-field>
                    <v-text-field
                      type="date"
                      label="Fin del evento"
                      v-model="object.endEvent"
                      :roles="endRules"
                    >
                    </v-text-field>
                    <v-text-field
                      type="Time"
                      label="Hora finalizacion"
                      v-model="object.endhour"
                      :roles="endRules"
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
                      :disabled="!valid"
                      >Agregar</v-btn
                    >
                  </v-form>
                </v-flex>
              </v-container>
            </v-card>
          </v-dialog>
        </v-layout>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn icon @click="UpdateObj(selectedEvent)">
                <v-icon>mdi-pencil</v-icon>

              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon @click="deleteEvent(selectedEvent.id)"
                  >mdi-delete</v-icon
                >
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
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
import GenericService from "../../services/GenericService";
export default {
  data: () => ({
    loaded: false,
    valid:true,
    errors: [],
    focus: "",
    notes: [],
    nameRules: [
        v => !!v || 'Nombre es requerido',
        v => v.length <= 20 || 'El nombre debe tener menos de 20 caracteres',
      ],
      details:'',
      detailsRules:[
        v => !!v || 'Detalle es requerido',
        v => v.length <= 20 || 'El nombre debe tener menos de 20 caracteres',
      ],
      startEvent: '',
      startRules: [
        v => !!v || 'Fecha de comienzo del evento es requerido'
      ],
      endEvent:'',
      endRules:[
        v => !!v || 'Fecha de finalizacion es requerida'
      ],
    filterParams: {
      name: "",
      details: "",
      endEvent: "",
      startEvent: "",
      starthour:"",
      endhour:"",
      page: 1,
      size: 1000,
      totalPages: 1000,
    },
    type: "month",
    typeToLabel: {
      month: "Mes",
      week: "Semana",
      day: "Dia",
      "4day": "4 Days",
    },
    object: {
      name: "",
      details: "",
      endEvent: "",
      startEvent: "",
      Starthour:"",
      Endhour:"",
      color: ["#FF5733", "#1976D2", "#33FFA5"],
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
    dialog: false,
    currentlyEvent:null
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
          this.notes.forEach((notes) => {
            const { name, details, endEvent, startEvent, id,endhour,starthour } = notes;
              this.events.push({
              id: id,
              name: name,
              details:details,
              start: startEvent,
              end: endEvent,
              color: "#1976D2",
              starthour:starthour,
              endhour:endhour,
            });
          });
        });
    },

    saveEvent(){
      this.loaded = false;
      GenericService(this.tenant, this.service, this.token)
        .save(this.object)
        .then(() => {
          this.getEvent();
        })
        .catch((error) => {
          console.error(error);
          if (error.response.status == 500) {
            this.errorStatus = true;
            this.loaded = true;
          }
        });
    },

    deleteEvent(id) {
      this.loaded = true;
        GenericService(this.tenant, this.service, this.token)
        .delete(id)
        .then(() => {
          this.getEvent();
          this.selectedOpen = false;
        });

        location.reload();
    },

    editEvent(ev){
      this.currentlyEvent = ev.id;
      console.log(this.currentlyEvent);
    },
    showNotification(events){
     let hoy = new Date()
     events.forEach(events => {
       const{Endevent,Endhour} = events;
       if(Endevent == hoy.toLocaleDateString && Endhour == hoy.getHours){
         this.$toaster.success('Your toaster success message.')
       }
     });
    },
    UpdateObj(events){
    console.log(events);
    this.object= events;
    this.dialog = true;
    window.location.reload;
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        console.log(this.selectedEvent);
        setTimeout(() => {
          this.selectedOpen = true;
        }, 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },
  },
};
</script>
