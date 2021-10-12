import axios from "axios";

export default (tenant, service, token) => {
    return {
        getInvoicesForDateRange(object) {
            return axios.post(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/getInvoicesForDateRange`, object, {
                headers: { Authorization: "Bearer " + token }
            })
        },
    }
}