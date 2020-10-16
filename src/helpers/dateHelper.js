export function formatDate(str) {
    let character = /-/gi;
    let firstDate = str.replace(character, '');
    firstDate = firstDate.substring(0, 8);
    let year = firstDate.substring(0, 4);
    let month = firstDate.substring(4, 6);
    let day = firstDate.substring(6, 8);
    let date = day + '/' + month + '/' + year;

    return date;
}

export function getCurrentDate() {
    var generatedFecha = new Date();
    var day = generatedFecha.getDate().toString();
    if (day.length == 1) {
        day = "0" + day;
    }
    var month = (generatedFecha.getMonth() + 1).toString();
    if (month.length == 1) {
        month = "0" + month;
    }
    var fecha = generatedFecha.getFullYear().toString() + month + day;
    return fecha;
}