import axios from "axios";

export default (tenant,service,token) =>{
    return{
        filterNotCloseReceipts(object){
            return axios.post(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/filterNotCloseReceipts`, object, {
                headers: { Authorization: "Bearer " + token }
            })
        },

        getUniqueDateSales: function (object) {
            let data = axios.post(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/getUniqueDateSales`, object, {
                headers: { Authorization: "Bearer " + token }
            })
            return data;
        },

        getPresupuestos(object){
            let data = axios.post(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/getPresupuestos`, object, {
                headers: { Authorization: "Bearer " + token }
            })
            return data;
        },

        getPreviousCorrelativeDocumentNumber(sucursalId, codigoDocumento){
            let data = axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/getPreviousCorrelativeDocumentNumber/${sucursalId}/${codigoDocumento}`, {
                headers: { Authorization: "Bearer " + token }
            })
            return data;
        }
    }
}