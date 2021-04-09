import axios from "axios";

const loguedUser = localStorage.getItem('userData');

export default (tenant, service, token) => {
    return {
        getAll: function (page, size) {
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}?page=${page}&size=${size}`, {
                headers: { Authorization: "Bearer " + token }
            })
        },

        get: function (id) {
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/${id}`, {
                headers: { Authorization: "Bearer " + token }
            })
        },

        save: function (body) {
            return axios.post(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}`, body, {
                headers: { Authorization: "Bearer " + token }
            })
        },

        saveAll: function (body) {
            return axios.post(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/saveAll`, body, {
                headers: { Authorization: "Bearer " + token }
            })
        },

        delete: function (id) {
            return axios.delete(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/${id}`, {
                headers: { Authorization: "Bearer " + token }
            })
        },

        filter: async function (object) {
            let data = await axios.post(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/filter`, object, {
                headers: { Authorization: "Bearer " + token }
            })
            
            if(service === "productos"){
                if(loguedUser.perfil > 1){
                    data.data.content.forEach(el => {
                        el.precioTotal = 500;
                    })
                }
            }
            
            console.log(data);
            return data;
        },

        update(object) {
            return axios.put(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}`, object, {
                headers: { Authorization: "Bearer " + token }
            })
        },

        getSucursalOfSalePoint(sucursalId) {
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/getSucursalOfSalePoint/${sucursalId}`, {
                headers: { Authorization: "Bearer " + token }
            })
        }
    }
}