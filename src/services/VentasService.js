import axios from "axios";

export default (tenant,service,token) =>{
    return{
        filterNotCloseReceipts(object){
            return axios.post(`${process.env.VUE_APP_SERVER}/${tenant}/api/${service}/filterNotCloseReceipts`, object, {
                headers: { Authorization: "Bearer " + token }
            })
        },

        checkProductsAndDepositsStatus(productsBelowMinimumStock, productsWithoutStockOnDefaultDeposit, productsOutOfStockAndDeposits){
            if(productsBelowMinimumStock.length > 0){
                let lowStockProducts = '';
                productsBelowMinimumStock.forEach(el => {
                lowStockProducts += `${el.producto.nombre}, `
                });
                this.$infoAlert2(`Vaya, parece que te estas quedando sin stock: ${lowStockProducts}`)
                .then(()=>{
                if(productsOutOfStockAndDeposits.length > 0){
                    let productsNotRegisteredInStock = '';
                    productsOutOfStockAndDeposits.forEach(el => {
                    productsNotRegisteredInStock += `${el.nombre}, `
                    });
                    this.$infoAlert2(`Estos productos no se encuentran en ningún depósito: ${productsNotRegisteredInStock}`);
                }else{
                    if(productsWithoutStockOnDefaultDeposit.length > 0){
                    let productsOnSecondaryDeposits = '';
                    productsWithoutStockOnDefaultDeposit.forEach(el => {
                        productsOnSecondaryDeposits += `${el.producto.nombre}, `
                    });
                    this.$infoAlert2(`Estos productos no se encuentran en el depósito principal: ${productsOnSecondaryDeposits}... Sus unidades se descontaron de otros depósitos`);
                    }
                }
                })
            }else if(productsOutOfStockAndDeposits.length > 0){
                let productsNotRegisteredInStock = '';
                productsOutOfStockAndDeposits.forEach(el => {
                productsNotRegisteredInStock += `${el.nombre}, `
                });
                this.$infoAlert2(`Estos productos no se encuentran en ningún depósito: ${productsNotRegisteredInStock}`)
                .then(()=>{
                if(productsWithoutStockOnDefaultDeposit.length > 0){
                    let productsOnSecondaryDeposits = '';
                    productsWithoutStockOnDefaultDeposit.forEach(el => {
                    productsOnSecondaryDeposits += `${el.producto.nombre}, `
                    });
                    this.$infoAlert2(`Estos productos no se encuentran en el depósito principal: ${productsOnSecondaryDeposits}... Sus unidades se descontaron de otros depósitos`);
                }
                })
            }else{
                if(productsWithoutStockOnDefaultDeposit.length > 0){
                let productsOnSecondaryDeposits = '';
                productsWithoutStockOnDefaultDeposit.forEach(el => {
                    productsOnSecondaryDeposits += `${el.producto.nombre}, `
                });
                this.$infoAlert2(`Estos productos no se encuentran en el depósito principal: ${productsOnSecondaryDeposits}... Sus unidades se descontaron de otros depósitos`);
                }
            }
        }
    }
}