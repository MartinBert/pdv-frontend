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

export function calculatePercentaje(totalVenta, porcentaje){
    const cleanPorcentaje = parseFloat(porcentaje.replace(/-/, '') / 100);
    const result = parseFloat(totalVenta * cleanPorcentaje).toFixed(2);
    return result;
}