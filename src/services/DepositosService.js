
import axios from "axios";

export default (tenant,service,token) =>{
    return{
        getDepositosForSucursal(id){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/getDepositosForSucursal/${id}`,{
                headers: { Authorization: "Bearer " + token }
            })
        }
    }
}