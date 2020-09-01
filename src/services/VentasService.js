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
            var generatedFecha = new Date();
            var day = generatedFecha.getDate().toString();
            if(day.length == 1){
                day = "0" + day;
            }
            var month = (generatedFecha.getMonth() + 1).toString();
            if(month.length == 1){
                month = "0" + month;
            }
            var fecha = generatedFecha.getFullYear().toString() + month + day;
            
            return fecha;
        }
    }
}