import axios from "axios";

export default (tenant,service,token) =>{
    return{
        getStockForSucursal: function(sucursal,page,size){
            return axios.post(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/getForSucursal/${page}/${size}`,sucursal,{
                headers: { Authorization: "Bearer " + token }
            })
        },
    }
}