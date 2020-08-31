import axios from "axios";

export default (tenant,service,token) =>{
    return{
       listAll: function(){
        return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/report/${'pdf'}/${'ProductsDetail.jrxml'}/${tenant}`, {
            headers: { Authorization: "Bearer " + token }
        })
       }
    }
}