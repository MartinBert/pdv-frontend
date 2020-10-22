import axios from "axios";

export default (tenant,service,token) =>{
    return{
        getTransportistasForSucursal: function(sucursal,page,size){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/getForSucursal/${page}/${size}/${sucursal}`, {
                headers: { Authorization: "Bearer " + token }
            })
        },
    }
}