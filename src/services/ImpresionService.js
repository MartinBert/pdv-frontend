import { ConectorPlugin } from "../helpers/conectorPlugin";
let logo = "";
let infoCantUni="";
let precioTotal = ``;
let espacios = 0;
let espacioss = "";
let lineaProd=``;
let imagen = false;

export default function printReceipt(comprobante){

      switch (comprobante.nombreDocumento) {
        case "Ticket X":
          ticketX(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.totalRecargos,
                  comprobante.totalDescuentos,comprobante.subTotal,comprobante.nombreDocumento)
          break;

        case "Nota de débito X":
          notaDebitoX(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta)
          break;

        case "Nota de crédito X":
          notaCreditoX(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta)
          break;

        case "FACTURAS C":
          facturaC(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.totalRecargos,
                  comprobante.totalDescuentos,comprobante.subTotal,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
                  ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto)
          break;

        case "NOTAS DE DEBITO C":
          notaDebitoC(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
            ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto,)
          break;

        case "NOTAS DE CREDITO C":
          notaCreditoC(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
            ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto,)
          break;

        case "FACTURAS B":
          facturaB(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.totalRecargos,
            comprobante.totalDescuentos,comprobante.subTotal,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
            ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto)
          break;

        case "NOTAS DE DEBITO B":
          notaDebitoB(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
            ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto)
          break;

        case "NOTAS DE CREDITO B":
          notaCreditoB(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
            ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto)
          break;

        case "FACTURAS A":
          facturaA(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.totalRecargos,
            comprobante.totalDescuentos,comprobante.subTotal,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
            ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto,
            comprobante.totalIva21,comprobante.totalIva10,comprobante.totalIva27)
          break;

        case "NOTAS DE DEBITO A":
          notaDebitoA(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
            ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto,
            comprobante.totalIva21,comprobante.totalIva10,comprobante.totalIva27)
          break;

        case "NOTAS DE CREDITO A":
          notaCreditoA(comprobante.productos,comprobante.empresa.razonSocial,comprobante.totalVenta,comprobante.barCode,comprobante.cae,comprobante.cliente,comprobante.empresa
            ,comprobante.fechaEmision,comprobante.numeroCbte,comprobante.fechaVto,
            comprobante.totalIva21,comprobante.totalIva10,comprobante.totalIva27)
          break;

        default:
          break;
      }
}


function ticketX(listProduct,nameEmpresa,totalVenta,totalRecargos,
                 totalDescuentos,subTotal,nombreDocumento){
  switch (nameEmpresa) {
    case "servipack":
        logo = "https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png";
        imagen = true;
      break;

    default:
      imagen = false;
      break;
  }
console.log("entre");
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
            .imprimirEn("80mm Series Printer")
}

function notaDebitoX(listProduct,nameEmpresa,totalVenta){

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
            .texto(`TOTAL:                            $ ${totalVenta.toFixed(2)}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .texto(`Gracias por su Compra!\n`)
            .texto(`Visite nuestra página WEB!\n`)
            .texto(`www.prysoft.com.ar\n`)
            .cortar()
            .feed(4)
            .imprimirEn("80mm Series Printer");
}

function notaCreditoX(listProduct,nameEmpresa,totalVenta){

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
            .texto(`TOTAL:                            $ ${totalVenta.toFixed(2)}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .texto(`Gracias por su Compra!\n`)
            .texto(`Visite nuestra página WEB!\n`)
            .texto(`www.prysoft.com.ar\n`)
            .cortar()
            .feed(4)
            .imprimirEn("80mm Series Printer");
}

function facturaA(listProduct,nameEmpresa,totalVenta,totalRecargos,
                totalDescuentos,subTotal,barCode,cae,cliente,empresa
                ,fechaEmision,numeroCbte,fechaVto,
                totalIva21,totalIva10,totalIva27){

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
          .texto(`Cliente:    ${cliente.nombre}\n`)
          .texto(`Cuit:       ${cliente.cuit}\n`)
          .texto(`Conidicion: ${cliente.razonSocial}\n`)
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
    .imprimirEn("80mm Series Printer");
}

function notaDebitoA(listProduct,nameEmpresa,totalVenta,barCode,cae,cliente,empresa
                      ,fechaEmision,numeroCbte,fechaVto,
                      totalIva21,totalIva10,totalIva27){

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
            .texto(`Cliente:    ${cliente.nombre}\n`)
            .texto(`Cuit:       ${cliente.cuit}\n`)
            .texto(`Conidicion: ${cliente.razonSocial}\n`)
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
      .imprimirEn("80mm Series Printer");
}

function notaCreditoA(listProduct,nameEmpresa,totalVenta,barCode,cae,cliente,empresa
              ,fechaEmision,numeroCbte,fechaVto,
              totalIva21,totalIva10,totalIva27){

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
            .texto(`ORIGINAL   Cod.0002\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`------------------------------------------------\n`)
            .texto(`Cliente:    ${cliente.nombre}\n`)
            .texto(`Cuit:       ${cliente.cuit}\n`)
            .texto(`Conidicion: ${cliente.razonSocial}\n`)
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
          .imprimirEn("80mm Series Printer");
}

function facturaB(listProduct,nameEmpresa,totalVenta,totalRecargos,
  totalDescuentos,subTotal,barCode,cae,cliente,empresa,
  fechaEmision,numeroCbte,fechaVto){

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
          .texto(`Cliente:    ${cliente.nombre}\n`)
          .texto(`Cuit:       ${cliente.cuit}\n`)
          .texto(`Conidicion: ${cliente.razonSocial}\n`)
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
    .imprimirEn("80mm Series Printer");
}

function notaDebitoB(listProduct,nameEmpresa,totalVenta,barCode,cae,cliente,empresa
                    ,fechaEmision,numeroCbte,fechaVto){

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
            .texto(`Cliente:    ${cliente.nombre}\n`)
            .texto(`Cuit:       ${cliente.cuit}\n`)
            .texto(`Conidicion: ${cliente.razonSocial}\n`)
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
          .imprimirEn("80mm Series Printer");
  }

function notaCreditoB(listProduct,nameEmpresa,totalVenta,barCode,cae,cliente,empresa
  ,fechaEmision,numeroCbte,fechaVto){

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
          .texto(`Cliente:    ${cliente.nombre}\n`)
          .texto(`Cuit:       ${cliente.cuit}\n`)
          .texto(`Conidicion: ${cliente.razonSocial}\n`)
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
        .imprimirEn("80mm Series Printer");
}

function facturaC(listProduct,nameEmpresa,totalVenta,totalRecargos,
  totalDescuentos,subTotal,barCode,cae,cliente,empresa,
  fechaEmision,numeroCbte,fechaVto){

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
          .texto(`Cliente:    ${cliente.nombre}\n`)
          .texto(`Cuit:       ${cliente.cuit}\n`)
          .texto(`Conidicion: ${cliente.razonSocial}\n`)
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
    .imprimirEn("80mm Series Printer");
}

function notaDebitoC(listProduct,nameEmpresa,totalVenta,barCode,cae,cliente,empresa
  ,fechaEmision,numeroCbte,fechaVto){

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
          .texto(`Cliente:    ${cliente.nombre}\n`)
          .texto(`Cuit:       ${cliente.cuit}\n`)
          .texto(`Conidicion: ${cliente.razonSocial}\n`)
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
        .imprimirEn("80mm Series Printer");
}

function notaCreditoC(listProduct,nameEmpresa,totalVenta,barCode,cae,cliente,empresa
  ,fechaEmision,numeroCbte,fechaVto){

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
            .texto(`Cliente:    ${cliente.nombre}\n`)
            .texto(`Cuit:       ${cliente.cuit}\n`)
            .texto(`Conidicion: ${cliente.razonSocial}\n`)
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
            .imprimirEn("80mm Series Printer");
}