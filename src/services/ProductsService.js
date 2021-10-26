import axios from "axios";

export default (tenant, service, token) => {
    return {
        getProductForBarCode(barCode) {
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/findByBarCode/${barCode}`, {
                headers: { Authorization: "Bearer " + token }
            })
        },
    }
}