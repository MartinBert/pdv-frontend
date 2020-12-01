export function calculateAlicIvaBaseImpVentas(totalVenta){
    const result = Math.round((totalVenta / 1.21) * 100) / 100;
    return result;
} 

export function calculateAlicIvaImporteVentas(totalVenta, baseImp){
   const result = Math.round((totalVenta - baseImp) * 100) / 100;
   return result;
}

export function generateBarCode(){
    const barCode = Math.floor(1e9 + (Math.random() * 9e9));
    return barCode;
}

export function decimalPercent(integerPercent){ 
    return integerPercent / 100;
}

export function calculatePercentaje(number, percent){
    const result = parseFloat(number * decimalPercent(percent)).toFixed(2);
    return result;
}

export function sumarNumeros(array){
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const result = array.reduce(reducer);
    return result;
}

export function generateFiveDecimalCode(){
    const minm = 10000;
    const maxm = 99999;
    const fiveDecimalCode = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    
    return fiveDecimalCode;
}