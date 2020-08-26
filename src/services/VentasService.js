import axios from "axios";

export default (tenant,service,token) =>{
    return{
        getForBarCode: function(barcode){
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/codb/${barcode}`, {
                headers: { Authorization: "Bearer " + token }
            })
        },

        getUser: function() {
            return axios.get(`${process.env.VUE_APP_SERVER}/${tenant}/api/usuarios/getLogued`, {
                  headers: { Authorization: "Bearer " + token },
                }
              )
        },

        getDate: function(){
            var fecha = new Date();
            var generatedFecha = fecha.getFullYear().toString() + ("0" + (fecha.getMonth() + 1)).toString() + fecha.getDate().toString();
            return generatedFecha;
        }
    }
}