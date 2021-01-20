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

        filterNotCloseReceipts(object){
            return axios.post(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/filterNotCloseReceipts`, object, {
                headers: { Authorization: "Bearer " + token }
            })
        },
        
    }
}