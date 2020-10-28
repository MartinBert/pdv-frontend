import axios from "axios";

export default (tenant,service,token) =>{
    return{
        getClientesForSucursal: function(page,size,sucursal){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/getForSucursal/${page}/${size}/${sucursal}`, {
                headers: { Authorization: "Bearer " + token }
            })
        },
    }
}