import axios from "axios";

export default (tenant, service, token) => {
    return {
        getSelected(sucursalId) {
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/getSelected/${sucursalId}`, {
                headers: { Authorization: "Bearer " + token }
            })
        },
    }
}