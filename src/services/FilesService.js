import axios from "axios";
export default (tenant,service,token) =>{
    return{
    // Products reports
        getSystemManual(){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/getSystemManual`, {
                headers: { Authorization: "Bearer " + token },
                responseType: 'arraybuffer',
                dataType: 'blob'
            })
        },

    }
}