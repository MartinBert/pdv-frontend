import axios from "axios";

export default (tenant,service,token) =>{
    return{
        getForBarCode(barcode){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/codb/${barcode}`, {
                headers: { Authorization: "Bearer " + token }
            })
        },

        getUser(){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/usuarios/getLogued`, {
                  headers: { Authorization: "Bearer " + token },
                }
              )
        },

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
        }
        
    }
}