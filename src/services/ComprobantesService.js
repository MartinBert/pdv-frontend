import axios from "axios";

export default (tenant,service,token) =>{
    return{
        getByCbteNumber: function(numero){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/cbteNumero/${numero}`, {
                headers: { Authorization: "Bearer " + token }
            })
        },
    }
}