import { validPhoneNumber, validateEmail, validDocumentNumber } from './shared/utils.js';


const inputPhoneNumber = document.getElementById('numero_celular');
const inputDocumentMail = document.getElementById('correo_electronico');
const inputDocumentNumber = document.getElementById('numero_documento_loan');


const validateInputs = () => {
    
    inputPhoneNumber.onkeypress = validPhoneNumber;
    
    inputDocumentMail.oninput = validateEmail;

    inputDocumentNumber.onkeypress = validDocumentNumber;
    
}


const main = async () => {
    validateInputs();
}

main();
