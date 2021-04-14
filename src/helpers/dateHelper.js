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

export function formatDateWithoutSlash(str) {
    let character = /-/gi;
    let firstDate = str.replace(character, '');
    firstDate = firstDate.substring(0, 8);
    let year = firstDate.substring(0, 4);
    let month = firstDate.substring(4, 6);
    let day = firstDate.substring(6, 8);
    let date = year + month + day;

    return date;
}

export function formatWithSlash() {
    const stringDate = getCurrentDate();
    let year = stringDate.substring(0, 4);
    let month = stringDate.substring(4, 6);
    let day = stringDate.substring(6, 8);
    let date = year + '-' + month + '-' + day;

    return date;
}

export function getCurrentDate() {
    let generatedFecha = new Date();
    let day = generatedFecha.getDate().toString();
    if (day.length === 1) {
        day = "0" + day;
    }
    let month = (generatedFecha.getMonth() + 1).toString();
    if (month.length === 1) {
        month = "0" + month;
    }
    let fecha = generatedFecha.getFullYear().toString() + month + day;
    return fecha;
}

export function generateIntegerDate(date) {
    const integerDate  = new Date(date).getTime();
    return integerDate;
}

export function getYearsList() {
    const currentYear = new Date().getFullYear()
    let years = []
    if (currentYear > 2020) {
        for (var i = currentYear; i >= 2020; i--) {
            years.push(i);
        }
    } else {
        years.push(currentYear);
    }

    return years;
}

export function getInternationalDate() {
    const date = new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    return parseInt(date.replace(/-/g, ''));
}

export const monthsList = [
    { 'value': '01', 'text': 'Enero', },
    { 'value': '02', 'text': 'Febrero', },
    { 'value': '03', 'text': 'Marzo', },
    { 'value': '04', 'text': 'Abril', },
    { 'value': '05', 'text': 'Mayo', },
    { 'value': '06', 'text': 'Junio', },
    { 'value': '07', 'text': 'Julio', },
    { 'value': '08', 'text': 'Agosto', },
    { 'value': '09', 'text': 'Septiembre', },
    { 'value': '10', 'text': 'Octubre', },
    { 'value': '11', 'text': 'Noviembre', },
    { 'value': '12', 'text': 'Diciembre' }
]