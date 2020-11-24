import axios from "axios";

export default (tenant,service,token) =>{
    return{
    // Products reports
        listAllProducts(){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/generalReport/${tenant}`, {
                headers: { Authorization: "Bearer " + token },
                responseType: 'arraybuffer',
                dataType: 'blob'
            })
        },

    // Sales reports
        onCloseSaleReport(object){
            return axios.post(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/onCloseSaleReport/${tenant}`, object,{
                headers: { Authorization: "Bearer " + token },
                responseType: 'arraybuffer',
                dataType: 'blob'
            })
        },
        
        allSalesReport(id){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/allSalesReport/${tenant}/${id}`, {
                headers: { Authorization: "Bearer " + token },
                responseType: 'arraybuffer',
                dataType: 'blob'
            })
        },

        salesForReceipt(id, receipt){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/salesForReceiptReport/${tenant}/${id}/${receipt}`, {
                headers: { Authorization: "Bearer " + token },
                responseType: 'arraybuffer',
                dataType: 'blob'
            })
        },

        salesForClient(id, client){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/salesForClientReport/${tenant}/${id}/${client}`, {
                headers: { Authorization: "Bearer " + token },
                responseType: 'arraybuffer',
                dataType: 'blob'
            })
        },

        salesForDate(id, fechaDesde, fechaHasta){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/salesForDateReport/${tenant}/${id}/${fechaDesde}/${fechaHasta}`, {
                headers: { Authorization: "Bearer " + token },
                responseType: 'arraybuffer',
                dataType: 'blob'
            })
        },

        salesForMonth(id, year, month){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/salesForMonthReport/${tenant}/${id}/${year}/${month}`, {
                headers: { Authorization: "Bearer " + token },
                responseType: 'arraybuffer',
                dataType: 'blob'
            })
        },

        salesForYear(id, year){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/salesForYearReport/${tenant}/${id}/${year}`, {
                headers: { Authorization: "Bearer " + token },
                responseType: 'arraybuffer',
                dataType: 'blob'
            })
        },

        allSalesGroupBy(id, type){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/allSalesGroupBy/${tenant}/${id}/${type}`, {
                headers: { Authorization: "Bearer " + token },
                responseType: 'arraybuffer',
                dataType: 'blob'
            })
        },

        
    }
}