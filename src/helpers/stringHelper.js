import { sprintf } from 'sprintf-js/src/sprintf';

export function addZerosInString(numZeros, str) {
    return sprintf(`"%${numZeros}d"`, str).replace(/"/g, '');
}