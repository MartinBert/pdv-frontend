<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      class="main_navigation"
      style="background-color: #d2d2ff"
      width="17%"
    >
      <v-list nav dense>
        <div v-for="m in modulosVisibles" :key="m.name">
          <v-list-group v-if="m.childs && m.childs.length > 0">
            <template v-slot:activator>
              <v-list-item-action>
                <img v-bind:src="m.icon" height="35" width="35" />
              </v-list-item-action>
              <v-list-item-title>{{ m.title }}</v-list-item-title>
            </template>
            <v-list dense>
              <v-list-item
                v-for="(child, i) in m.childs"
                :key="i"
                @click="go(child.name)"
                :class="
                  child.name == nameRouter
                    ? 'v-list-item--active primary--text'
                    : ''
                "
              >
                <v-list-item-action>
                  <v-icon size="12">mdi-checkbox-blank-circle</v-icon>
                </v-list-item-action>
                <v-list-item-title v-text="child.title"></v-list-item-title>
              </v-list-item>
            </v-list>
          </v-list-group>
          <v-list-item v-if="!m.childs" :key="m.name" @click="go(m.name)">
            <v-list-item-action>
              <v-icon>{{ m.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ m.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="primary" dark clipped-left fixed>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-spacer></v-spacer>
      <form
        @submit.prevent="changeUserData()"
        v-if="logued"
        class="d-flex mt-5"
      >
        <v-autocomplete
          :items="sucursales"
          v-model="loguedUser.sucursal"
          item-text="razonSocial"
          :return-object="true"
          @change="getSalesPoint(loguedUser.sucursal)"
        />
        <v-autocomplete
          :items="salesPoint"
          v-model="loguedUser.puntoVenta"
          item-text="nombre"
          :return-object="true"
          class="ml-2"
        />
        <v-btn type="submit" class="ml-2" outlined>APLICAR</v-btn>
      </form>
      <v-spacer />
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <a
            ><img
              src="/../../images/icons/perfil.svg"
              v-on="on"
              height="50"
              width="50"
              style="border-radius: 50% 50% 50% 50%; border: solid 2px #E7ECED;"
          /></a>
        </template>
        <v-card class="mx-auto" max-width="344" outlined>
          <v-list-item three-line>
            <v-list-item-content v-if="user">
              <v-list-item-title class="headline mb-1">{{
                user.nombre
              }}</v-list-item-title>
              <v-list-item-subtitle>{{ user.username }}</v-list-item-subtitle>
              <v-list-item-subtitle>{{
                user.perfil.nombre
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-card-actions>
            <v-btn text @click="logout()">Cerrar sesión</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container fluid class="root-container">
        <Home v-if="$route.name === 'root'" />
        <router-view v-if="$route.name !== 'root'" />
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import axios from "axios";
import Home from "./Home";
export default {
  props: {
    source: String,
  },
  data: () => ({
    mini: true,
    user: null,
    logued: false,
    tenant: "",
    drawer: null,
    token: localStorage.getItem("token"),
    loguedUser: {},
    salesPoint: [],
    nameRouter: "",
    modulos: [
      {
        name: "ventas",
        title: "Ventas",
        visible: false,
        icon: "/../images/icons/sale.svg",
        childs: [
          {
            path: "/ventas",
            name: "ventasForm",
            title: "Generar Venta",
            visible: false,
          },
          {
            path: "/ventas/list",
            name: "ventas",
            title: "Lista",
            visible: false,
          },
          {
            path: "/ventas/presupuesto",
            name: "presupuesto",
            title: "Presupuesto",
            visible: false,
          },
          {
            path: "/ventas/cierrez",
            name: "Cierrez",
            title: "Cierrez",
            visible: false,
          },
          {
            path: "/caja",
            name: "caja",
            title: "Caja",
            visible: false,
          },
        ],
      },
      {
        name: "productos",
        title: "Productos",
        visible: false,
        icon: "/../images/icons/products.svg",
        childs: [
          {
            path: "/productos",
            name: "productos",
            title: "Lista",
            visible: false,
          },
          {
            path: "/marcas",
            name: "marcas",
            title: "Marcas",
            visible: false,
          },
          {
            path: "/rubros",
            name: "rubros",
            title: "Rubros",
            visible: false,
          },
          {
            path: "/atributos",
            name: "atributos",
            title: "Atributos",
            visible: false,
          },
          {
            path: "/propiedades",
            name: "propiedades",
            title: "Propiedades",
            visible: false,
          },
          {
            path: "/depositos",
            name: "depositos",
            title: "Depositos",
            visible: false,
          },
          {
            path: "/stock",
            name: "stock",
            title: "Stock",
            visible: false,
          },
        ],
      },
      {
        name: "documentos",
        title: "Doc. Comerciales",
        visible: false,
        icon: "/../images/icons/commercial_documents.svg",
        childs: [
          {
            path: "/documentos_comerciales",
            name: "documentos",
            title: "Lista",
            visible: false,
          },
        ],
      },
      {
        name: "mediosPago",
        title: "Medios de Pago",
        visible: false,
        icon: "/../images/icons/payment_methods.svg",
        childs: [
          {
            path: "/medios_de_pago",
            name: "mediosPago",
            title: "Medios de pago",
            visible: false,
          },
          {
            path: "/planes_de_pago",
            name: "planesPago",
            title: "Planes de pago",
            visible: false,
          },
        ],
      },
      {
        name: "personas",
        title: "Personas",
        visible: false,
        icon: "/../images/icons/people.svg",
        childs: [
          {
            path: "/clientes",
            name: "clientes",
            title: "Clientes",
            visible: false,
          },
          {
            path: "/vendedores",
            name: "vendedores",
            title: "Vendedores",
            visible: false,
          },
          {
            path: "/distribuidores",
            name: "distribuidores",
            title: "Distribuidores",
            visible: false,
          },
          {
            path: "/transportistas",
            name: "transportistas",
            title: "Transportistas",
            visible: false,
          },
        ],
      },
      {
        name: "relaciones",
        title: "Relaciones",
        visible: false,
        icon: "/../images/icons/relations.svg",
        childs: [
          {
            path: "/condiciones_fiscales",
            name: "condicionesFiscales",
            title: "Cond. Fiscal",
            visible: false,
          },
        ],
      },
      {
        name: "usuarios",
        title: "Usuarios",
        visible: false,
        icon: "/../images/icons/users.svg",
        childs: [
          {
            path: "/usuarios",
            name: "usuarios",
            title: "Lista",
            visible: false,
          },
          {
            path: "/perfiles",
            name: "perfiles",
            title: "Perfiles",
            visible: false,
          },
        ],
      },
      {
        name: "configuraciones",
        title: "Configuraciones",
        visible: false,
        icon: "/../images/icons/settings.svg",
        childs: [
          {
            path: "/empresa",
            name: "empresas",
            title: "Empresa",
            visible: false,
          },
          {
            path: "/sucursales",
            name: "sucursales",
            title: "Sucursales",
            visible: false,
          },
          {
            path: "/puntos_venta",
            name: "puntosVenta",
            title: "Puntos de venta",
            visible: false,
          },
          {
            path: "/modulos",
            name: "modulos",
            title: "Modulos",
            visible: false,
          },
          {
            path: "/ivas",
            name: "ivas",
            title: "Ivas",
            visible: false,
          },
        ],
      },
      {
        name: "soporte",
        title: "Soporte",
        visible: false,
        icon: "/../images/icons/support.svg",
        childs: [
          {
            path: "/preguntas_frecuentes",
            name: "preguntasFrecuentes",
            title: "Preguntas Frecuentes",
            visible: false,
          },
          {
            path: "/manuales",
            name: "manuales",
            title: "Manuales y contacto",
            visible: false,
          },
          {
            path: "/mensajes",
            name: "mensajes",
            title: "Mensajes",
            visible: false,
          },
        ],
      },
      {
        name: "libroivaventas",
        title: "LibroIvaVentas",
        visible: false,
        icon: "/../images/icons/libro.svg",
        childs: [
          {
            path: "/libroivaventas",
            name: "libroivaventas",
            title: "LibroIvaVentas",
            visible: false,
          },
        ],
      },
      {
        name: "calendar",
        title: "Calendar",
        visible: false,
        icon: "/../images/icons/calendar.svg",
        childs: [
          {
            path: "/calendar",
            name: "calendar",
            title: "Calendar",
            visible: false,
          },
        ],
      },
    ],
    modulosVisibles: [],
  }),
  mounted() {
    this.tenant = this.$route.params.tenant;
    this.getUser();
  },
  components: {
    Home,
  },
  methods: {
    go(to) {
      if (this.$router.currentRoute.name !== to)
        this.$router.push({ name: to });
      this.nameRouter = to;
    },

    logout() {
      localStorage.clear();
      this.go(`login`);
    },

    getUser() {
      axios
        .get(
          `${process.env.VUE_APP_SERVER}/${this.tenant}/api/usuarios/getLogued`,
          {
            headers: { Authorization: "Bearer " + this.token },
          }
        )
        .then((response) => {
          this.user = response.data;
          if (this.user.perfil.id == 2) {
            setTimeout(() => {
              this.loguedUser = JSON.parse(localStorage.getItem("userData"));
              this.sucursales = this.loguedUser.empresa.sucursales;
              this.logued = true;
            }, 1500);
          }
          this.modulos.forEach((m) => {
            this.user.perfil.modulos.forEach((modulo) => {
              if (m.name == modulo.nombre) {
                var mod = {
                  name: m.name,
                  title: m.title,
                  childs: [],
                  icon: m.icon,
                };
                if (m.childs.length > 0) {
                  m.childs.forEach((child) => {
                    this.user.perfil.modulos.forEach((modulo2) => {
                      if (child.name == modulo2.nombre) {
                        mod.childs.push(child);
                      }
                    });
                  });
                }
                this.modulosVisibles.push(mod);
              }
            });
          });
        })
        .catch(() => {
          this.logout();
        });
    },

    getSalesPoint() {
      this.salesPoint = this.loguedUser.sucursal.puntosVenta;
    },

    changeUserData() {
      localStorage.setItem("userData", JSON.stringify(this.loguedUser));
      this.$successAlert("Cambios aplicados")
        .then(() => {
          location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
