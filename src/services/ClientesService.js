import axios from "axios";

export default (tenant,service,token) =>{
    return{
        getClientesForSucursal: function(sucursal,page,size){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/getForSucursal/${sucursal}/${page}/${size}`, {
                headers: { Authorization: "Bearer " + token }
            })
        },
    }
}