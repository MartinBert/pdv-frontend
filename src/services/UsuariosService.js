import axios from "axios";

export default (tenant,service,token) =>{
    return{
        filterUsersForSucursal: function(filterParam, id,page,size){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/getBySucursal/${filterParam}/${id}/${page}/${size}`, {
                headers: { Authorization: "Bearer " + token }
            })
        },
    }
}