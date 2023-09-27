
import { validPhoneNumber, validateEmail, validDocumentNumber } from './shared/utils.js';
import { inputEvent } from './shared/date-format.js';


const inputDocumentMail = document.getElementById('correo_electronico');
const inputDocumentNumber = document.getElementById('numero_documento');
const inputDateTakeMoney = document.getElementById('fecha_recarga');
const inputPhoneNumber = document.querySelectorAll('.numero_cedula_gamer');


const validateInputs = () => {
    
   inputPhoneNumber.forEach((input) => {
        input.onkeypress = validPhoneNumber;
    });
    
    inputDocumentMail.oninput = validateEmail;

    inputDocumentNumber.onkeypress = validDocumentNumber;

    inputDateTakeMoney.oninput = inputEvent;
    
}


const main = async () => {
    validateInputs();
}

main();
