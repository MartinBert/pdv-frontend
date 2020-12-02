import axios from "axios";

export default (tenant,service,token) =>{
    return{

        getAfipModuleAuthorization(){
            const user = {
                "username":"marcelo",
                "password":"xxxxxx"
            }
            return axios.post(`${process.env.VUE_APP_API_AFIP}/login`, user)
        },

        getVentasForSucursal(sucursal, page, size){
            return axios.post(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/getForSucursal/${page}/${size}`,sucursal,{
                headers: { Authorization: "Bearer " + token }
            })
        },

        filter(object){
            return axios.post(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/filter`, object, {
                headers: { Authorization: "Bearer " + token }
            })
        }
        
    }
}