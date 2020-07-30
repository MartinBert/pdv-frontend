import axios from "axios";

export default (tenant,service,token) =>{
    return{

        getForBarCode: function(barcode){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/codb/${barcode}`, {
                headers: { Authorization: "Bearer " + token }
            })
        }

    }
}