import axios from "axios";

export default (tenant,service,token) =>{
    return{
        getMediosForSucursal(id,page,size){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/getMediosForSucursal/${id}/${page}/${size}`,{
                headers: { Authorization: "Bearer " + token }
            })
        }
    }
}