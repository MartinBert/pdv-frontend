import axios from "axios";

export default (tenant,service,token) =>{
    return{
        getForSucursal: function(sucursal){
            console.log(sucursal)
            return axios.post(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/getForSucursal`,sucursal,{
                headers: { Authorization: "Bearer " + token }
            })
        },
    }
}