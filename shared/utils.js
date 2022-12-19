export function convertToDecimal(value) {
    return value / 100;
}

export function convertToPercentage(value) {
    return value * 100;
}

export function roundDecimals(value) {
    return Math.ceil(value * 100) / 100;
}

export function onlyNumberKey(event) {
    const ASCIICode = (event.which) ? event.which : event.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
        return false;
    return true;
}

export function limitCharacters(event, limit) {
    if (event.target.value.length < limit)
        return true;
    return false;
}

export function validPhoneNumber(event) {
    if (!onlyNumberKey(event)) return false;
    if (!limitCharacters(event, 10)) return false;
    return true;
}

export function cleanMask(value) {
    if(!value) return '';
    return value.replace(/\./gi, '');
}

export function maskValue(value) {
    if(!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function handleKeyUpThousandSeparators(event) {
    var tempNumber = cleanMask(event.target.value);
    var commaSeparatedNumber = tempNumber.split(/(?=(?:\d{3})+$)/).join('.');
    event.target.value = commaSeparatedNumber;
}