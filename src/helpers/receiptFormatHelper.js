import { ordenarMayorMenor, sumarNumeros, roundTwoDecimals, restarNumeros, calculatePercentReductionInAmount } from './mathHelper';

export function formatReceiptA(object){
    const { ptoVentaId, receiptCode, clientCuit, numberOfReceipt, date, products, totalVenta, asociatedReceipt } = object;
    const productsWithIva = products.filter(el => el.ivaVentas);
    const iva21Object = productsWithIva.filter(el => el.ivaVentas === 21);
    const iva10Object = productsWithIva.filter(el => el.ivaVentas === 10.5);
    const iva27Object = productsWithIva.filter(el => el.ivaVentas === 27);
    let totalImp21 = roundTwoDecimals(iva21Object.reduce((acc, product) => acc + Number(product.precioTotal), 0));
    let totalImp10 = roundTwoDecimals(iva10Object.reduce((acc, product) => acc + Number(product.precioTotal), 0));
    let totalImp27 = roundTwoDecimals(iva27Object.reduce((acc, product) => acc + Number(product.precioTotal), 0));
    const diferenceForSalesMountModifications = roundTwoDecimals(sumarNumeros([totalImp21, totalImp10, totalImp27]) - Number(totalVenta));
    let orderForHigerValue = ordenarMayorMenor([totalImp21, totalImp10, totalImp27]);

    if(totalImp21 === orderForHigerValue[2]){
        totalImp21 = totalImp21 - diferenceForSalesMountModifications;
    }else if(totalImp10 === orderForHigerValue[2]){
        totalImp10 = totalImp10 - diferenceForSalesMountModifications;
    }else{
        totalImp27 = totalImp27 - diferenceForSalesMountModifications;
    }

    
    const baseImp21 = calculatePercentReductionInAmount(totalImp21, 21)
    const baseImp10 = calculatePercentReductionInAmount(totalImp10, 10.5)
    const baseImp27 = calculatePercentReductionInAmount(totalImp27, 27)
    const importIva21 = restarNumeros([totalImp21, baseImp21])
    const importIva10 = restarNumeros([totalImp10, baseImp10])
    const importIva27 = restarNumeros([totalImp27, baseImp27])

    const importeTotalIva = sumarNumeros([importIva21, importIva10, importIva27]);
    const importeTotalNeto = sumarNumeros([baseImp21,baseImp10,baseImp27]);

    let voucherA = {
        'CantReg' 	: 1, // Cantidad de comprobantes a registrar
        'PtoVta' 	: ptoVentaId, // Punto de venta
        'CbteTipo' 	: receiptCode, // Tipo de comprobante (ver tipos disponibles) 
        'Concepto' 	: 1, // Concepto del Comprobante: (1)Productos, (2)Servicios, (3)Productos y Servicios
        'DocTipo' 	: 80, // Tipo de documento del comprador (ver tipos disponibles)
        'DocNro' 	: clientCuit, // Numero de documento del comprador
        'CbteDesde' : numberOfReceipt, // Numero de comprobante o numero del primer comprobante en caso de ser mas de uno
        'CbteHasta' : numberOfReceipt, // Numero de comprobante o numero del ultimo comprobante en caso de ser mas de uno
        'CbteFch' 	: date, // (Opcional) Fecha del comprobante (yyyymmdd) o fecha actual si es nulo
        'ImpTotal' 	: totalVenta, // Importe total del comprobante
        'ImpTotConc': 0, // Importe neto no gravado
        'ImpNeto' 	: importeTotalNeto, // Importe neto gravado
        'ImpOpEx' 	: 0, // Importe exento de IVA
        'ImpIVA' 	: importeTotalIva, //Importe total de IVA
        'ImpTrib' 	: 0, //Importe total de tributos
        'MonId' 	: 'PES', //Tipo de moneda usada en el comprobante (ver tipos disponibles)('PES' para pesos argentinos) 
        'MonCotiz' 	: 1, // Cotización de la moneda usada (1 para pesos argentinos)
        'Iva'       : []
    };
    
    if(baseImp21 > 0){
        voucherA.Iva.push(
            {
                'Id' 		: 5, // Id del tipo de IVA (ver tipos disponibles) 
                'BaseImp' 	: baseImp21, // Base imponible
                'Importe' 	: importIva21 // Importe
            }
        )
    }

    if(baseImp10 > 0){
        voucherA.Iva.push(
            {
                'Id' 		: 4, // Id del tipo de IVA (ver tipos disponibles) 
                'BaseImp' 	: baseImp10, // Base imponible
                'Importe' 	: importIva10 // Importe
            }
        )
    }

    if(baseImp27 > 0){
        voucherA.Iva.push(
            {
                'Id' 		: 6, // Id del tipo de IVA (ver tipos disponibles) 
                'BaseImp' 	: baseImp27, // Base imponible
                'Importe' 	: importIva27// Importe
            }
        )
    }

    if(asociatedReceipt){
        voucherA.CbtesAsoc = asociatedReceipt;
    }

    return voucherA;
}

export function formatReceiptB(object){
    const { ptoVentaId, receiptCode, clientCuit, numberOfReceipt, date, products, totalVenta, asociatedReceipt } = object;
    const productsWithIva = products.filter(el => el.ivaVentas);
    const iva21Object = productsWithIva.filter(el => el.ivaVentas === 21);
    const iva10Object = productsWithIva.filter(el => el.ivaVentas === 10.5);
    const iva27Object = productsWithIva.filter(el => el.ivaVentas === 27);
    let totalImp21 = roundTwoDecimals(iva21Object.reduce((acc, product) => acc + Number(product.precioTotal), 0));
    let totalImp10 = roundTwoDecimals(iva10Object.reduce((acc, product) => acc + Number(product.precioTotal), 0));
    let totalImp27 = roundTwoDecimals(iva27Object.reduce((acc, product) => acc + Number(product.precioTotal), 0));
    const diferenceForSalesMountModifications = roundTwoDecimals(sumarNumeros([totalImp21, totalImp10, totalImp27]) - Number(totalVenta));
    let orderForHigerValue = ordenarMayorMenor([totalImp21, totalImp10, totalImp27]);
    
    if(totalImp21 === orderForHigerValue[2]){
        totalImp21 = totalImp21 - diferenceForSalesMountModifications;
    }else if(totalImp10 === orderForHigerValue[2]){
        totalImp10 = totalImp10 - diferenceForSalesMountModifications;
    }else{
        totalImp27 = totalImp27 - diferenceForSalesMountModifications;
    }

    
    const baseImp21 = calculatePercentReductionInAmount(totalImp21, 21)
    const baseImp10 = calculatePercentReductionInAmount(totalImp10, 10.5)
    const baseImp27 = calculatePercentReductionInAmount(totalImp27, 27)
    const importIva21 = restarNumeros([totalImp21, baseImp21])
    const importIva10 = restarNumeros([totalImp10, baseImp10])
    const importIva27 = restarNumeros([totalImp27, baseImp27])

    const importeTotalIva = sumarNumeros([importIva21, importIva10, importIva27]);
    const importeTotalNeto = sumarNumeros([baseImp21,baseImp10,baseImp27]);

    let voucherB = {
        'CantReg' 	: 1, // Cantidad de comprobantes a registrar
        'PtoVta' 	: ptoVentaId, // Punto de venta
        'CbteTipo' 	: receiptCode, // Tipo de comprobante (ver tipos disponibles) 
        'Concepto' 	: 1, // Concepto del Comprobante: (1)Productos, (2)Servicios, (3)Productos y Servicios
        'DocTipo' 	: 96, // Tipo de documento del comprador (ver tipos disponibles)
        'DocNro' 	: clientCuit, // Numero de documento del comprador
        'CbteDesde' : numberOfReceipt, // Numero de comprobante o numero del primer comprobante en caso de ser mas de uno
        'CbteHasta' : numberOfReceipt, // Numero de comprobante o numero del ultimo comprobante en caso de ser mas de uno
        'CbteFch' 	: date, // (Opcional) Fecha del comprobante (yyyymmdd) o fecha actual si es nulo
        'ImpTotal' 	: totalVenta, // Importe total del comprobante
        'ImpTotConc': 0, // Importe neto no gravado
        'ImpNeto' 	: importeTotalNeto, // Importe neto gravado
        'ImpOpEx' 	: 0, // Importe exento de IVA
        'ImpIVA' 	: importeTotalIva, //Importe total de IVA
        'ImpTrib' 	: 0, //Importe total de tributos
        'MonId' 	: 'PES', //Tipo de moneda usada en el comprobante (ver tipos disponibles)('PES' para pesos argentinos) 
        'MonCotiz' 	: 1, // Cotización de la moneda usada (1 para pesos argentinos)
        'Iva'       : []
    };
    
    if(baseImp21 > 0){
        voucherB.Iva.push(
            {
                'Id' 		: 5, // Id del tipo de IVA (ver tipos disponibles) 
                'BaseImp' 	: baseImp21, // Base imponible
                'Importe' 	: importIva21 // Importe
            }
        )
    }

    if(baseImp10 > 0){
        voucherB.Iva.push(
            {
                'Id' 		: 4, // Id del tipo de IVA (ver tipos disponibles) 
                'BaseImp' 	: baseImp10, // Base imponible
                'Importe' 	: importIva10 // Importe
            }
        )
    }

    if(baseImp27 > 0){
        voucherB.Iva.push(
            {
                'Id' 		: 6, // Id del tipo de IVA (ver tipos disponibles) 
                'BaseImp' 	: baseImp27, // Base imponible
                'Importe' 	: importIva27// Importe
            }
        )
    }

    if(asociatedReceipt){
        voucherB.CbtesAsoc = asociatedReceipt;
    }

    return voucherB;
}

export function formatReceiptC(object){
    const { ptoVentaId, receiptCode, clientCuit, numberOfReceipt, date, totalVenta, asociatedReceipt } = object;
    let voucherC = {
        'CantReg' 	: 1, // Cantidad de comprobantes a registrar
        'PtoVta' 	: ptoVentaId, // Punto de venta
        'CbteTipo' 	: receiptCode, // Tipo de comprobante (ver tipos disponibles) 
        'Concepto' 	: 1, // Concepto del Comprobante: (1)Productos, (2)Servicios, (3)Productos y Servicios
        'DocTipo' 	: 96, // Tipo de documento del comprador (ver tipos disponibles)
        'DocNro' 	: clientCuit, // Numero de documento del comprador
        'CbteDesde' : numberOfReceipt, // Numero de comprobante o numero del primer comprobante en caso de ser mas de uno
        'CbteHasta' : numberOfReceipt, // Numero de comprobante o numero del ultimo comprobante en caso de ser mas de uno
        'CbteFch' 	: date, // (Opcional) Fecha del comprobante (yyyymmdd) o fecha actual si es nulo
        'ImpTotal' 	: totalVenta, // Importe total del comprobante
        'ImpTotConc': 0, // Importe neto no gravado
        'ImpNeto' 	: totalVenta, // Importe neto gravado
        'ImpOpEx' 	: 0, // Importe exento de IVA
        'ImpIVA' 	: 0, //Importe total de IVA
        'ImpTrib' 	: 0, //Importe total de tributos
        'MonId' 	: 'PES', //Tipo de moneda usada en el comprobante (ver tipos disponibles)('PES' para pesos argentinos) 
        'MonCotiz' 	: 1, // Cotización de la moneda usada (1 para pesos argentinos)
    };
    
    if(asociatedReceipt){
        voucherC.CbtesAsoc = asociatedReceipt;
    }

    return voucherC;
}