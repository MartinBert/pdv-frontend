import { sprintf } from 'sprintf-js/src/sprintf';

export function escapeCharacters(str){
    const safeString = 
    str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(String.fromCharCode(92),String.fromCharCode(92,92))
    .replace(String.fromCharCode(47),String.fromCharCode(92,47))
    .replace(/%40/gi, '@') 
    .replace(/%3A/gi, ':') 
    .replace(/%24/g, '$') 
    .replace(/%2C/gi, ',') 
    .replace(/%20/g, '+') 
    .replace(/%5B/gi, '[')
    .replace(/%20/g, '+') 
    .replace(/%5D/gi, ']');

    return safeString;
}

export function addZerosInString(numZeros, str){
    return sprintf(`"%${numZeros}d"`, str).replace(/"/g, ''); 
}