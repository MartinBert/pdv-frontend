export function calculateImportWithoutIvaPercent(totalVenta, ivaPercent) {
    return roundTwoDecimals(totalVenta / (1 + decimalPercent(ivaPercent)));
}

export function calculateAlicIvaImporteVentas(totalVenta, baseImp) {
    return roundTwoDecimals(totalVenta - baseImp);
}
export function generateBarCode() {
    const barCode = Math.floor(1e9 + (Math.random() * 9e9));
    return barCode;
}

export function decimalPercent(integerPercent) {
    return integerPercent / 100;
}

export function calculatePercentaje(number, percent) {
    return roundTwoDecimals(Number(number) * decimalPercent(Number(percent)));
}

export function calculateAmountPlusPercentaje(number, percent) {
    return roundTwoDecimals(number * (1 + decimalPercent(percent)))
}

export function calculateAmountMinusPercentaje(number, percent) {
    return roundTwoDecimals(number * (1 - decimalPercent(percent)))
}

export function calculatePercentReductionInAmount(number, percent) {
    return roundTwoDecimals(Number(number) / (1 + decimalPercent(percent)));
}

export function sumarNumeros(array) {
    return roundTwoDecimals(array.reduce((acc, el) => acc + Number(el)));
}

export function restarNumeros(array) {
    return roundTwoDecimals(array.reduce((acc, el) => acc - Number(el)));
}

export function ordenarMayorMenor(array) {
    return array.sort((a, b) => a - b);
}

export function promediar(array) {
    const total = sumarNumeros(array);
    return roundTwoDecimals(total / array.length);
}

export function roundTwoDecimals(number) {
    return Math.round((number) * 100) / 100;
}

export function generateFiveDecimalCode() {
    const minm = 10000;
    const maxm = 99999;
    const fiveDecimalCode = Math.floor(Math.random() * (maxm - minm + 1)) + minm;

    return fiveDecimalCode;
}