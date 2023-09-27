
import { validPhoneNumber, validateEmail, validDocumentNumber } from './shared/utils.js';
import { inputEvent } from './shared/date-format.js';


const inputPhoneNumber = document.getElementById('numero_celular');
const inputDocumentMail = document.getElementById('correo_electronico');
const inputDocumentNumber = document.getElementById('numero_documento');
const inputDateTakeMoney = document.getElementById('fecha_recarga');


const validateInputs = () => {
    
    inputPhoneNumber.onkeypress = validPhoneNumber;
    
    inputDocumentMail.oninput = validateEmail;

    inputDocumentNumber.onkeypress = validDocumentNumber;

    inputDateTakeMoney.oninput = inputEvent;
    
}


const main = async () => {
    validateInputs();
}

main();
