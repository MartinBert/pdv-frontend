import { roundTwoDecimals, decimalPercent, transformPositive } from '../helpers/mathHelper';

const formatProducts = (producto) => {
  console.log(producto);
  const {
    id,
    nombre,
    codigoBarra,
    cantUnidades,
    precioTotal,
    ivaVentasObject,
    editable,
  } = producto;
  let object = {
    id: id,
    nombre: nombre,
    codigoBarra: codigoBarra,
    cantUnidades: cantUnidades,
    precioUnitario: parseFloat(precioTotal),
    ivaVentas: ivaVentasObject.porcentaje,
    precioTotal: parseFloat(precioTotal * cantUnidades),
    editable: editable,
  };
  return object;
}

const formatProductDescription = (product) => {
  const obj = {
    name: product.nombre,
    barCode: product.codigoBarra,
    code: product.codigoProducto,
    tradeMarkName: product.marca.nombre,
    tradeMarkId: product.marca.id,
    rubroName: product.rubro.nombre,
    rubroId: product.rubro.id,
    attributes: product.atributos,
    properties: product.propiedades,
    quantity: product.cantUnidades,
    costPrice: product.precioCosto,
    salePrice: product.precioTotal,
    buyIvaPercent: product.ivaComprasObject.porcentaje,
    saleIvaPercent: product.ivaVentasObject.porcentaje,
    buyIvaAmount: product.ivaCompra,
    saleIvaAmount: product.ivaVenta,
    discountPercent: 0,
    discountAmount: 0,
    surchargePercent: 0,
    surchargeAmount: 0,
    providersData: product.distribuidores
  }
  return obj;
}

export default {
    namespaced: true,

    state: {
      discountPercent: 0,
      surchargePercent: 0,
      planDiscountPercent: 0,
      planSurchargePercent: 0,
      products: [],
      productsDetails: [],
      productsDescription: [],
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
        const existProductInState = state.productsDetails.filter(el => el.codigoBarra === object.codigoBarra)[0];
        if(existProductInState){
          let productDetails = state.productsDetails.filter(el => el.codigoBarra === object.codigoBarra)[0];
          productDetails.cantUnidades += 1;
          productDetails.precioTotal = productDetails.precioUnitario * productDetails.cantUnidades;
          let product = state.products.filter(el => el.codigoBarra === object.codigoBarra)[0];
          product.cantUnidades += 1;
          product.precioTotal = product.precioUnitario * product.cantUnidades;
          let productDescription = state.productsDescription.filter(el => el.barCode === object.codigoBarra)[0];
          productDescription.quantity += 1;
        }else{
          state.productsDetails.push(object);
          state.products.push(formatProducts(object));
          state.productsDescription.push(formatProductDescription(object));
        }
      },

      addPaymentMethod(state, object){
        state.paymentMethod = object;
        state.paymentPlans = object.planPago
      },

      addPaymentPlan(state, object){
        state.paymentPlan = object;
        if(object.porcentaje < 0){
          state.planDiscountPercent = transformPositive(object.porcentaje);
        }else{
          state.planSurchargePercent = object.porcentaje;
        }
      },

      removeProductsToList(state, barcode) {
        state.products = state.products.filter(el => el.codigoBarra !== barcode);
        state.productsDetails = state.productsDetails.filter(el => el.codigoBarra !== barcode);
        state.productsDescription = state.productsDescription.filter(el => el.barCode !== barcode);
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
        const result = state.products.reduce((acc, el) => acc + el.precioTotal, 0);
        return result;
      },

      totalDiscount(state){
        const sumOfProductPrices = state.products.reduce((acc, el) => acc + el.precioTotal, 0);
        const globalDiscount = sumOfProductPrices * decimalPercent(state.discountPercent);
        const planDiscount = sumOfProductPrices * decimalPercent(state.planDiscountPercent);
        return roundTwoDecimals(globalDiscount + planDiscount);
      },

      totalSurcharge(state){
        const sumOfProductPrices = state.products.reduce((acc, el) => acc + el.precioTotal, 0);
        const globalSurcharge = sumOfProductPrices * decimalPercent(state.surchargePercent);
        const planSurcharge = sumOfProductPrices * decimalPercent(state.planSurchargePercent);
        return roundTwoDecimals(globalSurcharge + planSurcharge);
      },

      totalDiscountPercent(state){
        return roundTwoDecimals(state.discountPercent + state.planDiscountPercent);
      },

      totalSurchargePercent(state){
        return roundTwoDecimals(state.surchargePercent + state.planSurchargePercent);
      },

      totalPlanDiscount(state){
        const sumOfProductPrices = state.products.reduce((acc, el) => acc + el.precioTotal, 0);
        return roundTwoDecimals(sumOfProductPrices * decimalPercent(state.planDiscountPercent))
      },

      totalPlanSurcharge(state){
        const sumOfProductPrices = state.products.reduce((acc, el) => acc + el.precioTotal, 0);
        return roundTwoDecimals(sumOfProductPrices * decimalPercent(state.planSurchargePercent))
      },

      totalGlobalDiscount(state){
        const sumOfProductPrices = state.products.reduce((acc, el) => acc + el.precioTotal, 0);
        return roundTwoDecimals(sumOfProductPrices * decimalPercent(state.discountPercent))
      },

      totalGlobalSurcharge(state){
        const sumOfProductPrices = state.products.reduce((acc, el) => acc + el.precioTotal, 0);
        return roundTwoDecimals(sumOfProductPrices * decimalPercent(state.surchargePercent))
      },

      totalVenta(state){
        const result = state.products.reduce(
          (acc, el) =>
            acc + (
              (Number(el.precioTotal)) * (
                  1 + decimalPercent(state.surchargePercent) + decimalPercent(state.planSurchargePercent)
                  - decimalPercent(state.discountPercent) - decimalPercent(state.planDiscountPercent)
                )
              )
        , 0);
        return roundTwoDecimals(result);
      },

      totalItems(state){
        return state.products.reduce((acc, el) => acc + el.cantUnidades, 0);
      }
    },
  };