import axios from "axios";

export default (tenant,service,token) =>{
    return{
    // Products reports
        listAllProducts(){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/generalReport/${tenant}`, {
                headers: { Authorization: "Bearer " + token },
                responseType: 'arraybuffer',
                dataType: 'blob'
            })
        },

    // Sales reports
        onCloseSaleReport(object){
            return axios.post(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/onCloseSaleReport`, object,{
                headers: { Authorization: "Bearer " + token }
            })
        }  
    }
}