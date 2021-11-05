import { roundTwoDecimals, decimalPercent } from '../helpers/mathHelper';

export default {
    namespaced: true,

    state: {
      discountPercent: 0,
      surchargePercent: 0,
      products: [],
      paymentMethod: null,
      paymentPlans: null,
      paymentPlan: null,
      focusedProduct: null
    },

    mutations: {
      resetStates(state) {
        state.discountPercent = 0;
        state.surchargePercent = 0;
        state.products = [];
        state.paymentMethod = null;
        state.paymentPlan = null;
        state.focusedProduct = null;
      },

      addProductsToList(state, object) {
        const existProductInState = state.products.filter(el => el.codigoBarra === object.codigoBarra)[0];
        if(existProductInState){
          state.products.filter(el => el.codigoBarra === object.codigoBarra)[0].cantUnidades += 1;
        }else{
          state.products.push(object);
        }
      },

      addPaymentMethod(state, object){
        state.paymentMethod = object;
        state.paymentPlans = object.planPago
      },

      addPaymentPlan(state, object){
        state.paymentPlan = object;
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
        console.log(state.products.filter(el => el.codigoBarra === barcode))
        state.focusedProduct = state.products.filter(el => el.codigoBarra === barcode);
      },

      deleteWhenQuantityZero(state){
        state.products = state.products.filter(el => el.cantUnidades > 0);
        console.log(state.products);
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

      totalDiscount(state){
        const result = this.sumOfProductPrices() * decimalPercent(state.discountPercent)
        return roundTwoDecimals(result);
      },

      totalSurcharge(state){
        const result = this.sumOfProductPrices() * decimalPercent(state.surchargePercent)
        return roundTwoDecimals(result);
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