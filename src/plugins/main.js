
/*lista de productos cuando se cargan de dos arrays */
const listaProd = [{
  name:"Producto 1",
  precio:5
},{
  name:"Producto 2",
  precio:6
},{
  name:"Producto 3",
  precio:8
}]

const listaProd2 = [{
  name:"Producto 1",
  precio:5
},{
  name:"Producto 2",
  precio:6
},{
  name:"Producto 3",
  precio:8
},{
  name:"Producto 4",
  precio:8
}]

const listaProd3=[];

console.log(listaProd2);
const dato = listaProd.reduce((acc, item)=>{
  return acc = acc + item.precio
}, 0)

console.log(dato);

let existe;

listaProd.forEach((producto,indice )=>{
  existe = false;
  listaProd2.forEach((producto2, indice2) =>{
    console.log(indice,indice2,producto.name,producto2.name)
      if((producto.name === producto2.name)){
        existe = true;
      }else{
      }
  })
  console.log(existe);
  if(!existe){
    listaProd2.push(producto);
  }
  
})
console.log(listaProd2);

/* calculo de ventas */
const listProduct =[
  {
    name:"Leche descremada 'La Serenisimia'",
    precio: 1500,
    cantidad:2,
    descuentoLinea: 0,
    iva: 27
  },{
    name:"Atún 180grs 'MAROLIO'",
    precio: 1000000,
    cantidad:1,
    descuentoLinea:0,
    iva: 21
  },{
    name:"Puré de tomate 150grs 'MAROLIO'",
    precio: 500,
    cantidad:3,
    descuentoLinea: 0,
    iva: 21
  },{
    name:"Aceite Vicentin 500cc",
    precio: 900,
    cantidad:51,
    descuentoLinea: 0,
    iva: 21
  },{
    name:"Milanesa x unidad",
    precio: 700,
    cantidad:1,
    descuentoLinea: 0,
    iva: 21
  },{
    name:"DEBITO",
    precio: 1700,
    cantidad:1,
    descuentoLinea: 0,
    iva: 21
  },{
    name:"CREDITO",
    precio: 3700,
    cantidad:1,
    descuentoLinea: 0,
    iva: 21
  }]

  let subTotal=0;
  let descuento =0;
  let total=0;
  let ivaTotal27 =0;
  let ivaTotal21 =0;
  let ivaTotal105 =0;

  function calcularVenta(descPP, descTotal){


    if(descPP ==0){
      descPP = 1
    }else{
      descPP = (100-descPP)/100
    }

    if(descTotal ==0){
      descTotal = 1
    }else{
      descTotal = (100-descTotal)/100
    }

    listProduct.forEach((producto, index)=>{
      let descLinea = producto.descuentoLinea;
      
        if(descLinea ==0){
          descLinea = 1
        }else{
          descLinea = (100-descLinea)/100
        }

        subTotal+=(producto.precio*producto.cantidad)
        total+= (producto.precio*producto.cantidad) * descLinea * descPP * descTotal


        //los descuentos se suman, no se multiplican entre si
      switch (producto.iva) {
        case 21:
          ivaTotal21+= (producto.precio *producto.cantidad)*descLinea * descPP * descTotal - ((producto.precio*producto.cantidad)*descLinea * descPP * descTotal)/1.21
          console.log(`${producto.name} con cantidad ${producto.cantidad}  tiene iva ${producto.iva}% 
su precio es ${((producto.precio*producto.cantidad)*descLinea * descPP * descTotal)}
su iva es de ${(producto.precio*producto.cantidad)*descLinea * descPP * descTotal - ((producto.precio*producto.cantidad)*descLinea * descPP * descTotal)/1.21}`);
          break;

        case 0:
          ivaTotal21+= (producto.precio)*descLinea * descPP * descTotal - ((producto.precio)*descLinea * descPP * descTotal)/1.21
          console.log(`${producto.name} tiene iva ${producto.iva}% pero se considera iva 21%
su precio es ${((producto.precio)*descLinea * descPP * descTotal)}
su iva es de ${(producto.precio)*descLinea * descPP * descTotal - ((producto.precio)*descLinea * descPP * descTotal)/1.21}`);
          break;

        case 27:
          ivaTotal27+= (producto.precio)*descLinea * descPP * descTotal - ((producto.precio)*descLinea * descPP * descTotal)/1.27
          console.log(`${producto.name} tiene iva ${producto.iva}% 
su precio es ${((producto.precio)*descLinea * descPP * descTotal)}
su iva es de ${(producto.precio)*descLinea * descPP * descTotal - ((producto.precio)*descLinea * descPP * descTotal)/1.27}`);
          break;

        case 105:
          ivaTotal105+=(producto.precio)*descLinea * descPP * descTotal - ((producto.precio)*descLinea * descPP * descTotal)/1.105
          console.log(`${producto.name} tiene iva ${producto.iva}% 
su precio es ${((producto.precio)*descLinea * descPP * descTotal)}
su iva es de ${(producto.precio)*descLinea * descPP * descTotal - ((producto.precio)*descLinea * descPP * descTotal)/1.105}`);
          break;

        default:
          break;
      }


    })

    descuento = subTotal - total
    console.log(`Subtotal: ${ subTotal.toFixed(2)}`);
    console.log(`Descuento: ${descuento.toFixed(2)}`);
    console.log(`Total: ${total.toFixed(2)}`)
    console.log(`Iva 27%: ${ivaTotal27.toFixed(2)}`);
    console.log(`Iva 21%: ${ivaTotal21.toFixed(2)}`)
    console.log(`Iva 10.5%: ${ivaTotal105.toFixed(2)}`)
  }
  calcularVenta(0, 0)

/***  mapas
var mymap = L.map('mapid').setView([51.505, -0.09], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
}).addTo(mymap);

mapas *****/



let btn_imprimir = document.getElementById('btn_imprimir');
let btn_imprimir_NDX = document.getElementById('btn_imprimir_NDX');
let btn_imprimir_NCX = document.getElementById('btn_imprimir_NCX');
let btn_imprimir_FB = document.getElementById('btn_imprimir_FB');
let btn_imprimir_FC = document.getElementById('btn_imprimir_FC');
let btn_imprimir_FA = document.getElementById('btn_imprimir_FA');
let btn_imprimir_NDA = document.getElementById('btn_imprimir_NDA');
let btn_imprimir_NCA = document.getElementById('btn_imprimir_NCA');
let btn_imprimir_NDB = document.getElementById('btn_imprimir_NDB');
let btn_imprimir_NCB = document.getElementById('btn_imprimir_NCB');
let btn_imprimir_NDC = document.getElementById('btn_imprimir_NDC');
let btn_imprimir_NCC = document.getElementById('btn_imprimir_NCC');


const razonSocialVendedor = "NICOLAS MORZAN SRL";
const cuitVendedor = "20-37209371-5";
const ingBrutosVendedor = "915-235111-5";
const inicioAct = "17/03/1993";
const fechaEmicion = "20/09/2021";
const NroCompr = "0002-0000001";

const razonnSocialClienteb = "Consumidor Final"
const cuitClienteb = "12345678910"
const condicionClienteb = "Consumidor Final"

let infoCantUni = `Uni: ${listProduct[4].cantidad} // $ ${listProduct[4].precio}`;
let precioTotal = `${(listProduct[4].cantidad*listProduct[4].precio).toFixed(2)}`;
let espacios = 48 - (precioTotal.length + infoCantUni.length)
let espacioss = ""
for(let h =0; h<espacios; h++){
  espacioss += " "
}
let lineaProd = infoCantUni+espacioss+precioTotal
//ticket X
btn_imprimir.addEventListener('click',()=>{

  const conector = new ConectorPlugin()
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .imagenDesdeUrl("https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png")
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
    .texto(`------------------------------------------------\n`)
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .establecerTamanioFuente(2, 2)
    .establecerEnfatizado(1)
    .texto(`TIKET X\n`)
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
              .texto(`${listProduct[i].name}\n`)
              .establecerEnfatizado(0);
      infoCantUni = `Uni: ${listProduct[i].cantidad} // $ ${listProduct[i].precio}`;
      precioTotal = `${(listProduct[i].cantidad*listProduct[i].precio).toFixed(2)}`;
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
            .texto(`Descuentos:                       $ ${descuento.toFixed(2)} \n`)
            .texto(`Recargos:                         $ ${0}\n`)
            .texto(`TOTAL:                            $ ${total.toFixed(2)}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .texto(`Gracias por su Compra!\n`)
            .texto(`Visite nuestra página WEB!\n`)
            .texto(`www.prysoft.com.ar\n`)
            .cortar() 
            .feed(4)
      .imprimirEn("80mm Series Printer");
})

//NOTA DE DEBITO X
btn_imprimir_NDX.addEventListener('click',()=>{

  const conector = new ConectorPlugin()
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .imagenDesdeUrl("https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png")
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
    .texto(`------------------------------------------------\n`)
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
    for (let i = 0; i < 1; i++) {
      conector.establecerEnfatizado(1)
              .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
              .texto(`${listProduct[5].name}\n`)
              .establecerEnfatizado(0);
    infoCantUni = `Uni: ${listProduct[5].cantidad} // $ ${listProduct[5].precio}`;
    precioTotal = `${(listProduct[5].cantidad*listProduct[5].precio).toFixed(2)}`;
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
            .texto(`TOTAL:                            $ ${(listProduct[5].cantidad*listProduct[5].precio).toFixed(2)}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .texto(`Gracias por su Compra!\n`)
            .texto(`Visite nuestra página WEB!\n`)
            .texto(`www.prysoft.com.ar\n`)
            .cortar() 
            .feed(4)
      .imprimirEn("80mm Series Printer");
})

//NOTA DE CREDITO X
btn_imprimir_NCX.addEventListener('click',()=>{

  const conector = new ConectorPlugin()
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .imagenDesdeUrl("https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png")
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
    .texto(`------------------------------------------------\n`)
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
    for (let i = 0; i < 1; i++) {
      conector.establecerEnfatizado(1)
              .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
              .texto(`${listProduct[6].name}\n`)
              .establecerEnfatizado(0);
      infoCantUni = `Uni: ${listProduct[6].cantidad} // $ ${listProduct[6].precio}`;
      precioTotal = `${(listProduct[6].cantidad*listProduct[6].precio).toFixed(2)}`;
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
            .texto(`TOTAL:                            $ ${(listProduct[6].cantidad*listProduct[6].precio).toFixed(2)}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .texto(`Gracias por su Compra!\n`)
            .texto(`Visite nuestra página WEB!\n`)
            .texto(`www.prysoft.com.ar\n`)
            .cortar() 
            .feed(4)
      .imprimirEn("80mm Series Printer");
})

  //FACTURA A
btn_imprimir_FA.addEventListener('click',()=>{

  const conector = new ConectorPlugin()
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .imagenDesdeUrl("https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png")
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
    .texto(`------------------------------------------------\n`)
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .establecerEnfatizado(1)
    .establecerTamanioFuente(1, 1)
    .texto(`${razonSocialVendedor}\n`)
    .establecerEnfatizado(0)
    .texto(`CUIT:${cuitVendedor}  Ingresos Brutos:${ingBrutosVendedor}\n`)
    .texto(`Inicio de actividades: ${inicioAct}\n`)
    .texto(`IVA RESPONSABLE INSCRIPTO\n`)
    .texto(`A IVA RESPONSABLE INSCRIPTO\n`)
    .texto(`EMICION:${fechaEmicion}  Nro. Cbte.:${NroCompr}\n`)
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
    .texto(`Cliente:    PRYSOFT SRL\n`)
    .texto(`Cuit:       30716456354\n`)
    .texto(`Conidicion: Responsable Inscripto\n`)
    .texto(`------------------------------------------------\n`)
    .establecerEnfatizado(1)
    .textoConAcentos(`Descripción                              IMPORTE\n`)
    .establecerEnfatizado(0)
    .texto(`Cantidad/Precio unitario\n`)
    .texto(`------------------------------------------------\n`);
    for (let i = 0; i < listProduct.length; i++) {
      conector.establecerEnfatizado(1)
              .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
              .texto(`${listProduct[i].name}\n`)
              .establecerEnfatizado(0);
      infoCantUni = `Uni: ${listProduct[i].cantidad} // $ ${listProduct[i].precio}`;
      precioTotal = `${(listProduct[i].cantidad*listProduct[i].precio).toFixed(2)}`;
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
            .texto(`Descuentos:                       $ ${descuento.toFixed(2)} \n`)
            .texto(`Recargos:                         $ ${0}\n`)
            .texto(`TOTAL:                            $ ${total.toFixed(2)}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .establecerEnfatizado(1)
            .texto(`Iva 27%:                          $ ${ivaTotal27.toFixed(2)}\n`)
            .texto(`Iva 21%:                          $ ${ivaTotal21.toFixed(2)} \n`)
            .texto(`Iva 10.5%:                        $ ${ivaTotal105.toFixed(2)}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenLocal("C:/Users/Martin Bertello/Desktop/PRUEBAS/qeafip.PNG")
            .texto(`00152369558745698520011544635829965447851\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`C.A.E: 15398547862140\n`)
            .texto(`Vencimiento: 25/09/2021\n`)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .texto(`Gracias por su Compra!\n`)
            .texto(`Visite nuestra página WEB!\n`)
            .texto(`www.prysoft.com.ar\n`)
            .cortar() 
            .feed(4)
      .imprimirEn("80mm Series Printer");
})

//NOTA DE DEBITO A
btn_imprimir_NDA.addEventListener('click',()=>{

  const conector = new ConectorPlugin()
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .imagenDesdeUrl("https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png")
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
    .texto(`------------------------------------------------\n`)
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .establecerEnfatizado(1)
    .establecerTamanioFuente(1, 1)
    .texto(`${razonSocialVendedor}\n`)
    .establecerEnfatizado(0)
    .texto(`CUIT:${cuitVendedor}  Ingresos Brutos:${ingBrutosVendedor}\n`)
    .texto(`Inicio de actividades: ${inicioAct}\n`)
    .texto(`IVA RESPONSABLE INSCRIPTO\n`)
    .texto(`A IVA RESPONSABLE INSCRIPTO\n`)
    .texto(`EMICION:${fechaEmicion}  Nro. Cbte.:${NroCompr}\n`)
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
    .texto(`Cliente:    PRYSOFT SRL\n`)
    .texto(`Cuit:       30716456354\n`)
    .texto(`Conidicion: Responsable Inscripto\n`)
    .texto(`------------------------------------------------\n`)
    .establecerEnfatizado(1)
    .textoConAcentos(`Descripción                              IMPORTE\n`)
    .establecerEnfatizado(0)
    .texto(`Cantidad/Precio unitario\n`)
    .texto(`------------------------------------------------\n`);
    for (let i = 0; i < 1; i++) {
      conector.establecerEnfatizado(1)
              .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
              .texto(`${listProduct[5].name}\n`)
              .establecerEnfatizado(0);
      infoCantUni = `Uni: ${listProduct[5].cantidad} // $ ${listProduct[5].precio}`;
      precioTotal = `${(listProduct[5].cantidad*listProduct[5].precio).toFixed(2)}`;
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
            .texto(`TOTAL:                            $ ${(listProduct[5].cantidad*listProduct[5].precio).toFixed(2)}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .establecerEnfatizado(1)
            .texto(`Iva 27%:                          $ ${0.00}\n`)
            .texto(`Iva 21%:                          $ ${(listProduct[5].precio-(listProduct[5].precio/1.21)).toFixed(2)} \n`)
            .texto(`Iva 10.5%:                        $ ${0.00}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenLocal("C:/Users/Martin Bertello/Desktop/PRUEBAS/qeafip.PNG")
            .texto(`00152369558745698520011544635829965447851\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`C.A.E: 15398547862140\n`)
            .texto(`Vencimiento: 25/09/2021\n`)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .texto(`Gracias por su Compra!\n`)
            .texto(`Visite nuestra página WEB!\n`)
            .texto(`www.prysoft.com.ar\n`)
            .cortar() 
            .feed(4)
      .imprimirEn("80mm Series Printer");
})

//NOTA DE CREDITO A
btn_imprimir_NCA.addEventListener('click',()=>{

  const conector = new ConectorPlugin()
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .imagenDesdeUrl("https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png")
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
    .texto(`------------------------------------------------\n`)
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .establecerEnfatizado(1)
    .establecerTamanioFuente(1, 1)
    .texto(`${razonSocialVendedor}\n`)
    .establecerEnfatizado(0)
    .texto(`CUIT:${cuitVendedor}  Ingresos Brutos:${ingBrutosVendedor}\n`)
    .texto(`Inicio de actividades: ${inicioAct}\n`)
    .texto(`IVA RESPONSABLE INSCRIPTO\n`)
    .texto(`A IVA RESPONSABLE INSCRIPTO\n`)
    .texto(`EMICION:${fechaEmicion}  Nro. Cbte.:${NroCompr}\n`)
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
    .texto(`Cliente:    PRYSOFT SRL\n`)
    .texto(`Cuit:       30716456354\n`)
    .texto(`Conidicion: Responsable Inscripto\n`)
    .texto(`------------------------------------------------\n`)
    .establecerEnfatizado(1)
    .textoConAcentos(`Descripción                              IMPORTE\n`)
    .establecerEnfatizado(0)
    .texto(`Cantidad/Precio unitario\n`)
    .texto(`------------------------------------------------\n`);
    for (let i = 0; i < 1; i++) {
      conector.establecerEnfatizado(1)
              .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
              .texto(`${listProduct[6].name}\n`)
              .establecerEnfatizado(0);
      infoCantUni = `Uni: ${listProduct[6].cantidad} // $ ${listProduct[6].precio}`;
      precioTotal = `${(listProduct[6].cantidad*listProduct[6].precio).toFixed(2)}`;
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
            .texto(`TOTAL:                            $ ${(listProduct[6].cantidad*listProduct[6].precio).toFixed(2)}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .establecerEnfatizado(1)
            .texto(`Iva 27%:                          $ ${0.00}\n`)
            .texto(`Iva 21%:                          $ ${(listProduct[6].precio-(listProduct[6].precio/1.21)).toFixed(2)} \n`)
            .texto(`Iva 10.5%:                        $ ${0.00}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenLocal("C:/Users/Martin Bertello/Desktop/PRUEBAS/qeafip.PNG")
            .texto(`00152369558745698520011544635829965447851\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`C.A.E: 15398547862140\n`)
            .texto(`Vencimiento: 25/09/2021\n`)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .texto(`Gracias por su Compra!\n`)
            .texto(`Visite nuestra página WEB!\n`)
            .texto(`www.prysoft.com.ar\n`)
            .cortar() 
//            .feed(4)
      .imprimirEn("80mm Series Printer");
})

//FACTURA B
btn_imprimir_FB.addEventListener('click',()=>{

  const conector = new ConectorPlugin()
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .imagenDesdeUrl("https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png")
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
    .texto(`------------------------------------------------\n`)
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .establecerEnfatizado(1)
    .establecerTamanioFuente(1, 1)
    .texto(`${razonSocialVendedor}\n`)
    .establecerEnfatizado(0)
    .texto(`CUIT:${cuitVendedor}  Ingresos Brutos:${ingBrutosVendedor}\n`)
    .texto(`Inicio de actividades: ${inicioAct}\n`)
    .texto(`IVA RESPONSABLE INSCRIPTO\n`)
    .texto(`A CONSUMIDOR FINAL\n`)
    .texto(`EMICION:${fechaEmicion}  Nro. Cbte.:${NroCompr}\n`)
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
    .texto(`Cliente:    ${razonnSocialClienteb}\n`)
    .texto(`Cuit:       ${cuitClienteb}\n`)
    .texto(`Conidicion: ${condicionClienteb}\n`)
    .texto(`------------------------------------------------\n`)
    .establecerEnfatizado(1)
    .textoConAcentos(`Descripción                              IMPORTE\n`)
    .establecerEnfatizado(0)
    .texto(`Cantidad/Precio unitario\n`)
    .texto(`------------------------------------------------\n`);
    for (let i = 0; i < listProduct.length; i++) {
      conector.establecerEnfatizado(1)
              .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
              .texto(`${listProduct[i].name}\n`)
              .establecerEnfatizado(0);
      infoCantUni = `Uni: ${listProduct[i].cantidad} // $ ${listProduct[i].precio}`;
      precioTotal = `${(listProduct[i].cantidad*listProduct[i].precio).toFixed(2)}`;
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
            .texto(`Descuentos:                       $ ${descuento.toFixed(2)} \n`)
            .texto(`Recargos:                         $ ${0}\n`)
            .texto(`TOTAL:                            $ ${total.toFixed(2)}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenLocal("C:/Users/Martin Bertello/Desktop/PRUEBAS/qeafip.PNG")
            .texto(`00152369558745698520011544635829965447851\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`C.A.E: 15398547862140\n`)
            .texto(`Vencimiento: 25/09/2021\n`)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .texto(`Gracias por su Compra!\n`)
            .texto(`Visite nuestra página WEB!\n`)
            .texto(`www.prysoft.com.ar\n`)
            .cortar() 
            .feed(4)
      .imprimirEn("80mm Series Printer");
})

//NOTA DE DEBITO B
btn_imprimir_NDB.addEventListener('click',()=>{

  const conector = new ConectorPlugin()
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .imagenDesdeUrl("https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png")
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
    .texto(`------------------------------------------------\n`)
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .establecerEnfatizado(1)
    .establecerTamanioFuente(1, 1)
    .texto(`${razonSocialVendedor}\n`)
    .establecerEnfatizado(0)
    .texto(`CUIT:${cuitVendedor}  Ingresos Brutos:${ingBrutosVendedor}\n`)
    .texto(`Inicio de actividades: ${inicioAct}\n`)
    .texto(`IVA RESPONSABLE INSCRIPTO\n`)
    .texto(`A CONSUMIDOR FINAL\n`)
    .texto(`EMICION:${fechaEmicion}  Nro. Cbte.:${NroCompr}\n`)
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
    .texto(`Cliente:    Consumidor Final\n`)
    .texto(`Cuit:       12345678910\n`)
    .texto(`Conidicion: Consumidor Final\n`)
    .texto(`------------------------------------------------\n`)
    .establecerEnfatizado(1)
    .textoConAcentos(`Descripción                              IMPORTE\n`)
    .establecerEnfatizado(0)
    .texto(`Cantidad/Precio unitario\n`)
    .texto(`------------------------------------------------\n`);
    for (let i = 0; i < 1; i++) {
      conector.establecerEnfatizado(1)
              .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
              .texto(`${listProduct[5].name}\n`)
              .establecerEnfatizado(0);
      infoCantUni = `Uni: ${listProduct[5].cantidad} // $ ${listProduct[5].precio}`;
      precioTotal = `${(listProduct[5].cantidad*listProduct[5].precio).toFixed(2)}`;
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
            .texto(`TOTAL:                            $ ${(listProduct[5].cantidad*listProduct[5].precio).toFixed(2)}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenLocal("C:/Users/Martin Bertello/Desktop/PRUEBAS/qeafip.PNG")
            .texto(`00152369558745698520011544635829965447851\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`C.A.E: 15398547862140\n`)
            .texto(`Vencimiento: 25/09/2021\n`)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .texto(`Gracias por su Compra!\n`)
            .texto(`Visite nuestra página WEB!\n`)
            .texto(`www.prysoft.com.ar\n`)
            .cortar() 
            .feed(4)
      .imprimirEn("80mm Series Printer");
})

//NOTA DE CREDITO B
btn_imprimir_NCB.addEventListener('click',()=>{

  const conector = new ConectorPlugin()
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .imagenDesdeUrl("https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png")
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
    .texto(`------------------------------------------------\n`)
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .establecerEnfatizado(1)
    .establecerTamanioFuente(1, 1)
    .texto(`${razonSocialVendedor}\n`)
    .establecerEnfatizado(0)
    .texto(`CUIT:${cuitVendedor}  Ingresos Brutos:${ingBrutosVendedor}\n`)
    .texto(`Inicio de actividades: ${inicioAct}\n`)
    .texto(`IVA RESPONSABLE INSCRIPTO\n`)
    .texto(`A CONSUMIDOR FINAL\n`)
    .texto(`EMICION:${fechaEmicion}  Nro. Cbte.:${NroCompr}\n`)
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
    .texto(`Cliente:    Consumidor Final\n`)
    .texto(`Cuit:       12345678910\n`)
    .texto(`Conidicion: Consumidor Final\n`)
    .texto(`------------------------------------------------\n`)
    .establecerEnfatizado(1)
    .textoConAcentos(`Descripción                              IMPORTE\n`)
    .establecerEnfatizado(0)
    .texto(`Cantidad/Precio unitario\n`)
    .texto(`------------------------------------------------\n`);
    for (let i = 0; i < 1; i++) {
      conector.establecerEnfatizado(1)
              .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
              .texto(`${listProduct[6].name}\n`)
              .establecerEnfatizado(0);
      infoCantUni = `Uni: ${listProduct[6].cantidad} // $ ${listProduct[6].precio}`;
      precioTotal = `${(listProduct[6].cantidad*listProduct[6].precio).toFixed(2)}`;
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
            .texto(`TOTAL:                            $ ${(listProduct[6].cantidad*listProduct[6].precio).toFixed(2)}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenLocal("C:/Users/Martin Bertello/Desktop/PRUEBAS/qeafip.PNG")
            .texto(`00152369558745698520011544635829965447851\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`C.A.E: 15398547862140\n`)
            .texto(`Vencimiento: 25/09/2021\n`)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .texto(`Gracias por su Compra!\n`)
            .texto(`Visite nuestra página WEB!\n`)
            .texto(`www.prysoft.com.ar\n`)
            .cortar() 
            .feed(4)
      .imprimirEn("80mm Series Printer");
})

//FACTURA C
btn_imprimir_FC.addEventListener('click',()=>{

  const conector = new ConectorPlugin()
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .imagenDesdeUrl("https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png")
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
    .texto(`------------------------------------------------\n`)
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .establecerEnfatizado(1)
    .establecerTamanioFuente(1, 1)
    .texto(`${razonSocialVendedor}\n`)
    .establecerEnfatizado(0)
    .texto(`CUIT:${cuitVendedor}  Ingresos Brutos:${ingBrutosVendedor}\n`)
    .texto(`Inicio de actividades: ${inicioAct}\n`)
    .texto(`MONOTRIBUTISTA\n`)
    .texto(`A CONSUMIDOR FINAL\n`)
    .texto(`EMICION:${fechaEmicion}  Nro. Cbte.:${NroCompr}\n`)
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
    .texto(`Cliente:    ${razonnSocialClienteb}\n`)
    .texto(`Cuit:       ${cuitClienteb}\n`)
    .texto(`Conidicion: ${condicionClienteb}\n`)
    .texto(`------------------------------------------------\n`)
    .establecerEnfatizado(1)
    .textoConAcentos(`Descripción                              IMPORTE\n`)
    .establecerEnfatizado(0)
    .texto(`Cantidad/Precio unitario\n`)
    .texto(`------------------------------------------------\n`);
    for (let i = 0; i < listProduct.length; i++) {
      conector.establecerEnfatizado(1)
              .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
              .texto(`${listProduct[i].name}\n`)
              .establecerEnfatizado(0);
      infoCantUni = `Uni: ${listProduct[i].cantidad} // $ ${listProduct[i].precio}`;
      precioTotal = `${(listProduct[i].cantidad*listProduct[i].precio).toFixed(2)}`;
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
            .texto(`Descuentos:                       $ ${descuento.toFixed(2)} \n`)
            .texto(`Recargos:                         $ ${0}\n`)
            .texto(`TOTAL:                            $ ${total.toFixed(2)}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenLocal("C:/Users/Martin Bertello/Desktop/PRUEBAS/qeafip.PNG")
            .texto(`00152369558745698520011544635829965447851\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`C.A.E: 15398547862140\n`)
            .texto(`Vencimiento: 25/09/2021\n`)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .texto(`Gracias por su Compra!\n`)
            .texto(`Visite nuestra página WEB!\n`)
            .texto(`www.prysoft.com.ar\n`)
            .cortar() 
            .feed(4)
      .imprimirEn("80mm Series Printer");
})
//NOTA DE DEBITO c
btn_imprimir_NDC.addEventListener('click',()=>{

  const conector = new ConectorPlugin()
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .imagenDesdeUrl("https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png")
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
    .texto(`------------------------------------------------\n`)
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .establecerEnfatizado(1)
    .establecerTamanioFuente(1, 1)
    .texto(`${razonSocialVendedor}\n`)
    .establecerEnfatizado(0)
    .texto(`CUIT:${cuitVendedor}  Ingresos Brutos:${ingBrutosVendedor}\n`)
    .texto(`Inicio de actividades: ${inicioAct}\n`)
    .texto(`MONOTRIBUTISTA\n`)
    .texto(`A CONSUMIDOR FINAL\n`)
    .texto(`EMICION:${fechaEmicion}  Nro. Cbte.:${NroCompr}\n`)
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
    .texto(`Cliente:    Consumidor Final\n`)
    .texto(`Cuit:       12345678910\n`)
    .texto(`Conidicion: Consumidor Final\n`)
    .texto(`------------------------------------------------\n`)
    .establecerEnfatizado(1)
    .textoConAcentos(`Descripción                              IMPORTE\n`)
    .establecerEnfatizado(0)
    .texto(`Cantidad/Precio unitario\n`)
    .texto(`------------------------------------------------\n`);
    for (let i = 0; i < 1; i++) {
      conector.establecerEnfatizado(1)
              .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
              .texto(`${listProduct[5].name}\n`)
              .establecerEnfatizado(0);
      infoCantUni = `Uni: ${listProduct[5].cantidad} // $ ${listProduct[5].precio}`;
      precioTotal = `${(listProduct[5].cantidad*listProduct[5].precio).toFixed(2)}`;
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
            .texto(`TOTAL:                            $ ${(listProduct[5].cantidad*listProduct[5].precio).toFixed(2)}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenLocal("C:/Users/Martin Bertello/Desktop/PRUEBAS/qeafip.PNG")
            .texto(`00152369558745698520011544635829965447851\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`C.A.E: 15398547862140\n`)
            .texto(`Vencimiento: 25/09/2021\n`)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .texto(`Gracias por su Compra!\n`)
            .texto(`Visite nuestra página WEB!\n`)
            .texto(`www.prysoft.com.ar\n`)
            .cortar() 
            .feed(4)
      .imprimirEn("80mm Series Printer");
})

//NOTA DE CREDITO C
btn_imprimir_NCC.addEventListener('click',()=>{

  const conector = new ConectorPlugin()
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .imagenDesdeUrl("https://i.ibb.co/GtTYmgg/LOGO-TICKET-SP-2.png")
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
    .texto(`------------------------------------------------\n`)
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .establecerEnfatizado(1)
    .establecerTamanioFuente(1, 1)
    .texto(`${razonSocialVendedor}\n`)
    .establecerEnfatizado(0)
    .texto(`CUIT:${cuitVendedor}  Ingresos Brutos:${ingBrutosVendedor}\n`)
    .texto(`Inicio de actividades: ${inicioAct}\n`)
    .texto(`MONOTRIBUTISTA\n`)
    .texto(`A CONSUMIDOR FINAL\n`)
    .texto(`EMICION:${fechaEmicion}  Nro. Cbte.:${NroCompr}\n`)
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
    .texto(`Cliente:    Consumidor Final\n`)
    .texto(`Cuit:       12345678910\n`)
    .texto(`Conidicion: Consumidor Final\n`)
    .texto(`------------------------------------------------\n`)
    .establecerEnfatizado(1)
    .textoConAcentos(`Descripción                              IMPORTE\n`)
    .establecerEnfatizado(0)
    .texto(`Cantidad/Precio unitario\n`)
    .texto(`------------------------------------------------\n`);
    for (let i = 0; i < 1; i++) {
      conector.establecerEnfatizado(1)
              .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
              .texto(`${listProduct[6].name}\n`)
              .establecerEnfatizado(0);
      infoCantUni = `Uni: ${listProduct[6].cantidad} // $ ${listProduct[6].precio}`;
      precioTotal = `${(listProduct[6].cantidad*listProduct[6].precio).toFixed(2)}`;
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
            .texto(`TOTAL:                            $ ${(listProduct[6].cantidad*listProduct[6].precio).toFixed(2)}\n`)
            .establecerEnfatizado(0)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .imagenLocal("C:/Users/Martin Bertello/Desktop/PRUEBAS/qeafip.PNG")
            .texto(`00152369558745698520011544635829965447851\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
            .texto(`C.A.E: 15398547862140\n`)
            .texto(`Vencimiento: 25/09/2021\n`)
            .texto(`------------------------------------------------\n`)
            .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
            .texto(`Gracias por su Compra!\n`)
            .texto(`Visite nuestra página WEB!\n`)
            .texto(`www.prysoft.com.ar\n`)
            .cortar() 
            .feed(4)
      .imprimirEn("80mm Series Printer");
})
/*VARIOS IMPRESIONES
const conector = new ConectorPlugin()
        .texto("Texto de la impresora. Un feed de 3:\n")
        .feed(3)
        .establecerEnfatizado(1)
        .texto("Texto con emphasize en 1\n")
        .establecerEnfatizado(0)
        .texto("Texto con emphasize en 0\n")
        .establecerFuente(ConectorPlugin.Constantes.FuenteA)
        .texto("Fuente A\n")
        .establecerFuente(ConectorPlugin.Constantes.FuenteB)
        .texto("Fuente B\n")
        .establecerFuente(ConectorPlugin.Constantes.FuenteC)
        .texto("Fuente C\n")
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
        .texto("Alineado al centro\n")
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
        .texto("Alineado a la izquierda\n")
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionDerecha)
        .texto("Alineado a la derecha\n")
        .establecerTamanioFuente(1, 1)
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda); // <- Aquí dejamos de encadenar los métodos, puedes encadenarlos o llamar a la misma operación en cada paso
    // Nota: El tamaño máximo es 8,8 pero no lo pongo porque consume demasiado papel. Para la demostración solo pongo hasta el 3
    for (let i = 1; i <= 3; i++) {
        conector.establecerTamanioFuente(i, i)
            .texto(`Texto con size ${i},${i}\n`);
    }
    conector
        .feed(1)
        .establecerTamanioFuente(1, 1)
        .texto("Un QR nativo (a veces no funciona):\n")
        .qr("Soy un código QR | https://parzibyte.me/blog")
        .feed(1)
        .textoConAcentos("Un código de barras:\n")
        .codigoDeBarras("123", ConectorPlugin.Constantes.AccionBarcode39)
        .feed(1)
        .texto("Un QR como imagen en el centro (funciona la mayoría de veces):\n")
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
        .qrComoImagen("Parzibyte")
        .establecerTamanioFuente(1, 1)
        .texto("¿Cuál es el avatar de Parzibyte en GitHub?\n")
        .imagenDesdeUrl("https://github.com/parzibyte.png")
        .abrirCajon() // Abrir cajón de dinero. Opcional
        .cortar() // Cortar
    // impresora.cutPartial(); // Cortar parcialmente (opcional)
    // Recomiendo dejar un feed de 4 al final de toda impresión
    conector.feed(4)
    const respuestaAlImprimir = await conector.imprimirEn(nombreImpresora);

*/

/* ACENTOS
const cadenaConAcentos = "María José come Ñampi\n";
    const respuestaAlImprimir = await new ConectorPlugin()
        .texto("Tratando de imprimir acentos sin forzar:\n")
        .texto(cadenaConAcentos)
        .texto("Ahora tratando de imprimir acentos, pero forzando:\n")
        
        Nota: solo hace falta llamar a "textoConAcentos" una vez, eso "habilita" los acentos
        y las siguientes llamadas a "text" ya deben soportar acentos
        
        .textoConAcentos(cadenaConAcentos)
        .texto("Texto con acentos y centrado:")
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
        .texto(cadenaConAcentos)
        .feed(3) // Dejar 3 saltos de línea. Esto es muy importante
        .cortar()
        .imprimirEn(nombreImpresora); */


//calculo e longitud

