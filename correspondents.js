import {onlyNumberKey, handleKeyUpThousandSeparators, validPhoneNumber} from './shared/utils.js';
import {inputEvent} from './shared/date-format.js';

const inputDocumentNumber = document.getElementById('numero_celular');
inputDocumentNumber.onkeypress = validPhoneNumber;

const customPrice = document.querySelectorAll('.custom-price');
customPrice.forEach((input) => {
    input.onkeyup = handleKeyUpThousandSeparators;
    input.onkeypress = onlyNumberKey;
});

const inputDateTakeMoney = document.getElementById('fecha_recarga');
inputDateTakeMoney.oninput = inputEvent;