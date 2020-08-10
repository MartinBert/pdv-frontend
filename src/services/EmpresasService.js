import axios from "axios";

export default (tenant,service,token) =>{
    return{
        getIvaConditions: function(){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/conditions`, {
                headers: { Authorization: "Bearer " + token }
            })
        },
    }
}