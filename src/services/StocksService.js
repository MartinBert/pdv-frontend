import axios from "axios";

export default (tenant, service, token) => {
    return {
        filterStockForDepositId(object) {
            return axios.post(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/filterStockForDepositId`, object, {
                headers: { Authorization: "Bearer " + token }
            })
        },

        getStockByProductCodeBarInDefaultDeposit(codeBar, sucursalId) {
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/items/${codeBar}/${sucursalId}`, {
                headers: { Authorization: "Bearer " + token }
            })
        },

        getStockByProductCodeBarInAnyDeposit(codeBar, sucursalId){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/items/any/${codeBar}/${sucursalId}`, {
                headers: { Authorization: "Bearer " + token }
            })
        },

        getByAlgorim(algorim, sucursalId) {
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/item/${algorim}/${sucursalId}`, {
                headers: { Authorization: "Bearer " + token }
            })
        }
    }
}