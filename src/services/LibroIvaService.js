import  XLSX  from 'xlsx';
import { saveAs } from 'file-saver';

export default function orderSales(lista,factA,factB,factC,txt,excel){

  //variables para ordenar
  let filroFactA =[];
  let filroFactB =[];
  let filroFactC =[];
  let listaFacturas = [];
  let libroIvaOrden = [];
  //variables para archivo excel
  let dataExcel =[];
  //variable para LID Ventas
  let fechaEmisionTXT;
  let tipoComprobanteTXT;
  let numeroPDVTXT;
  let nroComprobanteTXT;
  let itemLibroIvaTXT;
  let nroDocumentoTXT;
  let nroCuitCompradorTXT;
  let nameCompradorTXT ="";
  let importeTotalTXT ="";
  let importeConceptosprecioNetoAgravado ="";
  let perceptionANoCategorizados ="";
  let importeOperacionesExentas="";
  let importePercepcOPagosACuentaImpNacionales="";
  let importePercepcionIngBrutos ="";
  let importePercepcionImpMunicipales="";
  let importeImpuestosInternos="";
  let codigoDeMoneda ="";
  let tipoDeCambio="";
  let cantAlicuotaIVA ="";
  let codigoOperacion ="";
  let otrosTributos ="";
  let fechaVencimientoPago ="";
  let libroIvaTXT = [];

 /*filtro lo que el usuario quiere sacar por el excel */
if(factA){
  filroFactA= lista.filter(factura=>{
    if(factura.nombreDocumento === "FACTURAS A"){
      return true
    }
  })
  filroFactA.forEach(facturaA=> listaFacturas.push(facturaA))
}
if(factB){
  filroFactB= lista.filter(factura=>{
    if(factura.nombreDocumento === "FACTURAS B"){
      return true
    }
  })
  filroFactB.forEach(facturaB=> listaFacturas.push(facturaB))
}
if(factC){
  filroFactC= lista.filter(factura=>{
    if(factura.nombreDocumento === "FACTURAS C"){
      return true
    }
  })
  filroFactC.forEach(facturaC=> listaFacturas.push(facturaC))
}

/*armo el array que va a salir por el excel */
let libroIva = listaFacturas;

  if(libroIva.length === 0){
    console.log("No ha seleccionado facturas")
  }else if(listaFacturas.length > 1){
      /*orden por dia */
    libroIva.sort((a, b)=>{
      let diaA =(a.fechaEmision.slice(0,2))
      let mesA =(a.fechaEmision.slice(3,5))
      let anoA =(a.fechaEmision.slice(6,10))
      let fechaA =`${mesA}/${diaA}/${anoA}`
      let fA = new Date(fechaA)
    
      let diaB =(b.fechaEmision.slice(0,2))
      let mesB =(b.fechaEmision.slice(3,5))
      let anoB =(b.fechaEmision.slice(6,10))
      let fechaB =`${mesB}/${diaB}/${anoB}`
      let fB = new Date(fechaB)
    
      if(fA<fB){
        return -1
      }
      if(fA>fB){
        return 1
      }
      return 0
    })
    
    /*orden por numeros de comprobantes dentro de cada dia */
    libroIva.forEach((item,index)=>{
      if(index < (libroIva.length-1) ){
        if(index==0){
          if(item.fechaEmision === libroIva[index+1].fechaEmision){
            let fechas = libroIva.filter(item2=>{
              if(item2.fechaEmision === item.fechaEmision){
                return true
              }
            })
            fechas.sort((a,b)=>{
              let numA = a.numeroCbte.slice(5);
              let numB = b.numeroCbte.slice(5);
              if(Number(numA) < Number(numB) ){
                return -1
              }
              if(Number(numA) > Number(numB) ){
                return 1
              }
                return 0
            })
            fechas.forEach(item => libroIvaOrden.push(item))
    
          }else{
            libroIvaOrden.push(item);
          }
        }else{
          if(item.fechaEmision === libroIva[index+1].fechaEmision && index!=0){
            if(item.fechaEmision !== libroIva[index-1].fechaEmision){
              let fechas = libroIva.filter(item2=>{
                if(item2.fechaEmision === item.fechaEmision){
                  return true
                }
              })
    
              fechas.sort((a,b)=>{
                let numA = a.numeroCbte.slice(5);
                let numB = b.numeroCbte.slice(5);
                if(Number(numA) < Number(numB) ){
                  return -1
                }
                if(Number(numA) > Number(numB) ){
                  return 1
                }
                  return 0
              })
              fechas.forEach(item => libroIvaOrden.push(item))
            }
          }else if(item.fechaEmision !== libroIva[index-1].fechaEmision && index!=0){
            libroIvaOrden.push(item);
          } 
        }
       }
        if(index === (libroIva.length-1)){
          if(item.fechaEmision !== libroIva[index-1].fechaEmision){
            libroIvaOrden.push(item);
          }
        }
    })
    

  }else{
    libroIvaOrden = libroIva;
  }
  

//generacion archivo excel
    libroIvaOrden.forEach(item =>{

      let tipoComprobante;
      let letra;
      if(item.nombreDocumento === "FACTURAS A"){
        tipoComprobante = "FA";
        letra = "A";
      }else if(item.nombreDocumento === "FACTURAS B"){
        tipoComprobante = "FB";
        letra = "B";
      }else{
        tipoComprobante = "FC";
        letra = "C";
      }

      let numCompr1 = item.numeroCbte.slice(0,4);
      let numCompr2 = item.numeroCbte.slice(5,13);
      let Comprobante={
        "Fecha":item.fechaEmision,
        "Tipo":tipoComprobante,
        "Comprobante":`${letra} 0${numCompr1} ${numCompr2}`,
        "Razón Social":item.cliente.razonSocial,
        "CUIT":item.cliente.condicionIva.nombre == "Consumidor Final" ? null : item.cliente.cuit,
        "Neto":`${(item.totalVenta-item.totalIvas).toFixed(2)}`,
        "Alic.":`21,00 %`,
        "I.V.A":item.totalIvas.toFixed(2),
        "Exento/NG":"0,00",
        "Per.IVA":"0,00",
        "Per.IB":"0,00",
        "Total": item.totalVenta.toFixed(2)
      }
      dataExcel.push(Comprobante)
    })
    
    let wb = XLSX.utils.book_new();
    wb.SheetNames.push("Test Sheet");
    let ws = XLSX.utils.json_to_sheet(dataExcel);
    wb.Sheets["Test Sheet"]=ws;

    function s2ab(s) { 
      var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
      var view = new Uint8Array(buf);  //create uint8array as viewer
      for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
      return buf;    
  }

    let wbout = XLSX.write(wb,{bookType:'xlsx',type:'binary'})

    if(dataExcel.length !=0 && excel){
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'LibroIvaPrueba.xlsx');
    }

//generacion arhivo txt (LID Ventas)
libroIvaOrden.forEach(venta =>{

  //diseño de los 8 numeros fecha emitida
  fechaEmisionTXT= (venta.fechaEmision.slice(6,10))+(venta.fechaEmision.slice(3,5))+(venta.fechaEmision.slice(0,2));

  //diseño de 3 numeros del tipo de comprobante segun afip
  tipoComprobanteTXT = venta.documentoComercial.codigoDocumento;

  //diseño 5 numeros para el punto de venta
  numeroPDVTXT = `0${venta.numeroCbte.slice(0,4)}`

  //diseño de los 20 numeros del numero de comprobante (se repiten porque van desde -- hasta -- , y es el mismo)
  let longNumCompr = venta.correlativoComprobante.length;
  let faltan0NumCompr = 20 - longNumCompr;
  let cerosNumCompr="";
  for(let i = 0; i<faltan0NumCompr;i++){
    cerosNumCompr += "0";
  }
  nroComprobanteTXT = cerosNumCompr+venta.correlativoComprobante

  //diseño de 2 numeros para el tipo de documento
  nroDocumentoTXT= venta.cliente.condicionIva.nombre == "Consumidor Final" ? "99" : "80";

  //diseño de 20 numeros para el tipo de nroCuitCompradorTXT
  if(venta.cliente.condicionIva.nombre === "Consumidor Final"){
    nroCuitCompradorTXT = "00000000000000000000"
  }else{
    let longCuit = venta.cliente.cuit.length;
    let faltan0NumCuit = 20 - longCuit;
    let cerosNumCuit="";
    for(let i = 0; i < faltan0NumCuit;i++){
      cerosNumCuit += "0";
    }
    nroCuitCompradorTXT = cerosNumCuit+venta.cliente.cuit
  }

  //diseño de 30 numeros para el nombre del comprador
 
  nameCompradorTXT = venta.cliente.razonSocial
  nameCompradorTXT = nameCompradorTXT.toUpperCase()

  if(nameCompradorTXT.length > 30){
    nameCompradorTXT= nameCompradorTXT.slice(0,30)
  }else if(nameCompradorTXT.length < 30){
    let longName = nameCompradorTXT.length;
    let faltanEspaciosName = 30 - longName;
    let EspaciosName="";
    for(let i = 0; i < faltanEspaciosName;i++){
      EspaciosName += " ";
    }
    nameCompradorTXT = nameCompradorTXT+EspaciosName
  }

  //diseño de 15 numeros para el importe total
  importeTotalTXT = (venta.totalVenta).toFixed(2);
  let decimal1 = importeTotalTXT.length - 2;
  let decimalImporteTotal = importeTotalTXT.slice(decimal1,importeTotalTXT.length);
  let entero1 = importeTotalTXT.length - 3;
  let enteroImporteTotal = importeTotalTXT.slice(0,entero1);
  let numTotal = enteroImporteTotal+decimalImporteTotal;
  let numTotalCon0 = "";
  if( numTotal.length < 15){
    let cantCeros = 15 - numTotal.length
    for(let i =0 ; i < cantCeros ; i++){
      numTotalCon0 += "0"
    }
  }
  importeTotalTXT = numTotalCon0 + numTotal
  //diseño de 15 numeros para el conceptos que no integran el precio neto grabado (no tenemos nada todo 0)
  importeConceptosprecioNetoAgravado = "000000000000000";
  //diseño de 15 numeros Percepción a no categorizados (no tenemos nada todo 0)
  perceptionANoCategorizados="000000000000000";
  //diseño de 15 numeros Importe de operaciones exentas (no tenemos nada todo 0)
  importeOperacionesExentas="000000000000000";
  //diseño de 15 numeros Importe de percepciones o pagos a cuenta deimpuestos Nacionales (no tenemos nada todo 0)
  importePercepcOPagosACuentaImpNacionales="000000000000000";
  //diseño de 15 numeros Importe de percepciones de Ingresos Brutos (no tenemos nada todo 0)
  importePercepcionIngBrutos="000000000000000";
  //diseño de 15 numeros Importe de percepciones impuestos Municipales (no tenemos nada todo 0)
  importePercepcionImpMunicipales="000000000000000";
  //diseño de 15 numeros Importe impuestos internos  (no tenemos nada todo 0)
  importeImpuestosInternos="000000000000000";
  //diseño de 3 numeros para el codigo de moneda, en pesos "PES"
  codigoDeMoneda = "PES"
  //diseño de 10 numeros para el tipo de cambio 6 para los decimales y 4 para los enteros, sin punto
  tipoDeCambio = "0001000000"
  //diseño de 1 numero para la cantidad de alicuotas de IVA
  cantAlicuotaIVA = "1"
  //diseño de 1 numero para Código de operación
  codigoOperacion= " ";
  //diseño de 15 numeros par aotros tributos 13 enteros 2 decimales sin punto decimal
  otrosTributos ="000000000000000";
  //diseño de 8 numeros para la fecha de vencimiento del pago
  fechaVencimientoPago ="00000000";

  itemLibroIvaTXT = fechaEmisionTXT+tipoComprobanteTXT+numeroPDVTXT+nroComprobanteTXT+
                    nroComprobanteTXT+nroDocumentoTXT+nroCuitCompradorTXT+nameCompradorTXT+importeTotalTXT+importeConceptosprecioNetoAgravado+
                    perceptionANoCategorizados+importeOperacionesExentas+importePercepcOPagosACuentaImpNacionales
                    +importePercepcionIngBrutos+importePercepcionImpMunicipales+importeImpuestosInternos+codigoDeMoneda
                    +tipoDeCambio+cantAlicuotaIVA+codigoOperacion+otrosTributos+fechaVencimientoPago+"\n"
  libroIvaTXT.push(itemLibroIvaTXT)
})
let date = new Date()
let mes = date.getMonth() + 1
let anio = date.getFullYear()

const a = document.createElement("a");
const contenido = libroIvaTXT
const blob = new Blob(contenido,{type:"text/plain"});
const url = window.URL.createObjectURL(blob);

a.href = url;
a.download = `LID Ventas ${mes}-${anio}`;
if(txt) a.click();

window.URL.revokeObjectURL(url)

//generacion arhivo txt (LID Ventas Alicuotas)
  
}