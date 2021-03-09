<template>
    <v-container>
        <h1 v-if="loaded">
            {{salesData}}
        </h1>
        <Spinner v-if="!loaded"/>
    </v-container>
</template>
<script>
import { errorAlert } from '../helpers/alerts';
import GenericService from '../services/GenericService';
import Spinner from './Spinner';
export default {
    data: () => ({
        token: localStorage.getItem("token"),
        service: "ventas",
        tenant:"",
        filterParams: {
            sucursalId: "",
            blackReceiptFilter: "",
            fechaEmision: "",
            numeroComprobante: "",
            totalVenta: "",
            page: 1,
            size: 1,
            totalPages: 0
        },
        loguedUser: JSON.parse(localStorage.getItem("userData")),
        salesData: [],
        loaded: false
    }),
    components: {
        Spinner
    },
    mounted(){
        this.tenant = this.$route.params.tenant;
        this.filterParams.sucursalId = this.loguedUser.sucursal.id
        this.getSaleData();
    },
    methods: {
        getSaleData(){
            GenericService(this.tenant, this.service, this.token)
            .filter(this.filterParams)
            .then(dataOfSales => {
                this.salesData = dataOfSales.data.content;
                this.loaded = true;
            })
            .catch(err => {
                errorAlert(err);
            })
        }
    }
}
</script>