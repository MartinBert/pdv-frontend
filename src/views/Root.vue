<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list nav dense>
        <div v-for="m in modulosVisibles" :key="m.name">
          <v-list-group v-if="m.childs && m.childs.length > 0">
            <template v-slot:activator>
              <v-list-item-action>
                <v-icon>{{m.icon}}</v-icon>
              </v-list-item-action>
              <v-list-item-title>{{m.title}}</v-list-item-title>
            </template>
            <v-list dense>
              <v-list-item
                v-for="(child, i) in m.childs"
                :key="i"
                @click="go(child.name)"
                :class="child.name == nameRouter ? 'v-list-item--active primary--text' : ''"
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
              <v-icon>{{m.icon}}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{m.title}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark clipped-left fixed>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-spacer></v-spacer>

      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-icon large v-on="on">mdi-account-circle-outline</v-icon>
        </template>
        <v-card class="mx-auto" max-width="344" outlined>
          <v-list-item three-line>
            <v-list-item-content v-if="user">
              <v-list-item-title class="headline mb-1">{{user.nombre}}</v-list-item-title>
              <v-list-item-subtitle>{{user.username}}</v-list-item-subtitle>
              <v-list-item-subtitle>{{user.perfil.nombre}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-card-actions>
            <v-btn text @click="logout()">Cerrar sesión</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-content>
      <v-container class="d-flex justify-center" fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  props: {
    source: String
  },
  data: () => ({
    user: null,
    tenant: "",
    drawer: null,
    token: localStorage.getItem("token"),
    nameRouter: "",
    modulos: [
      {
        name: "ventas",
        title: "Ventas",
        visible: false,
        icon: "mdi-point-of-sale",
        childs: [
          {
            path: "/ventas",
            name: "ventasForm",
            title: "Venta",
            visible: false
          },
          {
            path: "/listaventas",
            name: "ventas",
            title: "Lista",
            visible: false
          },
        ]
      },
      {
        name: "productos",
        title: "Productos",
        visible: false,
        icon: "mdi-barcode-scan",
        childs: [
          {
            path: "/productos",
            name: "productos",
            title: "Lista",
            visible: false
          },
          {
            path: "/marcas",
            name: "marcas",
            title: "Marcas",
            visible: false
          },
          {
            path: "/rubros",
            name: "rubros",
            title: "Rubros",
            visible: false
          },
          {
            path: "/depositos",
            name: "depositos",
            title: "Depositos",
            visible: false
          },
        ]
      },
      {
        name: "documentos",
        title: "Doc. Comerciales",
        visible: false,
        icon: "mdi-text-box-outline",
        childs: [
          {
            path: "/documentos_comerciales",
            name: "documentos",
            title: "Lista",
            visible: false
          },
        ]
      },
      {
        name: "personas",
        title: "Personas",
        visible: false,
        icon: "mdi-account-group-outline",
        childs: [
          {
            path: "/clientes",
            name: "clientes",
            title: "Clientes",
            visible: false
          },
          {
            path: "/vendedores",
            name: "vendedores",
            title: "Vendedores",
            visible: false
          },
          {
            path: "/distribuidores",
            name: "distribuidores",
            title: "Distribuidores",
            visible: false
          },
          {
            path: "/transportistas",
            name: "transportistas",
            title: "Transportistas",
            visible: false
          }
        ]
      },
      {
        name: "relaciones",
        title: "Relaciones",
        visible: false,
        icon: "mdi-link-variant",
        childs: [
          {
            path: "/condiciones_fiscales",
            name: "condicionesFiscales",
            title: "Cond. Fiscal",
            visible: false
          },
        ]
      },
      {
        name: "usuarios",
        title: "Usuarios",
        visible: false,
        icon: "mdi-account-outline",
        childs: [
          {
            path: "/usuarios",
            name: "usuarios",
            title: "Lista",
            visible: false
          },
          {
            path: "/perfiles",
            name: "perfiles",
            title: "Perfiles",
            visible: false
          }
        ]
      },
    ],
    modulosVisibles: []
  }),
  mounted() {
    this.tenant = this.$route.params.tenant;
    this.getUser();
  },
  methods: {
    go: function(to) {
      this.$router.push({ name: to });
      this.nameRouter = to;
    },
    logout: function() {
      localStorage.clear();
      this.$router.push({ path: this.tenant + "/login" });
    },
    getUser: function() {
      axios
        .get(
          `${process.env.VUE_APP_SERVER}/${this.tenant}/api/usuarios/getLogued`,
          {
            headers: { Authorization: "Bearer " + this.token }
          }
        )
        .then(response => {
          this.user = response.data;
          this.modulos.forEach(m => {
            this.user.perfil.modulos.forEach(modulo => {
              if(m.name == modulo.nombre){
                var mod = {
                  name: m.name,
                  title: m.title,
                  childs: [],
                  icon: m.icon
                }
                if(m.childs.length > 0){
                  m.childs.forEach(child => {
                    this.user.perfil.modulos.forEach(modulo2 => {
                      if(child.name == modulo2.nombre){
                        mod.childs.push(child)
                      }
                    })                    
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
    }
  }
};
</script>