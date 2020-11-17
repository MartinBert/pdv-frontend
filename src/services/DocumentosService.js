import axios from "axios";

export default (tenant,service,token) =>{
    return{
        getInvoices: function(){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/invoices`, {
                headers: { Authorization: "Bearer " + token }
            })
        },
    }
}