<template>
    <v-container class="home-content">
        <v-date-picker
        v-model="fechas"
        multiple
        @input="filterObjects"
        >
        </v-date-picker>
    </v-container>
</template>
<script >
import { formatDate, formatDateWithoutSlash, formatWitSlash } from '../helpers/dateHelper';
import GenericService from '../services/GenericService';
export default {
    data: ()=>({
        ventas:[],
        token: localStorage.getItem("token"),
        loguedUser:JSON.parse(localStorage.getItem("userData")),
        filterParams: {
            blackReceiptFilter: "",
            sucursalId: "",
            fechaEmision: "",
            comprobanteCerrado: "",
            numeroComprobante: "",
            totalVenta: "",
            page: 1,
            size: 10,
            totalPages: 0,
        },
        fechas: [formatWitSlash()],
    }),
    mounted(){
        this.tenant = this.$route.params.tenant;
        this.filterParams.sucursalId = this.loguedUser.sucursal.id;
        this.filterObjects();
    },
    methods:{
        filterObjects() {
        console.log(this.fechas)
        let ventas = [];
        let fechasAevaluar = this.fechas.map(el => {
            el = formatDate(formatDateWithoutSlash(el));
            return el;
        });
        GenericService(this.tenant, "ventas", this.token)
        .filter(this.filterParams)
        .then((data) => {
            console.log(data.data.content);
            const databaseVentas = data.data.content;
            databaseVentas.forEach(venta => {
            fechasAevaluar.forEach(fecha => {
                if(venta.fechaEmision == fecha){
                ventas.push(venta);
                }
            })
            })
        });

        this.ventas = ventas;
        console.log(this.ventas);
        this.loaded = true;
        }
    }
}
</script>
