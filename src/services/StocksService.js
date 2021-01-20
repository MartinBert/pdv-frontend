import axios from "axios";

export default (tenant,service,token) =>{
    return{

        filterStockForDepositId(object){
            return axios.post(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/filterStockForDepositId`, object, {
                headers: { Authorization: "Bearer " + token }
            })
        },
        
    }
}