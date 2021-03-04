<template>
    <v-container>
        <h1>
            {{salesData[0].fechaEmision}}
        </h1>
    </v-container>
</template>
<script>
import { errorAlert } from '../helpers/alerts';
import GenericService from '../services/GenericService';
export default {
    data: () => ({
        token: localStorage.getItem("token"),
        service: "ventas",
        tenant:"",
        filterParams: {
            fourthLongParam: "",
            secondLongParam: "",
            thirdLongParam: "",
            stringParam: "",
            doubleParam: "",
            stringParamReceiptNumber: "",
            page: 1,
            size: 10,
            totalPages: 0
        },
        salesData: []
    }),
    mounted(){
        this.tenant = this.$route.params.tenant;
        this.getSaleData();
    },
    methods: {
        getSaleData(){
            GenericService(this.tenant, this.service, this.token)
            .filter(this.filterParams)
            .then(dataOfSales => {
                this.salesData = dataOfSales.data.content;
            })
            .catch(err => {
                errorAlert(err);
            })
        }
    }
}
</script>