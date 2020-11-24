import axios from "axios";

export default (tenant,service,token) =>{
    return{
        getAll: function(page,size){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}?page=${page}&size=${size}`, {
                headers: { Authorization: "Bearer " + token }
            })
        },

        get: function(id){
            console.log(id);
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/${id}`, {
                headers: { Authorization: "Bearer " + token }
            })
        },

        save: function(body){
            return axios.post(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}`,body, {
                headers: { Authorization: "Bearer " + token }
            })
        },

        saveAll: function(body){
            return axios.post(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/saveAll`,body, {
                headers: { Authorization: "Bearer " + token }
            })
        },

        delete: function(id){
            return axios.delete(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/${id}`, {
                headers: { Authorization: "Bearer " + token }
            })
        },

        filter: function(body){
            return axios.post(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/filter`, body, {
                headers: { Authorization: "Bearer " + token }
            })
        },

        disable: function(id, array){
            array.forEach(el => {
                if (el.id == id){
                    el.estado = 0;
                    return axios.put(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}`, el, {
                        headers: { Authorization: "Bearer " + token }
                    });
                }
            });
        },

        getLoguedUser(){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/usuarios/getLogued`,
              { headers: { Authorization: "Bearer " + token }});
        },

        getDataForSucursal: function(sucursalId,page,size){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/getForSucursal/${sucursalId}/${page}/${size}`, {
                headers: { Authorization: "Bearer " + token }
            })
        },

        getDataForBussiness(empresaId, page, size){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/getForBussiness/${empresaId}/${page}/${size}`, {
                headers: { Authorization: "Bearer " + token }
            })
        }
    }
}