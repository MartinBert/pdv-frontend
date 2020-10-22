
import axios from "axios";

export default (tenant,service,token) =>{
    return{
        getDepositosForSucursal(id,page,size){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/getDepositosForSucursal/${id}/${page}/${size}`,{
                headers: { Authorization: "Bearer " + token }
            })
        }
    }
}