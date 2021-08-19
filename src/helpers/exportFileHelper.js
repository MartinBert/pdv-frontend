import saveAs from 'file-saver';
import XLSX from 'xlsx';

export function exportPDF(res) {
    let file = new Blob([res["data"]], { type: "application/pdf" });
    let fileURL = URL.createObjectURL(file);
    return window.open(fileURL, "_blank");
}

export function exportPDF1(res) {
    let file = new Blob([res["data"]], { type: "application/pdf" });
    let fileURL = URL.createObjectURL(file);
    return window.open(fileURL, "_blank");
}

export function exportExcel(headers, data) {
    let wb = XLSX.utils.book_new();
    wb.Props = {
        Title: "productos",
        CreatedDate: new Date()
    };
    wb.SheetNames.push("productos");
    let ws_data = [headers];
    data.forEach(el => {
        ws_data.push([
            el.nombre,
            el.codigoProducto,
            el.codigoBarra,
            el.distribuidores,
            el.marca,
            el.rubro,
            el.propiedades,
            el.atributos,
            el.ivaComprasObject,
            el.ivaVentasObject,
            el.costoBruto,
            el.costoNeto,
            el.ivaCompra,
            el.ganancia,
            el.precioSinIva,
            el.ivaVenta,
            el.precioTotal
        ])
    })
    let ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.Sheets["productos"] = ws;
    let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    function s2ab(s) {
        let buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "productos.xlsx");
}

export function exportExcelLibro(headers, data) {
    let wb = XLSX.utils.book_new();
    wb.Props = {
        Title: "Libroiva",
        CreatedDate: new Date()
    };
    wb.SheetNames.push("LibroivaVentas");
    let ws_data = [headers];
    data.forEach(el => {
        ws_data.push([
            el.fecha,
            el.nombre,
            el.numero,
            el.razonSocial,
            el.cuit,
            el.netoGrabado,
            el.totalIva27,
            el.totalIva21,
            el.totalIva10,
            el.totalIva0,
            el.totalVenta,
        ])
    })
    let ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.Sheets["LibroivaVentas"] = ws;
    let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    function s2ab(s) {
        let buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "libroiva.xlsx");
}