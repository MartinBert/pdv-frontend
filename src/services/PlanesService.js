import axios from "axios";

export default (tenant,service,token) =>{
    return{
        getPlansForSucursal(id,page,size){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/getPlansForSucursal/${id}/${page}/${size}`,{
                headers: { Authorization: "Bearer " + token }
            })
        }
    }
}