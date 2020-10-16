import axios from "axios";

export default (tenant,service,token) =>{
    return{
        getForBarCode(barcode){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/codb/${barcode}`, {
                headers: { Authorization: "Bearer " + token }
            })
        },

        getUser() {
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/usuarios/getLogued`, {
                  headers: { Authorization: "Bearer " + token },
                }
              )
        },
        
    }
}