import axios from "axios";

export default (tenant, service, token) => {
    return {
        getPreviousCorrelativeNumber(sucursalId) {
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/correlative/${sucursalId}`, {
                headers: { Authorization: "Bearer " + token }
            })
        },
    }
}