import { ConectorPlugin } from "../helpers/conectorPlugin";
let logo = "";
let infoCantUni="";
let precioTotal = ``;
let espacios = 0;
let espacioss = "";
let lineaProd=``;
let imagen = false;

export  function printReceipt(comprobante,nombreImpresora,ancho){
      const namePrint = nombreImpresora;
      switch (comprobante.nombreDocumento) {
        case "Ticket X":
          if(ancho === '58mm'){
            ticketX58(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.totalRecargos,
              comprobante.totalDescuentos,comprobante.subTotal,comprobante.nombreDocumento,namePrint)
          }else{
            ticketX(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.totalRecargos,
              comprobante.totalDescuentos,comprobante.subTotal,comprobante.nombreDocumento,namePrint)
          }
          break;

        case "Nota de débito x":
          if(ancho === '58mm'){
            notaDebitoX58(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,namePrint)
            break;
          }else{
            notaDebitoX(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,namePrint)
          }
          break;

        case "Nota de crédito x":
          if(ancho === '58mm'){
            notaCreditoX58(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,namePrint)
          }else{
            notaCreditoX(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,namePrint)
          }

          break;

        case "FACTURAS C":
          if(ancho==='58mm'){
            facturaC58(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.totalRecargos,
              comprobante.totalDescuentos,comprobante.subTotal,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
              ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto,nombreImpresora)
          }else{
            facturaC(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.totalRecargos,
              comprobante.totalDescuentos,comprobante.subTotal,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
              ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto,nombreImpresora)
          }

          break;

        case "NOTAS DE DEBITO C":
          if(ancho==='58mm'){
            notaDebitoC58(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
              ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto,nombreImpresora)
          }else{
            notaDebitoC(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
              ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto,nombreImpresora)
          }

          break;

        case "NOTAS DE CREDITO C":
          if(ancho === '58mm'){
            notaCreditoC58(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
              ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto,nombreImpresora)
          }else{
            notaCreditoC(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
              ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto,nombreImpresora)
          }

          break;

        case "FACTURAS B":
          if(ancho === '58mm'){
            facturaB58(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.totalRecargos,
              comprobante.totalDescuentos,comprobante.subTotal,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
              ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto,nombreImpresora)
          }else{
            facturaB(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.totalRecargos,
              comprobante.totalDescuentos,comprobante.subTotal,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
              ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto,nombreImpresora)
          }

          break;

        case "NOTAS DE DEBITO B":
          if(ancho === '58mm'){
            notaDebitoB58(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
                        ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto,
                        comprobante.totalIva21,comprobante.totalIva10,comprobante.totalIva27,nombreImpresora)
          }else{
            notaDebitoB(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
                        ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto,
                        comprobante.totalIva21,comprobante.totalIva10,comprobante.totalIva27,nombreImpresora)
          }

          break;

        case "NOTAS DE CREDITO B":
          if(ancho === '58mm'){
            notaCreditoB58(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
              ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto, 
              comprobante.totalIva21,comprobante.totalIva10,comprobante.totalIva27,nombreImpresora)
          }else{
            notaCreditoB(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
              ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto, 
              comprobante.totalIva21,comprobante.totalIva10,comprobante.totalIva27,nombreImpresora)
          }

          break;

        case "FACTURAS A":
          if(ancho === '58mm'){
            facturaA58(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.totalRecargos,
              comprobante.totalDescuentos,comprobante.subTotal,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
              ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto,
              comprobante.totalIva21,comprobante.totalIva10,comprobante.totalIva27, nombreImpresora)
          }else{
            facturaA(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.totalRecargos,
              comprobante.totalDescuentos,comprobante.subTotal,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
              ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto,
              comprobante.totalIva21,comprobante.totalIva10,comprobante.totalIva27, nombreImpresora)
          }

          break;

        case "NOTAS DE DEBITO A":
          if(ancho === '58mm'){
            notaDebitoA58(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
              ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto,
              comprobante.totalIva21,comprobante.totalIva10,comprobante.totalIva27,nombreImpresora)
          }else{
            notaDebitoA(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
              ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto,
              comprobante.totalIva21,comprobante.totalIva10,comprobante.totalIva27,nombreImpresora)
          }

          break;

        case "NOTAS DE CREDITO A":
          if(ancho === '58mm'){
            notaCreditoA58(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
              ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto,
              comprobante.totalIva21,comprobante.totalIva10,comprobante.totalIva27,nombreImpresora)
          }else{
            notaCreditoA(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
              ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto,
              comprobante.totalIva21,comprobante.totalIva10,comprobante.totalIva27,nombreImpresora)
          }

          break;

        default:
          break;
      }
}

export  function printBarCodes(listBars,nombreImpresora,ancho){ 

  if(ancho === '58mm'){
    console.log("58mm");
    const conector = new ConectorPlugin()
    listBars.forEach(barCode => {
      conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
              .texto(`${barCode.nombre}\n`)
              .codigoDeBarras(barCode.codigoBarra, ConectorPlugin.Constantes.AccionBarcode39)
              .texto('\n')
    });
      conector.cortar()
              .feed(2)
              .imprimirEn(nombreImpresora)
  }else{
    const conector = new ConectorPlugin()
    listBars.forEach(barCode => {
      conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
              .texto(`${barCode.nombre}\n`)
              .codigoDeBarras(barCode.codigoBarra, ConectorPlugin.Constantes.AccionBarcode39)
              .texto(`${barCode.codigoBarra}\n`)
              .texto('\n')
    });
      conector.cortar()
              .feed(2)
              .imprimirEn(nombreImpresora)
  }

}

function ticketX(listProduct,nameEmpresa,totalVenta,totalRecargos,
                 totalDescuentos,subTotal,nombreDocumento,nombreImpresora){
  switch (nameEmpresa) {
    case "servipack":
        logo = "https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png";
        imagen = true;
      break;

    default:
      imagen = false;
      break;
  }
  const conector = new ConectorPlugin()
  if(imagen){
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenDesdeUrl(logo)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  }

    conector.texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .establecerTamanioFuente(2, 2)
            .establecerEnfatizado(1)
            .texto(`${nombreDocumento}\n`)
            .establecerTamanioFuente(1, 1)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerEnfatizado(1)
            .textoConAcentos(`Descripción                              IMPORTE\n`)
            .establecerEnfatizado(0)
            .texto(`Cantidad/Precio unitario\n`)
            .texto(`------------------------------------------------\n`);
  for (let i = 0; i < listProduct.length; i++) {
    conector.establecerEnfatizado(1)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`${listProduct[i].nombre}\n`)
            .establecerEnfatizado(0);
    infoCantUni = `Uni: ${listProduct[i].cantUnidades} /  $ ${listProduct[i].precioUnitario}`;
    precioTotal = `${(listProduct[i].cantUnidades*listProduct[i].precioUnitario).toFixed(2)}`;
    espacios = 48 - (precioTotal.length + infoCantUni.length)
    espacioss = ""
    for(let h =0; h<espacios; h++){
      espacioss += " "
    }
    lineaProd = infoCantUni+espacioss+precioTotal
    conector.texto(`${lineaProd}\n`)
            .texto(`------------------------------------------------\n`)
  }
   conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .establecerEnfatizado(1)
            .texto(`Subtotal:                         $ ${subTotal}\n`)
            .texto(`Descuentos:                       $ ${totalDescuentos} \n`)
            .texto(`Recargos:                         $ ${totalRecargos}\n`)
            .texto(`TOTAL:                            $ ${totalVenta}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .texto(`Gracias por su Compra!\n`)
            .texto(`Visite nuestra página WEB!\n`)
            .texto(`www.prysoft.com.ar\n`)
            .cortar()
            .feed(4)
            .imprimirEn(nombreImpresora)
}

function ticketX58(listProduct,nameEmpresa,totalVenta,totalRecargos,
                   totalDescuentos,subTotal,nombreDocumento,nombreImpresora){

  switch (nameEmpresa) {
    case "servipack":
      logo = "https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png";
      imagen = true;
    break;

    default:
    imagen = false;
    break;
  }
  const conector = new ConectorPlugin()

  conector.texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerTamanioFuente(2, 2)
          .establecerEnfatizado(1)
          .texto(`${nombreDocumento}\n`)
          .establecerTamanioFuente(1, 1)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .establecerEnfatizado(0)
          .texto(`--------------------------------\n`)
          .establecerEnfatizado(1)
          .texto(`Descripcion              IMPORTE\n`)
          .establecerEnfatizado(0)
          .texto(`Cant/Precio unitario\n`)
          .texto(`--------------------------------\n`);
  for (let i = 0; i < listProduct.length; i++) {
  conector.establecerEnfatizado(1)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`${listProduct[i].nombre}\n`)
          .establecerEnfatizado(0);
    infoCantUni = `Uni: ${listProduct[i].cantUnidades} /  $ ${listProduct[i].precioUnitario}`;
    precioTotal = `${(listProduct[i].cantUnidades*listProduct[i].precioUnitario).toFixed(2)}`;
    espacios = 32 - (precioTotal.length + infoCantUni.length)
    espacioss = ""
    for(let h =0; h<espacios; h++){
      espacioss += " "
    }
    lineaProd = infoCantUni+espacioss+precioTotal
    conector.texto(`${lineaProd}\n`)
            .texto(`--------------------------------\n`)
  }
  conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .establecerEnfatizado(1)
          .texto(`Subtotal:         $ ${subTotal}\n`)
          .texto(`Descuentos:       $ ${totalDescuentos} \n`)
          .texto(`Recargos:         $ ${totalRecargos}\n`)
          .texto(`TOTAL:            $ ${totalVenta}\n`)
          .establecerEnfatizado(0)
          .texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .texto(`Gracias por su Compra!\n`)
          .texto(`Visite nuestra pagina WEB!\n`)
          .texto(`www.prysoft.com.ar\n`)
          .feed(4)
          .imprimirEn(nombreImpresora)
  }

function notaDebitoX(listProduct,nameEmpresa,totalVenta,nombreImpresora){
  switch (nameEmpresa) {
    case "servipack":
        logo = "https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png";
        imagen = true;
      break;

    default:
      imagen = false;
      break;
  }
  const conector = new ConectorPlugin()

  if(imagen){
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenDesdeUrl(logo)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  }

    conector.texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .establecerTamanioFuente(2, 2)
            .establecerEnfatizado(1)
            .texto(`NOTA DE DEBITO X\n`)
            .establecerTamanioFuente(1, 1)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerEnfatizado(1)
            .textoConAcentos(`Descripción                              IMPORTE\n`)
            .establecerEnfatizado(0)
            .texto(`Cantidad/Precio unitario\n`)
            .texto(`------------------------------------------------\n`);
  for (let i = 0; i < listProduct.length; i++) {
    conector.establecerEnfatizado(1)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`${listProduct[i].nombre}\n`)
            .establecerEnfatizado(0);
    infoCantUni = `Uni: ${listProduct[i].cantUnidades} /  $ ${listProduct[i].precioUnitario}`;
    precioTotal = `${(listProduct[i].cantUnidades*listProduct[i].precioUnitario).toFixed(2)}`;
    espacios = 48 - (precioTotal.length + infoCantUni.length)
    espacioss = ""
    for(let h =0; h<espacios; h++){
      espacioss += " "
    }
    lineaProd = infoCantUni+espacioss+precioTotal
    conector.texto(`${lineaProd}\n`)
            .texto(`------------------------------------------------\n`)
  }
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .establecerEnfatizado(1)
            .texto(`TOTAL:                            $ ${Number(totalVenta).toFixed(2)}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .texto(`Gracias por su Compra!\n`)
            .texto(`Visite nuestra página WEB!\n`)
            .texto(`www.prysoft.com.ar\n`)
            .cortar()
            .feed(4)
            .imprimirEn(nombreImpresora);
}

function notaDebitoX58(listProduct,nameEmpresa,totalVenta,nombreImpresora){
  switch (nameEmpresa) {
    case "servipack":
        logo = "https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png";
        imagen = true;
      break;

    default:
      imagen = false;
      break;
  }
  const conector = new ConectorPlugin()

  if(imagen){
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenDesdeUrl(logo)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  }

    conector.texto(`--------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .establecerTamanioFuente(2, 2)
            .establecerEnfatizado(1)
            .texto(`NOTA DE DEBITO X\n`)
            .establecerTamanioFuente(1, 1)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .establecerEnfatizado(0)
            .texto(`--------------------------------\n`)
            .establecerEnfatizado(1)
            .texto(`Descripcion              IMPORTE\n`)
            .establecerEnfatizado(0)
            .texto(`Cantidad/Precio unitario\n`)
            .texto(`--------------------------------\n`);
  for (let i = 0; i < listProduct.length; i++) {
    conector.establecerEnfatizado(1)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`${listProduct[i].nombre}\n`)
            .establecerEnfatizado(0);
    infoCantUni = `Uni: ${listProduct[i].cantUnidades} /  $ ${listProduct[i].precioUnitario}`;
    precioTotal = `${(listProduct[i].cantUnidades*listProduct[i].precioUnitario).toFixed(2)}`;
    espacios = 32 - (precioTotal.length + infoCantUni.length)
    espacioss = ""
    for(let h =0; h<espacios; h++){
      espacioss += " "
    }
    lineaProd = infoCantUni+espacioss+precioTotal
    conector.texto(`${lineaProd}\n`)
            .texto(`--------------------------------\n`)
  }
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .establecerEnfatizado(1)
            .texto(`TOTAL:            $ ${Number(totalVenta).toFixed(2)}\n`)
            .establecerEnfatizado(0)
            .texto(`--------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .texto(`Gracias por su Compra!\n`)
            .texto(`Visite nuestra pagina WEB!\n`)
            .texto(`www.prysoft.com.ar\n`)
            .cortar()
            .feed(4)
            .imprimirEn(nombreImpresora);
}

function notaCreditoX(listProduct,nameEmpresa,totalVenta,nombreImpresora){
  switch (nameEmpresa) {
    case "servipack":
        logo = "https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png";
        imagen = true;
      break;

    default:
      imagen = false;
      break;
  }

  const conector = new ConectorPlugin()

  if(imagen){
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenDesdeUrl(logo)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  }

    conector.texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .establecerTamanioFuente(2, 2)
            .establecerEnfatizado(1)
            .texto(`NOTA DE CREDITO X\n`)
            .establecerTamanioFuente(1, 1)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerEnfatizado(1)
            .textoConAcentos(`Descripción                              IMPORTE\n`)
            .establecerEnfatizado(0)
            .texto(`Cantidad/Precio unitario\n`)
            .texto(`------------------------------------------------\n`);
  for (let i = 0; i < listProduct.length; i++) {
    conector.establecerEnfatizado(1)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`${listProduct[i].nombre}\n`)
            .establecerEnfatizado(0);
    infoCantUni = `Uni: ${listProduct[i].cantUnidades} /  $ ${listProduct[i].precioUnitario}`;
    precioTotal = `${(listProduct[i].cantUnidades*listProduct[i].precioUnitario).toFixed(2)}`;
    espacios = 48 - (precioTotal.length + infoCantUni.length)
    espacioss = ""
    for(let h =0; h<espacios; h++){
      espacioss += " "
    }
    lineaProd = infoCantUni+espacioss+precioTotal
    conector.texto(`${lineaProd}\n`)
            .texto(`------------------------------------------------\n`)
  }
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .establecerEnfatizado(1)
            .texto(`TOTAL:                            $ ${Number(totalVenta).toFixed(2)}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .texto(`Gracias por su Compra!\n`)
            .texto(`Visite nuestra página WEB!\n`)
            .texto(`www.prysoft.com.ar\n`)
            .cortar()
            .feed(4)
            .imprimirEn(nombreImpresora);
}

function notaCreditoX58(listProduct,nameEmpresa,totalVenta,nombreImpresora){
  switch (nameEmpresa) {
    case "servipack":
        logo = "https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png";
        imagen = true;
      break;

    default:
      imagen = false;
      break;
  }

  const conector = new ConectorPlugin()

  if(imagen){
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenDesdeUrl(logo)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  }

    conector.texto(`--------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .establecerTamanioFuente(2, 2)
            .establecerEnfatizado(1)
            .texto(`NOTA DE CREDITO X\n`)
            .establecerTamanioFuente(1, 1)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .establecerEnfatizado(0)
            .texto(`--------------------------------\n`)
            .establecerEnfatizado(1)
            .texto(`Descripcion              IMPORTE\n`)
            .establecerEnfatizado(0)
            .texto(`Cantidad/Precio unitario\n`)
            .texto(`--------------------------------\n`);
  for (let i = 0; i < listProduct.length; i++) {
    conector.establecerEnfatizado(1)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`${listProduct[i].nombre}\n`)
            .establecerEnfatizado(0);
    infoCantUni = `Uni: ${listProduct[i].cantUnidades} /  $ ${listProduct[i].precioUnitario}`;
    precioTotal = `${(listProduct[i].cantUnidades*listProduct[i].precioUnitario).toFixed(2)}`;
    espacios = 32 - (precioTotal.length + infoCantUni.length)
    espacioss = ""
    for(let h =0; h<espacios; h++){
      espacioss += " "
    }
    lineaProd = infoCantUni+espacioss+precioTotal
    conector.texto(`${lineaProd}\n`)
            .texto(`--------------------------------\n`)
  }
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .establecerEnfatizado(1)
            .texto(`TOTAL:            $ ${Number(totalVenta).toFixed(2)}\n`)
            .establecerEnfatizado(0)
            .texto(`--------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .texto(`Gracias por su Compra!\n`)
            .texto(`Visite nuestra pagina WEB!\n`)
            .texto(`www.prysoft.com.ar\n`)
            .cortar()
            .feed(4)
            .imprimirEn(nombreImpresora);
}

function facturaA(listProduct,nameEmpresa,totalVenta,totalRecargos,
                totalDescuentos,subTotal,barCode,cae,cliente,empresa
                ,fechaEmision,numeroCbte,fechaVto,
                totalIva21,totalIva10,totalIva27,nombreImpresora){

  switch (nameEmpresa) {
    case "servipack":
        logo = "https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png";
        imagen = true;
      break;

    default:
      imagen = false;
      break;
  }

  const conector = new ConectorPlugin()

  if(imagen){
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .imagenDesdeUrl(logo)
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  }

  conector.texto(`------------------------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerEnfatizado(1)
          .establecerTamanioFuente(1, 1)
          .texto(`${empresa.razonSocial}\n`)
          .establecerEnfatizado(0)
          .texto(`CUIT:${empresa.cuit}  Ingresos Brutos:${empresa.ingBruto}\n`)
          .texto(`Inicio de actividades: ${empresa.fechaInicioAct}\n`)
          .texto(`${empresa.condicionIva.nombre}\n`)
          .texto(`A ${cliente.condicionIva.nombre}\n`)
          .texto(`EMICION:${fechaEmision}  Nro. Cbte.:${numeroCbte}\n`)
          .texto(`------------------------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerTamanioFuente(2, 2)
          .establecerEnfatizado(1)
          .texto(`FACTURA A\n`)
          .establecerEnfatizado(0)
          .establecerTamanioFuente(1, 1)
          .texto(`ORIGINAL   Cod.0001\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`------------------------------------------------\n`)
          .texto(`Cliente:   ${cliente.nombre}\n`)
          .texto(`Cuit:      ${cliente.cuit}\n`)
          .texto(`Condicion: ${cliente.razonSocial}\n`)
          .texto(`------------------------------------------------\n`)
          .establecerEnfatizado(1)
          .textoConAcentos(`Descripción                              IMPORTE\n`)
          .establecerEnfatizado(0)
          .texto(`Cantidad/Precio unitario\n`)
          .texto(`------------------------------------------------\n`);
  for (let i = 0; i < listProduct.length; i++) {
  conector.establecerEnfatizado(1)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`${listProduct[i].nombre}\n`)
          .establecerEnfatizado(0);
  infoCantUni = `Uni: ${listProduct[i].cantUnidades} /  $ ${listProduct[i].precioUnitario}`;
  precioTotal = `${(listProduct[i].cantUnidades*listProduct[i].precioUnitario).toFixed(2)}`;
  espacios = 48 - (precioTotal.length + infoCantUni.length)
  espacioss = ""
  for(let h =0; h<espacios; h++){
    espacioss += " "
  }
  lineaProd = infoCantUni+espacioss+precioTotal
  conector.texto(`${lineaProd}\n`)
          .texto(`------------------------------------------------\n`)
}
  conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .establecerEnfatizado(1)
          .texto(`Subtotal:                         $ ${subTotal.toFixed(2)}\n`)
          .texto(`Descuentos:                       $ ${totalDescuentos.toFixed(2)} \n`)
          .texto(`Recargos:                         $ ${totalRecargos.toFixed(2)}\n`)
          .texto(`TOTAL:                            $ ${totalVenta.toFixed(2)}\n`)
          .establecerEnfatizado(0)
          .texto(`------------------------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .establecerEnfatizado(1)
          .texto(`Iva 27%:                          $ ${totalIva27}\n`)
          .texto(`Iva 21%:                          $ ${totalIva21} \n`)
          .texto(`Iva 10.5%:                        $ ${totalIva10}\n`)
          .establecerEnfatizado(0)
          .texto(`------------------------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .imagenDesdeUrl("https://i.ibb.co/HPKqQVv/qeafip.png")
          .texto(`${barCode}\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`C.A.E: ${cae}\n`)
          .texto(`Vencimiento: ${fechaVto}\n`)
          .texto(`------------------------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .texto(`Gracias por su Compra!\n`)
          .texto(`Visite nuestra página WEB!\n`)
          .texto(`www.prysoft.com.ar\n`)
          .cortar()
          .feed(4)
    .imprimirEn(nombreImpresora);
}

function facturaA58(listProduct,nameEmpresa,totalVenta,totalRecargos,
                    totalDescuentos,subTotal,barCode,cae,cliente,empresa
                    ,fechaEmision,numeroCbte,fechaVto,
                    totalIva21,totalIva10,totalIva27,nombreImpresora){

  switch (nameEmpresa) {
    case "servipack":
      logo = "https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png";
      imagen = true;
    break;

    default:
      imagen = false;
    break;
  }

  const conector = new ConectorPlugin()

  if(imagen){
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenDesdeUrl(logo)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  }

  conector.texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerEnfatizado(1)
          .establecerTamanioFuente(1, 1)
          .texto(`${empresa.razonSocial}\n`)
          .establecerEnfatizado(0)
          .texto(`CUIT:${empresa.cuit}\n`)
          .texto(`Ingresos Brutos:${empresa.ingBruto}\n`)
          .texto(`Inicio de actividades:\n`)
          .texto(`${empresa.fechaInicioAct}\n`)
          .texto(`${empresa.condicionIva.nombre}\n`)
          .texto(`A ${cliente.condicionIva.nombre}\n`)
          .texto(`EMICION:${fechaEmision}\n`)
          .texto(`Nro. Cbte.:${numeroCbte}\n`)
          .texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerTamanioFuente(2, 2)
          .establecerEnfatizado(1)
          .texto(`FACTURA A\n`)
          .establecerEnfatizado(0)
          .establecerTamanioFuente(1, 1)
          .texto(`ORIGINAL   Cod.0001\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`--------------------------------\n`)
          .texto(`Cliente:   ${cliente.nombre}\n`)
          .texto(`Cuit:      ${cliente.cuit}\n`)
          .texto(`Condicion: ${cliente.razonSocial}\n`)
          .texto(`--------------------------------\n`)
          .establecerEnfatizado(1)
          .texto(`Descripcion              IMPORTE\n`)
          .establecerEnfatizado(0)
          .texto(`Cantidad/Precio unitario\n`)
          .texto(`--------------------------------\n`);
  for (let i = 0; i < listProduct.length; i++) {
    conector.establecerEnfatizado(1)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`${listProduct[i].nombre}\n`)
            .establecerEnfatizado(0);
    infoCantUni = `Uni: ${listProduct[i].cantUnidades} /  $ ${listProduct[i].precioUnitario}`;
    precioTotal = `${(listProduct[i].cantUnidades*listProduct[i].precioUnitario).toFixed(2)}`;
    espacios = 32 - (precioTotal.length + infoCantUni.length)
    espacioss = ""
  for(let h =0; h<espacios; h++){
    espacioss += " "
    }
    lineaProd = infoCantUni+espacioss+precioTotal
    conector.texto(`${lineaProd}\n`)
            .texto(`--------------------------------\n`)
  }
  conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  .establecerEnfatizado(1)
  .texto(`Subtotal:         $ ${subTotal.toFixed(2)}\n`)
  .texto(`Descuentos:       $ ${totalDescuentos.toFixed(2)} \n`)
  .texto(`Recargos:         $ ${totalRecargos.toFixed(2)}\n`)
  .texto(`TOTAL:            $ ${totalVenta.toFixed(2)}\n`)
  .establecerEnfatizado(0)
  .texto(`--------------------------------\n`)
  .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  .establecerEnfatizado(1)
  .texto(`Iva 27%:          $ ${totalIva27}\n`)
  .texto(`Iva 21%:          $ ${totalIva21} \n`)
  .texto(`Iva 10.5%:        $ ${totalIva10}\n`)
  .establecerEnfatizado(0)
  .texto(`--------------------------------\n`)
  .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
  .imagenDesdeUrl("https://i.ibb.co/HPKqQVv/qeafip.png")
  .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  .texto('\n')
  .texto(`C.A.E: ${cae}\n`)
  .texto(`Vencimiento: ${fechaVto}\n`)
  .texto(`--------------------------------\n`)
  .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
  .texto(`Gracias por su Compra!\n`)
  .texto(`Visite nuestra pagina WEB!\n`)
  .texto(`www.prysoft.com.ar\n`)
  .cortar()
  .feed(4)
  .imprimirEn(nombreImpresora);
}

function notaDebitoA(listProduct,nameEmpresa,totalVenta,barCode,cae,cliente,empresa
                      ,fechaEmision,numeroCbte,fechaVto,
                      totalIva21,totalIva10,totalIva27,nombreImpresora){
  switch (nameEmpresa) {
    case "servipack":
        logo = "https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png";
        imagen = true;
      break;

    default:
      imagen = false;
      break;
  }

  const conector = new ConectorPlugin()

  if(imagen){
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenDesdeUrl(logo)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  }

    conector.texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .establecerEnfatizado(1)
            .establecerTamanioFuente(1, 1)
            .texto(`${empresa.razonSocial}\n`)
            .establecerEnfatizado(0)
            .texto(`CUIT:${empresa.cuit}  Ingresos Brutos:${empresa.ingBruto}\n`)
            .texto(`Inicio de actividades: ${empresa.fechaInicioAct}\n`)
            .texto(`${empresa.condicionIva.nombre}\n`)
            .texto(`A ${cliente.condicionIva.nombre}\n`)
            .texto(`EMICION:${fechaEmision}  Nro. Cbte.:${numeroCbte}\n`)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .establecerTamanioFuente(2, 2)
            .establecerEnfatizado(1)
            .texto(`NOTA DE DEBITO A\n`)
            .establecerEnfatizado(0)
            .establecerTamanioFuente(1, 1)
            .texto(`ORIGINAL   Cod.0002\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`------------------------------------------------\n`)
            .texto(`Cliente:   ${cliente.nombre}\n`)
            .texto(`Cuit:      ${cliente.cuit}\n`)
            .texto(`Condicion: ${cliente.razonSocial}\n`)
            .texto(`------------------------------------------------\n`)
            .establecerEnfatizado(1)
            .textoConAcentos(`Descripción                              IMPORTE\n`)
            .establecerEnfatizado(0)
            .texto(`Cantidad/Precio unitario\n`)
            .texto(`------------------------------------------------\n`);
  for (let i = 0; i < listProduct.length; i++) {
    conector.establecerEnfatizado(1)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`${listProduct[i].nombre}\n`)
            .establecerEnfatizado(0);
    infoCantUni = `Uni: ${listProduct[i].cantUnidades} /  $ ${listProduct[i].precioUnitario}`;
    precioTotal = `${(listProduct[i].cantUnidades*listProduct[i].precioUnitario).toFixed(2)}`;
    espacios = 48 - (precioTotal.length + infoCantUni.length)
    espacioss = ""
    for(let h =0; h<espacios; h++){
      espacioss += " "
    }
    lineaProd = infoCantUni+espacioss+precioTotal
    conector.texto(`${lineaProd}\n`)
            .texto(`------------------------------------------------\n`)
  }
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .establecerEnfatizado(1)
            .texto(`TOTAL:                            $ ${totalVenta}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .establecerEnfatizado(1)
            .texto(`Iva 27%:                          $ ${totalIva27}\n`)
            .texto(`Iva 21%:                          $ ${(Number(totalVenta) - (Number(totalVenta)/1.21)).toFixed(2)} \n`)
            .texto(`Iva 10.5%:                        $ ${totalIva10}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenDesdeUrl("https://i.ibb.co/HPKqQVv/qeafip.png")
            .texto(`${barCode}\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`C.A.E: ${cae}\n`)
            .texto(`Vencimiento: ${fechaVto}\n`)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .texto(`Gracias por su Compra!\n`)
            .texto(`Visite nuestra página WEB!\n`)
            .texto(`www.prysoft.com.ar\n`)
            .cortar()
            .feed(4)
      .imprimirEn(nombreImpresora);
}

function notaDebitoA58(listProduct,nameEmpresa,totalVenta,barCode,cae,cliente,empresa
                      ,fechaEmision,numeroCbte,fechaVto,
                      totalIva21,totalIva10,totalIva27,nombreImpresora){
  switch (nameEmpresa) {
    case "servipack":
      logo = "https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png";
      imagen = true;
    break;

    default:
      imagen = false;
    break;
  }

  const conector = new ConectorPlugin()

  if(imagen){
  conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .imagenDesdeUrl(logo)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  }

  conector.texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerEnfatizado(1)
          .establecerTamanioFuente(1, 1)
          .texto(`${empresa.razonSocial}\n`)
          .establecerEnfatizado(0)
          .texto(`CUIT:${empresa.cuit}\n`)
          .texto(`Ingresos Brutos:${empresa.ingBruto}\n`)
          .texto(`Inicio de actividades:\n`)
          .texto(`${empresa.fechaInicioAct}\n`)
          .texto(`${empresa.condicionIva.nombre}\n`)
          .texto(`A ${cliente.condicionIva.nombre}\n`)
          .texto(`EMICION:${fechaEmision}\n`)
          .texto(`Nro. Cbte.:${numeroCbte}\n`)
          .texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerTamanioFuente(2, 2)
          .establecerEnfatizado(1)
          .texto(`NOTA DE DEBITO A\n`)
          .establecerEnfatizado(0)
          .establecerTamanioFuente(1, 1)
          .texto(`ORIGINAL   Cod.0002\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`--------------------------------\n`)
          .texto(`Cliente:   ${cliente.nombre}\n`)
          .texto(`Cuit:      ${cliente.cuit}\n`)
          .texto(`Condicion: ${cliente.razonSocial}\n`)
          .texto(`--------------------------------\n`)
          .establecerEnfatizado(1)
          .texto(`Descripcion              IMPORTE\n`)
          .establecerEnfatizado(0)
          .texto(`Cantidad/Precio unitario\n`)
          .texto(`--------------------------------\n`);
for (let i = 0; i < listProduct.length; i++) {
  conector.establecerEnfatizado(1)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`${listProduct[i].nombre}\n`)
          .establecerEnfatizado(0);
  infoCantUni = `Uni: ${listProduct[i].cantUnidades} /  $ ${listProduct[i].precioUnitario}`;
  precioTotal = `${(listProduct[i].cantUnidades*listProduct[i].precioUnitario).toFixed(2)}`;
  espacios = 32 - (precioTotal.length + infoCantUni.length)
  espacioss = ""
  for(let h =0; h<espacios; h++){
    espacioss += " "
  }
  lineaProd = infoCantUni+espacioss+precioTotal
  conector.texto(`${lineaProd}\n`)
          .texto(`--------------------------------\n`)
  }
  conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .establecerEnfatizado(1)
          .texto(`TOTAL:            $ ${totalVenta}\n`)
          .establecerEnfatizado(0)
          .texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .establecerEnfatizado(1)
          .texto(`Iva 27%:          $ ${totalIva27}\n`)
          .texto(`Iva 21%:          $ ${(Number(totalVenta) - (Number(totalVenta)/1.21)).toFixed(2)} \n`)
          .texto(`Iva 10.5%:        $ ${totalIva10}\n`)
          .establecerEnfatizado(0)
          .texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .imagenDesdeUrl("https://i.ibb.co/HPKqQVv/qeafip.png")
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto('\n')
          .texto(`C.A.E: ${cae}\n`)
          .texto(`Vencimiento: ${fechaVto}\n`)
          .texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .texto(`Gracias por su Compra!\n`)
          .texto(`Visite nuestra pagina WEB!\n`)
          .texto(`www.prysoft.com.ar\n`)
          .cortar()
          .feed(4)
          .imprimirEn(nombreImpresora);
}

function notaCreditoA(listProduct,nameEmpresa,totalVenta,barCode,cae,cliente,empresa
              ,fechaEmision,numeroCbte,fechaVto,
              totalIva21,totalIva10,totalIva27,nombreImpresora){

  switch (nameEmpresa) {
    case "servipack":
        logo = "https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png";
        imagen = true;
      break;

    default:
      imagen = false;
      break;
  }

  const conector = new ConectorPlugin()

  if(imagen){
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenDesdeUrl(logo)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  }
    conector.texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .establecerEnfatizado(1)
            .establecerTamanioFuente(1, 1)
            .texto(`${empresa.razonSocial}\n`)
            .establecerEnfatizado(0)
            .texto(`CUIT:${empresa.cuit}  Ingresos Brutos:${empresa.ingBruto}\n`)
            .texto(`Inicio de actividades: ${empresa.fechaInicioAct}\n`)
            .texto(`${empresa.condicionIva.nombre}\n`)
            .texto(`A ${cliente.condicionIva.nombre}\n`)
            .texto(`EMICION:${fechaEmision}  Nro. Cbte.:${numeroCbte}\n`)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .establecerTamanioFuente(2, 2)
            .establecerEnfatizado(1)
            .texto(`NOTA DE CREDITO A\n`)
            .establecerEnfatizado(0)
            .establecerTamanioFuente(1, 1)
            .texto(`ORIGINAL   Cod.0003\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`------------------------------------------------\n`)
            .texto(`Cliente:   ${cliente.nombre}\n`)
            .texto(`Cuit:      ${cliente.cuit}\n`)
            .texto(`Condicion: ${cliente.razonSocial}\n`)
            .texto(`------------------------------------------------\n`)
            .establecerEnfatizado(1)
            .textoConAcentos(`Descripción                              IMPORTE\n`)
            .establecerEnfatizado(0)
            .texto(`Cantidad/Precio unitario\n`)
            .texto(`------------------------------------------------\n`);
  for (let i = 0; i < listProduct.length; i++) {
    conector.establecerEnfatizado(1)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`${listProduct[i].nombre}\n`)
            .establecerEnfatizado(0);
    infoCantUni = `Uni: ${listProduct[i].cantUnidades} / $ ${listProduct[i].precioUnitario}`;
    precioTotal = `${(listProduct[i].cantUnidades*listProduct[i].precioUnitario).toFixed(2)}`;
    espacios = 48 - (precioTotal.length + infoCantUni.length)
    espacioss = ""
    for(let h =0; h<espacios; h++){
      espacioss += " "
    }
    lineaProd = infoCantUni+espacioss+precioTotal
    conector.texto(`${lineaProd}\n`)
            .texto(`------------------------------------------------\n`)
  }
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .establecerEnfatizado(1)
            .texto(`TOTAL:                            $ ${totalVenta}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .establecerEnfatizado(1)
            .texto(`Iva 27%:                          $ ${totalIva27}\n`)
            .texto(`Iva 21%:                          $ ${(Number(totalVenta) - (Number(totalVenta)/1.21)).toFixed(2)} \n`)
            .texto(`Iva 10.5%:                        $ ${totalIva10}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenDesdeUrl("https://i.ibb.co/HPKqQVv/qeafip.png")
            .texto(`${barCode}\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`C.A.E: ${cae}\n`)
            .texto(`Vencimiento: ${fechaVto}\n`)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .texto(`Gracias por su Compra!\n`)
            .texto(`Visite nuestra página WEB!\n`)
            .texto(`www.prysoft.com.ar\n`)
            .cortar()
            .feed(4)
          .imprimirEn(nombreImpresora);
}

function notaCreditoA58(listProduct,nameEmpresa,totalVenta,barCode,cae,cliente,empresa
                        ,fechaEmision,numeroCbte,fechaVto,
                        totalIva21,totalIva10,totalIva27,nombreImpresora){

  switch (nameEmpresa) {
    case "servipack":
      logo = "https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png";
      imagen = true;
    break;

    default:
      imagen = false;
    break;
  }

  const conector = new ConectorPlugin()

  if(imagen){
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenDesdeUrl(logo)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
    }
  conector.texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerEnfatizado(1)
          .establecerTamanioFuente(1, 1)
          .texto(`${empresa.razonSocial}\n`)
          .establecerEnfatizado(0)
          .texto(`CUIT:${empresa.cuit}\n`)
          .texto(`Ingresos Brutos:${empresa.ingBruto}\n`)
          .texto(`Inicio de actividades:\n`)
          .texto(`${empresa.fechaInicioAct}\n`)
          .texto(`${empresa.condicionIva.nombre}\n`)
          .texto(`A ${cliente.condicionIva.nombre}\n`)
          .texto(`EMICION:${fechaEmision}\n`)
          .texto(`Nro. Cbte.:${numeroCbte}\n`)
          .texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerTamanioFuente(2, 2)
          .establecerEnfatizado(1)
          .texto(`NOTA DE CREDITO A\n`)
          .establecerEnfatizado(0)
          .establecerTamanioFuente(1, 1)
          .texto(`ORIGINAL   Cod.0003\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`--------------------------------\n`)
          .texto(`Cliente:   ${cliente.nombre}\n`)
          .texto(`Cuit:      ${cliente.cuit}\n`)
          .texto(`Condicion: ${cliente.razonSocial}\n`)
          .texto(`--------------------------------\n`)
          .establecerEnfatizado(1)
          .texto(`Descripcion              IMPORTE\n`)
          .establecerEnfatizado(0)
          .texto(`Cantidad/Precio unitario\n`)
          .texto(`--------------------------------\n`);
for (let i = 0; i < listProduct.length; i++) {
  conector.establecerEnfatizado(1)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`${listProduct[i].nombre}\n`)
          .establecerEnfatizado(0);
  infoCantUni = `Uni: ${listProduct[i].cantUnidades} / $ ${listProduct[i].precioUnitario}`;
  precioTotal = `${(listProduct[i].cantUnidades*listProduct[i].precioUnitario).toFixed(2)}`;
  espacios = 48 - (precioTotal.length + infoCantUni.length)
  espacioss = ""
  for(let h =0; h<espacios; h++){
    espacioss += " "
  }
  lineaProd = infoCantUni+espacioss+precioTotal
  conector.texto(`${lineaProd}\n`)
          .texto(`--------------------------------\n`)
}
conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
        .establecerEnfatizado(1)
        .texto(`TOTAL:            $ ${totalVenta}\n`)
        .establecerEnfatizado(0)
        .texto(`--------------------------------\n`)
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
        .establecerEnfatizado(1)
        .texto(`Iva 27%:          $ ${totalIva27}\n`)
        .texto(`Iva 21%:          $ ${(Number(totalVenta) - (Number(totalVenta)/1.21)).toFixed(2)} \n`)
        .texto(`Iva 10.5%:        $ ${totalIva10}\n`)
        .establecerEnfatizado(0)
        .texto(`--------------------------------\n`)
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
        .imagenDesdeUrl("https://i.ibb.co/HPKqQVv/qeafip.png")
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
        .texto('\n')
        .texto(`C.A.E: ${cae}\n`)
        .texto(`Vencimiento: ${fechaVto}\n`)
        .texto(`--------------------------------\n`)
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
        .texto(`Gracias por su Compra!\n`)
        .texto(`Visite nuestra pagina WEB!\n`)
        .texto(`www.prysoft.com.ar\n`)
        .cortar()
        .feed(4)
        .imprimirEn(nombreImpresora);
}

function facturaB(listProduct,nameEmpresa,totalVenta,totalRecargos,
                  totalDescuentos,subTotal,barCode,cae,cliente,empresa,
                  fechaEmision,numeroCbte,fechaVto,nombreImpresora){
    switch (nameEmpresa) {
    case "servipack":
        logo = "https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png";
        imagen = true;
      break;

    default:
      imagen = false;
      break;
  }

  const conector = new ConectorPlugin()

  if(imagen){
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .imagenDesdeUrl(logo)
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  }

  conector.texto(`------------------------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerEnfatizado(1)
          .establecerTamanioFuente(1, 1)
          .texto(`${empresa.razonSocial}\n`)
          .establecerEnfatizado(0)
          .texto(`CUIT:${empresa.cuit}  Ingresos Brutos:${empresa.ingBruto}\n`)
          .texto(`Inicio de actividades: ${empresa.fechaInicioAct}\n`)
          .texto(`${empresa.condicionIva.nombre}\n`)
          .texto(`A ${cliente.condicionIva.nombre}\n`)
          .texto(`EMICION:${fechaEmision}  Nro. Cbte.:${numeroCbte}\n`)
          .texto(`------------------------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerTamanioFuente(2, 2)
          .establecerEnfatizado(1)
          .texto(`FACTURA B\n`)
          .establecerEnfatizado(0)
          .establecerTamanioFuente(1, 1)
          .texto(`ORIGINAL   Cod.0006\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`------------------------------------------------\n`)
          .texto(`Cliente:   ${cliente.nombre}\n`)
          .texto(`Cuit:      ${cliente.cuit}\n`)
          .texto(`Condicion: ${cliente.razonSocial}\n`)
          .texto(`------------------------------------------------\n`)
          .establecerEnfatizado(1)
          .textoConAcentos(`Descripción                              IMPORTE\n`)
          .establecerEnfatizado(0)
          .texto(`Cantidad/Precio unitario\n`)
          .texto(`------------------------------------------------\n`);
  for (let i = 0; i < listProduct.length; i++) {
  conector.establecerEnfatizado(1)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`${listProduct[i].nombre}\n`)
          .establecerEnfatizado(0);
  infoCantUni = `Uni: ${listProduct[i].cantUnidades} /  $ ${listProduct[i].precioUnitario}`;
  precioTotal = `${(listProduct[i].cantUnidades*listProduct[i].precioUnitario).toFixed(2)}`;
  espacios = 48 - (precioTotal.length + infoCantUni.length)
  espacioss = ""
  for(let h =0; h<espacios; h++){
    espacioss += " "
  }
  lineaProd = infoCantUni+espacioss+precioTotal
  conector.texto(`${lineaProd}\n`)
          .texto(`------------------------------------------------\n`)
  }
  conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .establecerEnfatizado(1)
          .texto(`Subtotal:                         $ ${subTotal}\n`)
          .texto(`Descuentos:                       $ ${totalDescuentos} \n`)
          .texto(`Recargos:                         $ ${totalRecargos}\n`)
          .texto(`TOTAL:                            $ ${totalVenta}\n`)
          .establecerEnfatizado(0)
          .texto(`------------------------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .imagenDesdeUrl("https://i.ibb.co/HPKqQVv/qeafip.png")
          .texto(`${barCode}\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`C.A.E: ${cae}\n`)
          .texto(`Vencimiento: ${fechaVto}\n`)
          .texto(`------------------------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .texto(`Gracias por su Compra!\n`)
          .texto(`Visite nuestra página WEB!\n`)
          .texto(`www.prysoft.com.ar\n`)
          .cortar()
          .feed(4)
    .imprimirEn(nombreImpresora);
}

function facturaB58(listProduct,nameEmpresa,totalVenta,totalRecargos,
                  totalDescuentos,subTotal,barCode,cae,cliente,empresa,
                  fechaEmision,numeroCbte,fechaVto,nombreImpresora){
  switch (nameEmpresa) {
    case "servipack":
      logo = "https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png";
      imagen = true;
    break;

    default:
      imagen = false;
    break;
  }

  const conector = new ConectorPlugin()

  if(imagen){
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenDesdeUrl(logo)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  }

  conector.texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerEnfatizado(1)
          .establecerTamanioFuente(1, 1)
          .texto(`${empresa.razonSocial}\n`)
          .establecerEnfatizado(0)
          .texto(`CUIT:${empresa.cuit}\n`)
          .texto(`Ingresos Brutos:${empresa.ingBruto}\n`)
          .texto(`Inicio de actividades:\n`)
          .texto(`${empresa.fechaInicioAct}\n`)
          .texto(`${empresa.condicionIva.nombre}\n`)
          .texto(`A ${cliente.condicionIva.nombre}\n`)
          .texto(`EMICION:${fechaEmision}\n`)
          .texto(`Nro. Cbte.:${numeroCbte}\n`)
          .texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerTamanioFuente(2, 2)
          .establecerEnfatizado(1)
          .texto(`FACTURA B\n`)
          .establecerEnfatizado(0)
          .establecerTamanioFuente(1, 1)
          .texto(`ORIGINAL   Cod.0006\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`--------------------------------\n`)
          .texto(`Cliente:   ${cliente.nombre}\n`)
          .texto(`Cuit:      ${cliente.cuit}\n`)
          .texto(`Condicion: ${cliente.razonSocial}\n`)
          .texto(`--------------------------------\n`)
          .establecerEnfatizado(1)
          .texto(`Descripcion              IMPORTE\n`)
          .establecerEnfatizado(0)
          .texto(`Cantidad/Precio unitario\n`)
          .texto(`--------------------------------\n`);
for (let i = 0; i < listProduct.length; i++) {
  conector.establecerEnfatizado(1)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`${listProduct[i].nombre}\n`)
          .establecerEnfatizado(0);
  infoCantUni = `Uni: ${listProduct[i].cantUnidades} /  $ ${listProduct[i].precioUnitario}`;
  precioTotal = `${(listProduct[i].cantUnidades*listProduct[i].precioUnitario).toFixed(2)}`;
  espacios = 32 - (precioTotal.length + infoCantUni.length)
  espacioss = ""
  for(let h =0; h<espacios; h++){
    espacioss += " "
  }
  lineaProd = infoCantUni+espacioss+precioTotal
  conector.texto(`${lineaProd}\n`)
          .texto(`--------------------------------\n`)
}
conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
        .establecerEnfatizado(1)
        .texto(`Subtotal:         $ ${subTotal}\n`)
        .texto(`Descuentos:       $ ${totalDescuentos} \n`)
        .texto(`Recargos:         $ ${totalRecargos}\n`)
        .texto(`TOTAL:            $ ${totalVenta}\n`)
        .establecerEnfatizado(0)
        .texto(`--------------------------------\n`)
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
        .imagenDesdeUrl("https://i.ibb.co/HPKqQVv/qeafip.png")
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
        .texto('\n')
        .texto(`C.A.E: ${cae}\n`)
        .texto(`Vencimiento: ${fechaVto}\n`)
        .texto(`--------------------------------\n`)
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
        .texto(`Gracias por su Compra!\n`)
        .texto(`Visite nuestra pagina WEB!\n`)
        .texto(`www.prysoft.com.ar\n`)
        .cortar()
        .feed(4)
        .imprimirEn(nombreImpresora);
}

function notaDebitoB(listProduct,nameEmpresa,totalVenta,barCode,cae,cliente,empresa
                    ,fechaEmision,numeroCbte,fechaVto,
                    totalIva21,totalIva10,totalIva27,nombreImpresora){

  switch (nameEmpresa) {
    case "servipack":
        logo = "https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png";
        imagen = true;
      break;

    default:
      imagen = false;
      break;
  }

  const conector = new ConectorPlugin()

  if(imagen){
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenDesdeUrl(logo)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  }

    conector.texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .establecerEnfatizado(1)
            .establecerTamanioFuente(1, 1)
            .texto(`${empresa.razonSocial}\n`)
            .establecerEnfatizado(0)
            .texto(`CUIT:${empresa.cuit}  Ingresos Brutos:${empresa.ingBruto}\n`)
            .texto(`Inicio de actividades: ${empresa.fechaInicioAct}\n`)
            .texto(`${empresa.condicionIva.nombre}\n`)
            .texto(`A ${cliente.condicionIva.nombre}\n`)
            .texto(`EMICION:${fechaEmision}  Nro. Cbte.:${numeroCbte}\n`)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .establecerTamanioFuente(2, 2)
            .establecerEnfatizado(1)
            .texto(`NOTA DE DEBITO B\n`)
            .establecerEnfatizado(0)
            .establecerTamanioFuente(1, 1)
            .texto(`ORIGINAL   Cod.0007\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`------------------------------------------------\n`)
            .texto(`Cliente:   ${cliente.nombre}\n`)
            .texto(`Cuit:      ${cliente.cuit}\n`)
            .texto(`Condicion: ${cliente.razonSocial}\n`)
            .texto(`------------------------------------------------\n`)
            .establecerEnfatizado(1)
            .textoConAcentos(`Descripción                              IMPORTE\n`)
            .establecerEnfatizado(0)
            .texto(`Cantidad/Precio unitario\n`)
            .texto(`------------------------------------------------\n`);
  for (let i = 0; i < listProduct.length; i++) {
    conector.establecerEnfatizado(1)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`${listProduct[i].nombre}\n`)
            .establecerEnfatizado(0);
    infoCantUni = `Uni: ${listProduct[i].cantUnidades} /  $ ${listProduct[i].precioUnitario}`;
    precioTotal = `${(listProduct[i].cantUnidades*listProduct[i].precioUnitario).toFixed(2)}`;
    espacios = 48 - (precioTotal.length + infoCantUni.length)
    espacioss = ""
    for(let h =0; h<espacios; h++){
      espacioss += " "
    }
    lineaProd = infoCantUni+espacioss+precioTotal
    conector.texto(`${lineaProd}\n`)
            .texto(`------------------------------------------------\n`)
  }
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .establecerEnfatizado(1)
            .texto(`TOTAL:                            $ ${totalVenta}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .establecerEnfatizado(1)
            .texto(`Iva 27%:                          $ ${totalIva27}\n`)
            .texto(`Iva 21%:                          $ ${(Number(totalVenta) - (Number(totalVenta)/1.21)).toFixed(2)} \n`)
            .texto(`Iva 10.5%:                        $ ${totalIva10}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenDesdeUrl("https://i.ibb.co/HPKqQVv/qeafip.png")
            .texto(`${barCode}\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`C.A.E: ${cae}\n`)
            .texto(`Vencimiento: ${fechaVto}\n`)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .texto(`Gracias por su Compra!\n`)
            .texto(`Visite nuestra página WEB!\n`)
            .texto(`www.prysoft.com.ar\n`)
            .cortar()
            .feed(4)
          .imprimirEn(nombreImpresora);
}

function notaDebitoB58(listProduct,nameEmpresa,totalVenta,barCode,cae,cliente,empresa
                    ,fechaEmision,numeroCbte,fechaVto,
                    totalIva21,totalIva10,totalIva27,nombreImpresora){

  switch (nameEmpresa) {
    case "servipack":
     logo = "https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png";
     imagen = true;
    break;

    default:
     imagen = false;
    break;
  }

  const conector = new ConectorPlugin()

  if(imagen){
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenDesdeUrl(logo)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  }

  conector.texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerEnfatizado(1)
          .establecerTamanioFuente(1, 1)
          .texto(`${empresa.razonSocial}\n`)
          .establecerEnfatizado(0)
          .texto(`CUIT:${empresa.cuit}\n`)
          .texto(`Ingresos Brutos:${empresa.ingBruto}\n`)
          .texto(`Inicio de actividades:\n`)
          .texto(`${empresa.fechaInicioAct}\n`)
          .texto(`${empresa.condicionIva.nombre}\n`)
          .texto(`A ${cliente.condicionIva.nombre}\n`)
          .texto(`EMICION:${fechaEmision}\n`)
          .texto(`Nro. Cbte.:${numeroCbte}\n`)
          .texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerTamanioFuente(2, 2)
          .establecerEnfatizado(1)
          .texto(`NOTA DE DEBITO B\n`)
          .establecerEnfatizado(0)
          .establecerTamanioFuente(1, 1)
          .texto(`ORIGINAL   Cod.0007\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`--------------------------------\n`)
          .texto(`Cliente:   ${cliente.nombre}\n`)
          .texto(`Cuit:      ${cliente.cuit}\n`)
          .texto(`Condicion: ${cliente.razonSocial}\n`)
          .texto(`--------------------------------\n`)
          .establecerEnfatizado(1)
          .texto(`Descripcion              IMPORTE\n`)
          .establecerEnfatizado(0)
          .texto(`Cantidad/Precio unitario\n`)
          .texto(`--------------------------------\n`);
  for (let i = 0; i < listProduct.length; i++) {
    conector.establecerEnfatizado(1)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`${listProduct[i].nombre}\n`)
            .establecerEnfatizado(0);
    infoCantUni = `Uni: ${listProduct[i].cantUnidades} /  $ ${listProduct[i].precioUnitario}`;
    precioTotal = `${(listProduct[i].cantUnidades*listProduct[i].precioUnitario).toFixed(2)}`;
    espacios = 32 - (precioTotal.length + infoCantUni.length)
    espacioss = ""
    for(let h =0; h<espacios; h++){
     espacioss += " "
    }
    lineaProd = infoCantUni+espacioss+precioTotal
    conector.texto(`${lineaProd}\n`)
            .texto(`--------------------------------\n`)
  }
  conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .establecerEnfatizado(1)
          .texto(`TOTAL:            $ ${totalVenta}\n`)
          .establecerEnfatizado(0)
          .texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .establecerEnfatizado(1)
          .texto(`Iva 27%:          $ ${totalIva27}\n`)
          .texto(`Iva 21%:          $ ${(Number(totalVenta) - (Number(totalVenta)/1.21)).toFixed(2)} \n`)
          .texto(`Iva 10.5%:        $ ${totalIva10}\n`)
          .establecerEnfatizado(0)
          .texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .imagenDesdeUrl("https://i.ibb.co/HPKqQVv/qeafip.png")
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto('\n')
          .texto(`C.A.E: ${cae}\n`)
          .texto(`Vencimiento: ${fechaVto}\n`)
          .texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .texto(`Gracias por su Compra!\n`)
          .texto(`Visite nuestra pagina WEB!\n`)
          .texto(`www.prysoft.com.ar\n`)
          .cortar()
          .feed(4)
          .imprimirEn(nombreImpresora);
}

function notaCreditoB(listProduct,nameEmpresa,totalVenta,barCode,cae,cliente,empresa
                      ,fechaEmision,numeroCbte,fechaVto,
                      totalIva21,totalIva10,totalIva27,nombreImpresora){

  switch (nameEmpresa) {
    case "servipack":
        logo = "https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png";
        imagen = true;
      break;

    default:
      imagen = false;
      break;
  }

  const conector = new ConectorPlugin()

  if(imagen){
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenDesdeUrl(logo)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  }

  conector.texto(`------------------------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerEnfatizado(1)
          .establecerTamanioFuente(1, 1)
          .texto(`${empresa.razonSocial}\n`)
          .establecerEnfatizado(0)
          .texto(`CUIT:${empresa.cuit}  Ingresos Brutos:${empresa.ingBruto}\n`)
          .texto(`Inicio de actividades: ${empresa.fechaInicioAct}\n`)
          .texto(`${empresa.condicionIva.nombre}\n`)
          .texto(`A ${cliente.condicionIva.nombre}\n`)
          .texto(`EMICION:${fechaEmision}  Nro. Cbte.:${numeroCbte}\n`)
          .texto(`------------------------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerTamanioFuente(2, 2)
          .establecerEnfatizado(1)
          .texto(`NOTA DE CREDITO B\n`)
          .establecerEnfatizado(0)
          .establecerTamanioFuente(1, 1)
          .texto(`ORIGINAL   Cod.0008\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`------------------------------------------------\n`)
          .texto(`Cliente:   ${cliente.nombre}\n`)
          .texto(`Cuit:      ${cliente.cuit}\n`)
          .texto(`Condicion: ${cliente.razonSocial}\n`)
          .texto(`------------------------------------------------\n`)
          .establecerEnfatizado(1)
          .textoConAcentos(`Descripción                              IMPORTE\n`)
          .establecerEnfatizado(0)
          .texto(`Cantidad/Precio unitario\n`)
          .texto(`------------------------------------------------\n`);
for (let i = 0; i < listProduct.length; i++) {
  conector.establecerEnfatizado(1)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`${listProduct[i].nombre}\n`)
          .establecerEnfatizado(0);
  infoCantUni = `Uni: ${listProduct[i].cantUnidades} /  $ ${listProduct[i].precioUnitario}`;
  precioTotal = `${(listProduct[i].cantUnidades*listProduct[i].precioUnitario).toFixed(2)}`;
  espacios = 48 - (precioTotal.length + infoCantUni.length)
  espacioss = ""
  for(let h =0; h<espacios; h++){
    espacioss += " "
  }
  lineaProd = infoCantUni+espacioss+precioTotal
  conector.texto(`${lineaProd}\n`)
          .texto(`------------------------------------------------\n`)
}
  conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .establecerEnfatizado(1)
          .texto(`TOTAL:                            $ ${totalVenta}\n`)
          .establecerEnfatizado(0)
          .texto(`------------------------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .establecerEnfatizado(1)
          .texto(`Iva 27%:                          $ ${totalIva27}\n`)
          .texto(`Iva 21%:                          $ ${(Number(totalVenta) - (Number(totalVenta)/1.21)).toFixed(2)} \n`)
          .texto(`Iva 10.5%:                        $ ${totalIva10}\n`)
          .establecerEnfatizado(0)
          .texto(`------------------------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .imagenDesdeUrl("https://i.ibb.co/HPKqQVv/qeafip.png")
          .texto(`${barCode}\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`C.A.E: ${cae}\n`)
          .texto(`Vencimiento: ${fechaVto}\n`)
          .texto(`------------------------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .texto(`Gracias por su Compra!\n`)
          .texto(`Visite nuestra página WEB!\n`)
          .texto(`www.prysoft.com.ar\n`)
          .cortar()
          .feed(4)
        .imprimirEn(nombreImpresora);
}

function notaCreditoB58(listProduct,nameEmpresa,totalVenta,barCode,cae,cliente,empresa
                      ,fechaEmision,numeroCbte,fechaVto,
                      totalIva21,totalIva10,totalIva27,nombreImpresora){

  switch (nameEmpresa) {
    case "servipack":
      logo = "https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png";
      imagen = true;
    break;

    default:
      imagen = false;
    break;
  }

  const conector = new ConectorPlugin()

  if(imagen){
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenDesdeUrl(logo)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  }

  conector.texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerEnfatizado(1)
          .establecerTamanioFuente(1, 1)
          .texto(`${empresa.razonSocial}\n`)
          .establecerEnfatizado(0)
          .texto(`CUIT:${empresa.cuit}\n`)
          .texto(`Ingresos Brutos:${empresa.ingBruto}\n`)
          .texto(`Inicio de actividades:\n`)
          .texto(`${empresa.fechaInicioAct}\n`)
          .texto(`${empresa.condicionIva.nombre}\n`)
          .texto(`A ${cliente.condicionIva.nombre}\n`)
          .texto(`EMICION:${fechaEmision}\n`)
          .texto(`Nro. Cbte.:${numeroCbte}\n`)
          .texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerTamanioFuente(2, 2)
          .establecerEnfatizado(1)
          .texto(`NOTA DE CREDITO B\n`)
          .establecerEnfatizado(0)
          .establecerTamanioFuente(1, 1)
          .texto(`ORIGINAL   Cod.0008\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`--------------------------------\n`)
          .texto(`Cliente:   ${cliente.nombre}\n`)
          .texto(`Cuit:      ${cliente.cuit}\n`)
          .texto(`Condicion: ${cliente.razonSocial}\n`)
          .texto(`--------------------------------\n`)
          .establecerEnfatizado(1)
          .texto(`Descripcion              IMPORTE\n`)
          .establecerEnfatizado(0)
          .texto(`Cantidad/Precio unitario\n`)
          .texto(`--------------------------------\n`);
  for (let i = 0; i < listProduct.length; i++) {
    conector.establecerEnfatizado(1)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`${listProduct[i].nombre}\n`)
            .establecerEnfatizado(0);
    infoCantUni = `Uni: ${listProduct[i].cantUnidades} /  $ ${listProduct[i].precioUnitario}`;
    precioTotal = `${(listProduct[i].cantUnidades*listProduct[i].precioUnitario).toFixed(2)}`;
    espacios = 32 - (precioTotal.length + infoCantUni.length)
    espacioss = ""
    for(let h =0; h<espacios; h++){
     espacioss += " "
    }
    lineaProd = infoCantUni+espacioss+precioTotal
    conector.texto(`${lineaProd}\n`)
            .texto(`--------------------------------\n`)
  }
  conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  .establecerEnfatizado(1)
  .texto(`TOTAL:            $ ${totalVenta}\n`)
  .establecerEnfatizado(0)
  .texto(`--------------------------------\n`)
  .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  .establecerEnfatizado(1)
  .texto(`Iva 27%:          $ ${totalIva27}\n`)
  .texto(`Iva 21%:          $ ${(Number(totalVenta) - (Number(totalVenta)/1.21)).toFixed(2)} \n`)
  .texto(`Iva 10.5%:        $ ${totalIva10}\n`)
  .establecerEnfatizado(0)
  .texto(`--------------------------------\n`)
  .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
  .imagenDesdeUrl("https://i.ibb.co/HPKqQVv/qeafip.png")
  .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  .texto('\n')
  .texto(`C.A.E: ${cae}\n`)
  .texto(`Vencimiento: ${fechaVto}\n`)
  .texto(`--------------------------------\n`)
  .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
  .texto(`Gracias por su Compra!\n`)
  .texto(`Visite nuestra pagina WEB!\n`)
  .texto(`www.prysoft.com.ar\n`)
  .cortar()
  .feed(4)
  .imprimirEn(nombreImpresora);
}

function facturaC(listProduct,nameEmpresa,totalVenta,totalRecargos,
                  totalDescuentos,subTotal,barCode,cae,cliente,empresa,
                  fechaEmision,numeroCbte,fechaVto,nombreImpresora){

    switch (nameEmpresa) {
      case "servipack":
          logo = "https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png";
          imagen = true;
        break;

      default:
        imagen = false;
        break;
    }

  const conector =  new ConectorPlugin()

  if(imagen){
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .imagenDesdeUrl(logo)
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  }

  conector.texto(`------------------------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerEnfatizado(1)
          .establecerTamanioFuente(1, 1)
          .texto(`${empresa.razonSocial}\n`)
          .establecerEnfatizado(0)
          .texto(`CUIT:${empresa.cuit}  Ingresos Brutos:${empresa.ingBruto}\n`)
          .texto(`Inicio de actividades: ${empresa.fechaInicioAct}\n`)
          .texto(`${empresa.condicionIva.nombre}\n`)
          .texto(`A ${cliente.condicionIva.nombre}\n`)
          .texto(`EMICION:${fechaEmision}  Nro. Cbte.:${numeroCbte}\n`)
          .texto(`------------------------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerTamanioFuente(2, 2)
          .establecerEnfatizado(1)
          .texto(`FACTURA C\n`)
          .establecerEnfatizado(0)
          .establecerTamanioFuente(1, 1)
          .texto(`ORIGINAL   Cod.0011\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`------------------------------------------------\n`)
          .texto(`Cliente:   ${cliente.nombre}\n`)
          .texto(`Cuit:      ${cliente.cuit}\n`)
          .texto(`Condicion: ${cliente.razonSocial}\n`)
          .texto(`------------------------------------------------\n`)
          .establecerEnfatizado(1)
          .textoConAcentos(`Descripción                              IMPORTE\n`)
          .establecerEnfatizado(0)
          .texto(`Cantidad/Precio unitario\n`)
          .texto(`------------------------------------------------\n`);
  for (let i = 0; i < listProduct.length; i++) {
  conector.establecerEnfatizado(1)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`${listProduct[i].nombre}\n`)
          .establecerEnfatizado(0);
  infoCantUni = `Uni: ${listProduct[i].cantUnidades} /  $ ${listProduct[i].precioUnitario}`;
  precioTotal = `${(listProduct[i].cantUnidades*listProduct[i].precioUnitario).toFixed(2)}`;
  espacios = 48 - (precioTotal.length + infoCantUni.length)
  espacioss = ""
  for(let h =0; h<espacios; h++){
    espacioss += " "
  }
  lineaProd = infoCantUni+espacioss+precioTotal
  conector.texto(`${lineaProd}\n`)
          .texto(`------------------------------------------------\n`)
}
  conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .establecerEnfatizado(1)
          .texto(`Subtotal:                         $ ${subTotal}\n`)
          .texto(`Descuentos:                       $ ${totalDescuentos} \n`)
          .texto(`Recargos:                         $ ${totalRecargos}\n`)
          .texto(`TOTAL:                            $ ${totalVenta}\n`)
          .establecerEnfatizado(0)
          .texto(`------------------------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .imagenDesdeUrl("https://i.ibb.co/HPKqQVv/qeafip.png")
          .texto(`${barCode}\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`C.A.E: ${cae}\n`)
          .texto(`Vencimiento: ${fechaVto}\n`)
          .texto(`------------------------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .texto(`Gracias por su Compra!\n`)
          .texto(`Visite nuestra página WEB!\n`)
          .texto(`www.prysoft.com.ar\n`)
          .cortar()
          .feed(4)
    .imprimirEn(nombreImpresora);
}

function facturaC58(listProduct,nameEmpresa,totalVenta,totalRecargos,
                  totalDescuentos,subTotal,barCode,cae,cliente,empresa,
                  fechaEmision,numeroCbte,fechaVto,nombreImpresora){

    switch (nameEmpresa) {
      case "servipack":
          logo = "https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png";
          imagen = true;
        break;

      default:
        imagen = false;
        break;
    }

  const conector =  new ConectorPlugin()

  if(imagen){
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .imagenDesdeUrl(logo)
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  }

  conector.texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerEnfatizado(1)
          .establecerTamanioFuente(1, 1)
          .texto(`${empresa.razonSocial}\n`)
          .establecerEnfatizado(0)
          .texto(`CUIT:${empresa.cuit}\n`)
          .texto(`Ingresos Brutos:${empresa.ingBruto}\n`)
          .texto(`Inicio de actividades:\n`)
          .texto(`${empresa.fechaInicioAct}\n`)
          .texto(`${empresa.condicionIva.nombre}\n`)
          .texto(`A ${cliente.condicionIva.nombre}\n`)
          .texto(`EMICION:${fechaEmision}\n`)
          .texto(`Nro. Cbte.:${numeroCbte}\n`)
          .texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerTamanioFuente(2, 2)
          .establecerEnfatizado(1)
          .texto(`FACTURA C\n`)
          .establecerEnfatizado(0)
          .establecerTamanioFuente(1, 1)
          .texto(`ORIGINAL   Cod.0011\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`--------------------------------\n`)
          .texto(`Cliente:   ${cliente.nombre}\n`)
          .texto(`Cuit:      ${cliente.cuit}\n`)
          .texto(`Condicion: ${cliente.razonSocial}\n`)
          .texto(`--------------------------------\n`)
          .establecerEnfatizado(1)
          .texto(`Descripcion              IMPORTE\n`)
          .establecerEnfatizado(0)
          .texto(`Cantidad/Precio unitario\n`)
          .texto(`--------------------------------\n`);
  for (let i = 0; i < listProduct.length; i++) {
  conector.establecerEnfatizado(1)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`${listProduct[i].nombre}\n`)
          .establecerEnfatizado(0);
  infoCantUni = `Uni: ${listProduct[i].cantUnidades} /  $ ${listProduct[i].precioUnitario}`;
  precioTotal = `${(listProduct[i].cantUnidades*listProduct[i].precioUnitario).toFixed(2)}`;
  espacios = 32 - (precioTotal.length + infoCantUni.length)
  espacioss = ""
  for(let h =0; h<espacios; h++){
    espacioss += " "
  }
  lineaProd = infoCantUni+espacioss+precioTotal
  conector.texto(`${lineaProd}\n`)
          .texto(`--------------------------------\n`)
}
  conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .establecerEnfatizado(1)
          .texto(`Subtotal:         $ ${subTotal}\n`)
          .texto(`Descuentos:       $ ${totalDescuentos} \n`)
          .texto(`Recargos:         $ ${totalRecargos}\n`)
          .texto(`TOTAL:            $ ${totalVenta}\n`)
          .establecerEnfatizado(0)
          .texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .imagenDesdeUrl("https://i.ibb.co/HPKqQVv/qeafip.png")
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto('\n')
          .texto(`C.A.E: ${cae}\n`)
          .texto(`Vencimiento: ${fechaVto}\n`)
          .texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .texto(`Gracias por su Compra!\n`)
          .texto(`Visite nuestra pagina WEB!\n`)
          .texto(`www.prysoft.com.ar\n`)
          .cortar()
          .feed(4)
    .imprimirEn(nombreImpresora);
}

function notaDebitoC(listProduct,nameEmpresa,totalVenta,barCode,cae,cliente,empresa
  ,fechaEmision,numeroCbte,fechaVto,nombreImpresora){

  switch (nameEmpresa) {
    case "servipack":
        logo = "https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png";
        imagen = true;
      break;

    default:
      imagen = false;
      break;
  }

  const conector = new ConectorPlugin()

  if(imagen){
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenDesdeUrl(logo)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  }

conector.texto(`------------------------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerEnfatizado(1)
          .establecerTamanioFuente(1, 1)
          .texto(`${empresa.razonSocial}\n`)
          .establecerEnfatizado(0)
          .texto(`CUIT:${empresa.cuit}  Ingresos Brutos:${empresa.ingBruto}\n`)
          .texto(`Inicio de actividades: ${empresa.fechaInicioAct}\n`)
          .texto(`${empresa.condicionIva.nombre}\n`)
          .texto(`A ${cliente.condicionIva.nombre}\n`)
          .texto(`EMICION:${fechaEmision}  Nro. Cbte.:${numeroCbte}\n`)
          .texto(`------------------------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerTamanioFuente(2, 2)
          .establecerEnfatizado(1)
          .texto(`NOTA DE DEBITO C\n`)
          .establecerEnfatizado(0)
          .establecerTamanioFuente(1, 1)
          .texto(`ORIGINAL   Cod.0012\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`------------------------------------------------\n`)
          .texto(`Cliente:   ${cliente.nombre}\n`)
          .texto(`Cuit:      ${cliente.cuit}\n`)
          .texto(`Condicion: ${cliente.razonSocial}\n`)
          .texto(`------------------------------------------------\n`)
          .establecerEnfatizado(1)
          .textoConAcentos(`Descripción                              IMPORTE\n`)
          .establecerEnfatizado(0)
          .texto(`Cantidad/Precio unitario\n`)
          .texto(`------------------------------------------------\n`);
for (let i = 0; i < listProduct.length; i++) {
  conector.establecerEnfatizado(1)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`${listProduct[i].nombre}\n`)
          .establecerEnfatizado(0);
  infoCantUni = `Uni: ${listProduct[i].cantUnidades} /  $ ${listProduct[i].precioUnitario}`;
  precioTotal = `${(listProduct[i].cantUnidades*listProduct[i].precioUnitario).toFixed(2)}`;
  espacios = 48 - (precioTotal.length + infoCantUni.length)
  espacioss = ""
  for(let h =0; h<espacios; h++){
    espacioss += " "
  }
  lineaProd = infoCantUni+espacioss+precioTotal
  conector.texto(`${lineaProd}\n`)
          .texto(`------------------------------------------------\n`)
}
  conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .establecerEnfatizado(1)
          .texto(`TOTAL:                            $ ${totalVenta}\n`)
          .establecerEnfatizado(0)
          .texto(`------------------------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .imagenDesdeUrl("https://i.ibb.co/HPKqQVv/qeafip.png")
          .texto(`${barCode}\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`C.A.E: ${cae}\n`)
          .texto(`Vencimiento: ${fechaVto}\n`)
          .texto(`------------------------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .texto(`Gracias por su Compra!\n`)
          .texto(`Visite nuestra página WEB!\n`)
          .texto(`www.prysoft.com.ar\n`)
          .cortar()
          .feed(4)
        .imprimirEn(nombreImpresora);
}

function notaDebitoC58(listProduct,nameEmpresa,totalVenta,barCode,cae,cliente,empresa
  ,fechaEmision,numeroCbte,fechaVto,nombreImpresora){

  switch (nameEmpresa) {
    case "servipack":
        logo = "https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png";
        imagen = true;
      break;

    default:
      imagen = false;
      break;
  }

  const conector = new ConectorPlugin()

  if(imagen){
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenDesdeUrl(logo)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  }

conector.texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerEnfatizado(1)
          .establecerTamanioFuente(1, 1)
          .texto(`${empresa.razonSocial}\n`)
          .establecerEnfatizado(0)
          .texto(`CUIT:${empresa.cuit}\n`)
          .texto(`Ingresos Brutos:${empresa.ingBruto}\n`)
          .texto(`Inicio de actividades:\n`)
          .texto(`${empresa.fechaInicioAct}\n`)
          .texto(`${empresa.condicionIva.nombre}\n`)
          .texto(`A ${cliente.condicionIva.nombre}\n`)
          .texto(`EMICION:${fechaEmision}\n`)
          .texto(`Nro. Cbte.:${numeroCbte}\n`)
          .texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .establecerTamanioFuente(2, 2)
          .establecerEnfatizado(1)
          .texto(`NOTA DE DEBITO C\n`)
          .establecerEnfatizado(0)
          .establecerTamanioFuente(1, 1)
          .texto(`ORIGINAL   Cod.0012\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`--------------------------------\n`)
          .texto(`Cliente:   ${cliente.nombre}\n`)
          .texto(`Cuit:      ${cliente.cuit}\n`)
          .texto(`Condicion: ${cliente.razonSocial}\n`)
          .texto(`--------------------------------\n`)
          .establecerEnfatizado(1)
          .textoConAcentos(`Descripción              IMPORTE\n`)
          .establecerEnfatizado(0)
          .texto(`Cantidad/Precio unitario\n`)
          .texto(`--------------------------------\n`);
for (let i = 0; i < listProduct.length; i++) {
  conector.establecerEnfatizado(1)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto(`${listProduct[i].nombre}\n`)
          .establecerEnfatizado(0);
  infoCantUni = `Uni: ${listProduct[i].cantUnidades} /  $ ${listProduct[i].precioUnitario}`;
  precioTotal = `${(listProduct[i].cantUnidades*listProduct[i].precioUnitario).toFixed(2)}`;
  espacios = 32 - (precioTotal.length + infoCantUni.length)
  espacioss = ""
  for(let h =0; h<espacios; h++){
    espacioss += " "
  }
  lineaProd = infoCantUni+espacioss+precioTotal
  conector.texto(`${lineaProd}\n`)
          .texto(`--------------------------------\n`)
}
  conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .establecerEnfatizado(1)
          .texto(`TOTAL:            $ ${totalVenta}\n`)
          .establecerEnfatizado(0)
          .texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .imagenDesdeUrl("https://i.ibb.co/HPKqQVv/qeafip.png")
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
          .texto('\n')
          .texto(`C.A.E: ${cae}\n`)
          .texto(`Vencimiento: ${fechaVto}\n`)
          .texto(`--------------------------------\n`)
          .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
          .texto(`Gracias por su Compra!\n`)
          .texto(`Visite nuestra pagina WEB!\n`)
          .texto(`www.prysoft.com.ar\n`)
          .cortar()
          .feed(4)
        .imprimirEn(nombreImpresora);
}

function notaCreditoC(listProduct,nameEmpresa,totalVenta,barCode,cae,cliente,empresa
                      ,fechaEmision,numeroCbte,fechaVto,nombreImpresora){

  switch (nameEmpresa) {
    case "servipack":
        logo = "https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png";
        imagen = true;
      break;

    default:
      imagen = false;
      break;
  }

  const conector = new ConectorPlugin()

  if(imagen){
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenDesdeUrl(logo)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  }

    conector.texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .establecerEnfatizado(1)
            .establecerTamanioFuente(1, 1)
            .texto(`${empresa.razonSocial}\n`)
            .establecerEnfatizado(0)
            .texto(`CUIT:${empresa.cuit}  Ingresos Brutos:${empresa.ingBruto}\n`)
            .texto(`Inicio de actividades: ${empresa.fechaInicioAct}\n`)
            .texto(`${empresa.condicionIva.nombre}\n`)
            .texto(`A ${cliente.condicionIva.nombre}\n`)
            .texto(`EMICION:${fechaEmision}  Nro. Cbte.:${numeroCbte}\n`)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .establecerTamanioFuente(2, 2)
            .establecerEnfatizado(1)
            .texto(`NOTA DE CREDITO C\n`)
            .establecerEnfatizado(0)
            .establecerTamanioFuente(1, 1)
            .texto(`ORIGINAL   Cod.0013\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`------------------------------------------------\n`)
            .texto(`Cliente:   ${cliente.nombre}\n`)
            .texto(`Cuit:      ${cliente.cuit}\n`)
            .texto(`Condicion: ${cliente.razonSocial}\n`)
            .texto(`------------------------------------------------\n`)
            .establecerEnfatizado(1)
            .textoConAcentos(`Descripción                              IMPORTE\n`)
            .establecerEnfatizado(0)
            .texto(`Cantidad/Precio unitario\n`)
            .texto(`------------------------------------------------\n`);
  for (let i = 0; i < listProduct.length; i++) {
    conector.establecerEnfatizado(1)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`${listProduct[i].nombre}\n`)
            .establecerEnfatizado(0);
    infoCantUni = `Uni: ${listProduct[i].cantUnidades} /  $ ${listProduct[i].precioUnitario}`;
    precioTotal = `${(listProduct[i].cantUnidades*listProduct[i].precioUnitario).toFixed(2)}`;
    espacios = 48 - (precioTotal.length + infoCantUni.length)
    espacioss = ""
    for(let h =0; h<espacios; h++){
      espacioss += " "
    }
    lineaProd = infoCantUni+espacioss+precioTotal
    conector.texto(`${lineaProd}\n`)
            .texto(`------------------------------------------------\n`)
  }
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .establecerEnfatizado(1)
            .texto(`TOTAL:                            $ ${totalVenta}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenDesdeUrl("https://i.ibb.co/HPKqQVv/qeafip.png")
            .texto(`${barCode}\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`C.A.E: ${cae}\n`)
            .texto(`Vencimiento: ${fechaVto}\n`)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .texto(`Gracias por su Compra!\n`)
            .texto(`Visite nuestra página WEB!\n`)
            .texto(`www.prysoft.com.ar\n`)
            .cortar()
            .feed(4)
            .imprimirEn(nombreImpresora);
}

function notaCreditoC58(listProduct,nameEmpresa,totalVenta,barCode,cae,cliente,empresa
                        ,fechaEmision,numeroCbte,fechaVto,nombreImpresora){

  switch (nameEmpresa) {
    case "servipack":
        logo = "https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png";
        imagen = true;
      break;

    default:
      imagen = false;
      break;
  }

  const conector = new ConectorPlugin()

  if(imagen){
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenDesdeUrl(logo)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
  }

    conector.texto(`--------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .establecerEnfatizado(1)
            .establecerTamanioFuente(1, 1)
            .texto(`${empresa.razonSocial}\n`)
            .establecerEnfatizado(0)
            .texto(`CUIT:${empresa.cuit}\n`)
            .texto(`Ingresos Brutos:${empresa.ingBruto}\n`)
            .texto(`Inicio de actividades:\n`)
            .texto(`${empresa.fechaInicioAct}\n`)
            .texto(`${empresa.condicionIva.nombre}\n`)
            .texto(`A ${cliente.condicionIva.nombre}\n`)
            .texto(`EMICION:${fechaEmision}\n`)
            .texto(`Nro. Cbte.:${numeroCbte}\n`)
            .texto(`--------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .establecerTamanioFuente(2, 2)
            .establecerEnfatizado(1)
            .texto(`NOTA DE CREDITO C\n`)
            .establecerEnfatizado(0)
            .establecerTamanioFuente(1, 1)
            .texto(`ORIGINAL   Cod.0013\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`--------------------------------\n`)
            .texto(`Cliente:   ${cliente.nombre}\n`)
            .texto(`Cuit:      ${cliente.cuit}\n`)
            .texto(`Condicion: ${cliente.razonSocial}\n`)
            .texto(`--------------------------------\n`)
            .establecerEnfatizado(1)
            .texto(`Descripcion              IMPORTE\n`)
            .establecerEnfatizado(0)
            .texto(`Cantidad/Precio unitario\n`)
            .texto(`--------------------------------\n`);
  for (let i = 0; i < listProduct.length; i++) {
    conector.establecerEnfatizado(1)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`${listProduct[i].nombre}\n`)
            .establecerEnfatizado(0);
    infoCantUni = `Uni: ${listProduct[i].cantUnidades} /  $ ${listProduct[i].precioUnitario}`;
    precioTotal = `${(listProduct[i].cantUnidades*listProduct[i].precioUnitario).toFixed(2)}`;
    espacios = 32 - (precioTotal.length + infoCantUni.length)
    espacioss = ""
    for(let h =0; h<espacios; h++){
      espacioss += " "
    }
    lineaProd = infoCantUni+espacioss+precioTotal
    conector.texto(`${lineaProd}\n`)
            .texto(`--------------------------------\n`)
  }
    conector.establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .establecerEnfatizado(1)
            .texto(`TOTAL:            $ ${totalVenta}\n`)
            .establecerEnfatizado(0)
            .texto(`--------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenDesdeUrl("https://i.ibb.co/HPKqQVv/qeafip.png")
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto('\n')
            .texto(`C.A.E: ${cae}\n`)
            .texto(`Vencimiento: ${fechaVto}\n`)
            .texto(`--------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .texto(`Gracias por su Compra!\n`)
            .texto(`Visite nuestra pagina WEB!\n`)
            .texto(`www.prysoft.com.ar\n`)
            .cortar()
            .feed(4)
            .imprimirEn(nombreImpresora);
}

