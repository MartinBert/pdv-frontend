import { roundTwoDecimals, decimalPercent } from '../helpers/mathHelper';

export default {
    namespaced: true,

    state: {
      discountPercent: 0,
      surchargePercent: 0,
      products: [],
    },

    mutations: {
      resetStates(state) {
        state.products = [];
      },

      addProductsToList(state, object) {
        const existProductInState = state.products.filter(el => el.codigoBarra === object.codigoBarra)[0];
        if(existProductInState){
          state.products.filter(el => el.codigoBarra === object.codigoBarra)[0].cantUnidades += 1;
        }else{
          state.products.push(object);
        }
      },

      removeProductsToList(state, barcode) {
        const productos = state.products.filter(el => el.barcode !== barcode)[0];
        if(productos){
          state.products.filter(el => el.barcode === barcode)[0].cantUnidades -= 1;
        }else{
          state.products = productos;  
        }
        
      },

      loadModification(state, percentOfModification){
        if(percentOfModification < 0){
          state.discountPercent = percentOfModification * -1;
        }else{
          state.surchargePercent = percentOfModification;
        }
      },

      clearProductsState(state) {
        state.products = [];
      },
    },

    getters: {
      sumOfProductPrices(state) {
        const result = state.products.reduce((acc, el) => acc + (el.precioTotal * el.cantUnidades));
        return result;
      },

      totalVenta(state){
        const result = state.products.reduce(
          (acc, el) => 
            acc + ((el.precioTotal * el.cantUnidades) * (1 + decimalPercent(state.surchargePercent) - decimalPercent(state.discountPercent)))
        , 0);
        return roundTwoDecimals(result);
      },

      totalItems(state){
        return state.products.reduce((acc, el) => acc + el.cantUnidades, 0);
      }
    }
  };