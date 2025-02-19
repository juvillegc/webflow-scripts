export function convertToDecimal(value) {
    return value / 100;
}

export function convertToPercentage(value) {
    return value * 100;
}

export function roundDecimals(value) {
    return Math.round(value * 100) / 100;
}

export function round(value) {
    return Math.round(value);
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
      
   event.target.value = event.target.value.replace(/\s/g, "");
    
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

export function validateEmail(event) {
    const target = event.target;
    const validateEmail = String(target.value)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );

    const idElementError = `error-message-${target.id}`;
    const elementError = document.getElementById(idElementError);

    if (validateEmail) {
        target.classList.remove('input-class__error');
        if(elementError) {
            elementError.remove();
        }
    } else if (!elementError) {
        target.classList.add('input-class__error');
        const paragraphHtml = `<p id="${idElementError}" class="input-message__error">Ingrese un correo válido</p>`;
        target.insertAdjacentHTML('afterend', paragraphHtml);
    }
}

export function validDocumentNumber(event) {
    if (!onlyNumberKey(event)) return false;
    if (!limitCharacters(event, 15)) return false;
    return true;
}

export const removeAllOptions = (select) => {
    while (select.options.length > 0) {
        select.remove(0);
    }
}

export const addFirstOption = (label, select) => {
    const option = document.createElement('option');
    option.value = "";
    option.disabled = true;
    option.selected = true;
    option.innerHTML = label;
    select.appendChild(option);
}

export const normalizeTex = (str) => {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Elimina tildes
        .replace(/ñ/g, 'n') // Reemplaza ñ por n
        .replace(/Ñ/g, 'N') // Reemplaza Ñ por N
        .replace(/,/g, ''); // Elimina comas
};


