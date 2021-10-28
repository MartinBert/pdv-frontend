import { roundTwoDecimals, decimalPercent } from '../helpers/mathHelper';

export default {
    namespaced: true,

    state: {
      dialogProd: false,
      discountPercent: 0,
      surchargePercent: 0,
      products: [],
      focusedProduct: null
    },

    mutations: {
      resetStates(state) {
        state.products = [];
        state.dialogProd = false;
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
        state.products = state.products.filter(el => el.codigoBarra !== barcode);
      },

      loadModification(state, percentOfModification){
        if(percentOfModification < 0){
          state.discountPercent = percentOfModification * -1;
        }else{
          state.surchargePercent = percentOfModification;
        }
      },

      focusToProduct(state, barcode){
        console.log(barcode);
        console.log(state.products.filter(el => el.codigoBarra === barcode))
        state.focusedProduct = state.products.filter(el => el.codigoBarra === barcode);
      },

      dialogProductosMutation(state) {
        state.dialogProd = !state.dialogProd;
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