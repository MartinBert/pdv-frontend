import Vue from 'vue';
import VueRouter from 'vue-router';
import Root from '../views/Root.vue';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import Usuarios from '../views/Usuarios/Usuarios.vue';
import UsuariosForm from '../views/Usuarios/UsuariosForm.vue';
import Perfiles from '../views/Perfiles/Perfiles.vue';
import PerfilesForm from '../views/Perfiles/PerfilesForm.vue';
import Depositos from '../views/Depositos/Depositos.vue';
import DepositosForm from '../views/Depositos/DepositosForm.vue';
import Distribuidores from '../views/Distribuidores/Distribuidores.vue';
import DistribuidoresForm from '../views/Distribuidores/DistribuidoresForm.vue';
import Marcas from '../views/Marcas/Marcas.vue';
import MarcasForm from '../views/Marcas/MarcasForm.vue';
import Rubros from '../views/Rubros/Rubros.vue';
import RubrosForm from '../views/Rubros/RubrosForm.vue';
import Productos from '../views/Productos/Productos.vue';
import ProductosForm from '../views/Productos/ProductosForm.vue';
import Ventas from '../views/Ventas/Ventas.vue';
import VentasForm from '../views/Ventas/VentasForm.vue';
import Clientes from '../views/Clientes/Clientes.vue';
import ClientesForm from '../views/Clientes/ClientesForm.vue';
import Vendedores from '../views/Vendedores/Vendedores.vue';
import VendedoresForm from '../views/Vendedores/VendedoresForm.vue';
import Transportistas from '../views/Transportistas/Transportistas.vue';
import TransportistasForm from '../views/Transportistas/TransportistasForm.vue';
import DocumentosComerciales from '../views/DocumentosComerciales/DocumentosComerciales.vue';
import DocumentosComercialesForm from '../views/DocumentosComerciales/DocumentosComercialesForm.vue';
import CondicionesFiscales from '../views/CondicionesFiscales/CondicionesFiscales.vue';
import CondicionesFiscalesForm from '../views/CondicionesFiscales/CondicionesFiscalesForm.vue';
import MediosPago from '../views/MediosPago/MediosPago.vue';
import MediosPagoForm from '../views/MediosPago/MediosPagoForm.vue';
import PlanesPago from '../views/PlanesPago/PlanesPago.vue';
import PlanesPagoForm from '../views/PlanesPago/PlanesPagoForm.vue';
import Empresas from '../views/Empresas/Empresas.vue';
import EmpresasForm from '../views/Empresas/EmpresasForm.vue';
import PuntosVenta from '../views/PuntosVenta/PuntosVenta.vue';
import PuntosVentaForm from '../views/PuntosVenta/PuntosVentaForm.vue';
import Sucursales from '../views/Sucursales/Sucursales.vue';
import SucursalesForm from '../views/Sucursales/SucursalesForm.vue';
import Stock from '../views/Stock/Stock.vue';
import StockForm from '../views/Stock/StockForm.vue';
import Devoluciones from "../views/Devoluciones/Devoluciones.vue";
import DevolucionesForm from "../views/Devoluciones/DevolucionesForm.vue";
import Modulos from "../views/Modulos/Modulos.vue";
import ModulosForm from "../views/Modulos/ModulosForm.vue";
import PreguntasFrecuentes from "../views/PreguntasFrecuentes/PreguntasFrecuentes.vue";
import PreguntasFrecuentesForm from "../views/PreguntasFrecuentes/PreguntasFrecuentesForm.vue";
import Manuales from "../views/Manuales/Manuales.vue";
import Mensajes from "../views/Mensajes/Mensajes.vue";

Vue.use(VueRouter)

//División de rutas por login y root
const routes = [
    {
        path: '/:tenant/login',
        name: 'login',
        component: Login
    },
    {
        path: '/:tenant',
        name: 'root',
        component: Root,
        children: [
            {
                path: '',
                name: 'home',
                component: Home,
                meta: { requiresAuth: true }
            },
            {
                path: 'usuarios',
                name: 'usuarios',
                component: Usuarios,
                meta: { requiresAuth: true }
            },
            {
                path: 'usuarios/form/:id',
                name: 'usuariosForm',
                component: UsuariosForm,
                meta: { requiresAuth: true }
            },
            {
                path: 'perfiles',
                name: 'perfiles',
                component: Perfiles,
                meta: { requiresAuth: true }
            },
            {
                path: 'perfiles/form/:id',
                name: 'perfilesForm',
                component: PerfilesForm,
                meta: { requiresAuth: true }
            },
            {
                path: 'depositos',
                name: 'depositos',
                component: Depositos,
                meta: { requiresAuth: true }
            },
            {
                path: 'depositos/form/:id',
                name: 'depositosForm',
                component: DepositosForm,
                meta: { requiresAuth: true }
            },
            {
                path: 'stock',
                name: 'stock',
                component: Stock,
                meta: { requiresAuth: true }
            },
            {
                path: 'stock/form/:id',
                name: 'stockForm',
                component: StockForm,
                meta: { requiresAuth: true }
            },
            {
                path: 'distribuidores',
                name: 'distribuidores',
                component: Distribuidores,
                meta: { requiresAuth: true }
            },
            {
                path: 'distribuidores/form/:id',
                name: 'distribuidoresForm',
                component: DistribuidoresForm,
                meta: { requiresAuth: true }
            },
            {
                path: 'marcas',
                name: 'marcas',
                component: Marcas,
                meta: { requiresAuth: true }
            },
            {
                path: 'marcas/form/:id',
                name: 'marcasForm',
                component: MarcasForm,
                meta: { requiresAuth: true }
            },
            {
                path: 'clientes',
                name: 'clientes',
                component: Clientes,
                meta: { requiresAuth: true }
            },
            {
                path: 'clientes/form/:id',
                name: 'clientesForm',
                component: ClientesForm,
                meta: { requiresAuth: true }
            },
            {
                path: 'vendedores',
                name: 'vendedores',
                component: Vendedores,
                meta: { requiresAuth: true }
            },
            {
                path: 'vendedores/form/:id',
                name: 'vendedoresForm',
                component: VendedoresForm,
                meta: { requiresAuth: true }
            },
            {
                path: 'transportistas',
                name: 'transportistas',
                component: Transportistas,
                meta: { requiresAuth: true }
            },
            {
                path: 'transportistas/form/:id',
                name: 'transportistasForm',
                component: TransportistasForm,
                meta: { requiresAuth: true }
            },
            {
                path: 'rubros',
                name: 'rubros',
                component: Rubros,
                meta: { requiresAuth: true }
            },
            {
                path: 'rubros/form/:id',
                name: 'rubrosForm',
                component: RubrosForm,
                meta: { requiresAuth: true }
            },
            {
                path: 'productos',
                name: 'productos',
                component: Productos,
                meta: { requiresAuth: true }
            },
            {
                path: 'productos/form/:id',
                name: 'productosForm',
                component: ProductosForm,
                meta: { requiresAuth: true }
            },
            {
                path: 'ventas/list',
                name: 'ventas',
                component: Ventas,
                meta: { requiresAuth: true }
            },
            {
                path: 'ventas',
                name: 'ventasForm',
                component: VentasForm,
                meta: { requiresAuth: true }
            },
            {
                path: 'devoluciones',
                name: 'devoluciones',
                component: Devoluciones,
                meta: { requiresAuth: true }
            },
            {
                path: 'devoluciones/form/:id',
                name: 'devolucionesForm',
                component: DevolucionesForm,
                meta: { requiresAuth: true }
            },
            {
                path: 'documentos_comerciales',
                name: 'documentos',
                component: DocumentosComerciales,
                meta: { requiresAuth: true }
            },
            {
                path: 'documentos_comerciales/form/:id',
                name: 'documentosComercialesForm',
                component: DocumentosComercialesForm,
                meta: { requiresAuth: true }
            },
            {
                path: 'condiciones_fiscales',
                name: 'condicionesFiscales',
                component: CondicionesFiscales,
                meta: { requiresAuth: true }
            },
            {
                path: 'condiciones_fiscales/form/:id',
                name: 'condicionesFiscalesForm',
                component: CondicionesFiscalesForm,
                meta: { requiresAuth: true }
            },
            {
                path: 'medios_de_pago',
                name: 'mediosPago',
                component: MediosPago,
                meta: { requiresAuth: true }
            },
            {
                path: 'medios_de_pago/form/:id',
                name: 'mediosPagoForm',
                component: MediosPagoForm,
                meta: { requiresAuth: true }
            },
            {
                path: 'planes_de_pago',
                name: 'planesPago',
                component: PlanesPago,
                meta: { requiresAuth: true }
            },
            {
                path: 'planes_de_pago/form/:id',
                name: 'planesPagoForm',
                component: PlanesPagoForm,
                meta: { requiresAuth: true }
            },
            {
                path: 'empresa',
                name: 'empresas',
                component: Empresas,
                meta: { requiresAuth: true }
            },
            {
                path: 'empresa/form/:id',
                name: 'empresasForm',
                component: EmpresasForm,
                meta: { requiresAuth: true }
            },
            {
                path: 'puntos_venta',
                name: 'puntosVenta',
                component: PuntosVenta,
                meta: { requiresAuth: true }
            },
            {
                path: 'puntos_venta/form/:id',
                name: 'puntosVentaForm',
                component: PuntosVentaForm,
                meta: { requiresAuth: true }
            },
            {
                path: 'sucursales',
                name: 'sucursales',
                component: Sucursales,
                meta: { requiresAuth: true }
            },
            {
                path: 'sucursales/form/:id',
                name: 'sucursalesForm',
                component: SucursalesForm,
                meta: { requiresAuth: true }
            },
            {
                path: 'modulos',
                name: 'modulos',
                component: Modulos,
                meta: { requiresAuth: true }
            },
            {
                path: 'modulos/form/:id',
                name: 'modulosForm',
                component: ModulosForm,
                meta: { requiresAuth: true }
            },
            {
                path: 'preguntas_frecuentes',
                name: 'preguntasFrecuentes',
                component: PreguntasFrecuentes,
                meta: { requiresAuth: true }
            },
            {
                path: 'preguntas_frecuentes/form/:id',
                name: 'preguntasFrecuentesForm',
                component: PreguntasFrecuentesForm,
                meta: { requiresAuth: true }
            },
            {
                path: 'manuales',
                name: 'manuales',
                component: Manuales,
                meta: { requiresAuth: true }
            },
            {
                path: 'mensajes',
                name: 'mensajes',
                component: Mensajes,
                meta: { requiresAuth: true }
            },
            {
                path: '*',
                redirect: '/:tenant'
            }
        ],
    },
    {
        path: '/',
        redirect: '/default/login'
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        var token = localStorage.getItem(process.env.VUE_APP_TOKEN)
        if (!token) {
            next({
                name: 'login',
                params: { tenant: to.params.tenant }
            })
        } else {
            next()
        }
    } else {
        if (to.name == 'login') {
            let token = localStorage.getItem(process.env.VUE_APP_TOKEN)
            if (!token) {
                next()
            } else {
                next({ path: '/' + to.params.tenant })
            }
        } else {
            next()
        }
    }
})

export default router
