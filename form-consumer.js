
import { validPhoneNumber, validateEmail, validDocumentNumber, handleKeyUpThousandSeparators } from './shared/utils.js';
import { inputEvent } from './shared/date-format.js';


const inputDocumentMail = document.getElementById('correo_electronico');
const inputDocumentNumber = document.getElementById('numero_documento');
const inputDateTakeMoney = document.getElementById('fecha_recarga');
const inputPhoneNumber = document.querySelectorAll('.numero_cedula_gamer');
const customPrice = document.querySelectorAll('.custom-price');


const validateInputs = () => {
    
   inputPhoneNumber.forEach((input) => {
        input.onkeypress = validPhoneNumber;
    });

     customPrice.forEach((input) => {
        input.onkeyup = handleKeyUpThousandSeparators;
        input.onkeypress = onlyNumberKey;
    });
    
    inputDocumentMail.oninput = validateEmail;

    inputDocumentNumber.onkeypress = validDocumentNumber;

    inputDateTakeMoney.oninput = inputEvent;
    
}


const main = async () => {
    validateInputs();
}

main();
