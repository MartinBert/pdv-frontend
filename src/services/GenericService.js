import axios from "axios";
import { calculateAmountPlusPercentaje, calculatePercentaje, sumarNumeros } from '../helpers/mathHelper';

const possibleVariationInProducts = async (data) => {
    const products = data;
    return callUserData()
    .then(dataOfUser => {
        if(isSuperAdmin(dataOfUser.perfil)){
            return products;
        }else{
            return varyProductProfit(products, dataOfUser);
        }
    })
}

const callUserData = async() => {
    const loguedUser = await getLoguedUser();
    if(loguedUser){
        return loguedUser;
    }else{
        return setTimeout(() => callUserData(), 1000);
    }
}

const getLoguedUser = async () => {
    return JSON.parse(localStorage.getItem('userData'));
}

const isSuperAdmin = (perfil) => {
    if(perfil > 1) return false;
    return true;
}

const varyProductProfit = (data, loguedUser) => {
    data.data.content.forEach(el => {
        el.ganancia = loguedUser.sucursal.variacionGanancia;
        el.precioSinIva = calculateAmountPlusPercentaje(el.costoBruto, el.ganancia);
        el.ivaVenta = calculatePercentaje(el.precioSinIva, el.ivaVentasObject.porcentaje);
        el.precioTotal = sumarNumeros([el.precioSinIva, el.ivaVenta]);
    })
    return data;
}

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
            if(service === "productos") return possibleVariationInProducts(data);
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